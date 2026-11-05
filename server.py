"""Digital Academy backend — run with: py server.py"""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse
import json, sqlite3, hashlib, secrets, os
from urllib import request, error

DB = 'academy.db'
def reply(h, data, status=200):
    raw=json.dumps(data,ensure_ascii=False).encode(); h.send_response(status); h.send_header('Content-Type','application/json; charset=utf-8'); h.end_headers(); h.wfile.write(raw)
def init_db():
    with sqlite3.connect(DB) as db: db.execute('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,name TEXT NOT NULL,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL)')

def gemini_reply(message, history):
    """Return a Gemini answer, or None when Gemini is not configured/available."""
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        return None
    model = os.environ.get('GEMINI_MODEL', 'gemini-3.8-flash')
    instruction = (
        'أنت مساعد Gemini عام داخل موقع أكاديمية التحول الرقمي. أجب عن الأسئلة العامة '
        'والتعليمية واليومية بالعربية بوضوح وباختصار، واطلب توضيحاً عند غموض السؤال. '
        'عند السؤال عن الأكاديمية فقط: مسارات اللغات وفيديوهاتها بسعر 50 ج.م، '
        'ومحتوى البكالوريا الكامل 50 ج.م. لا تخترع أسعاراً أو روابط أو وعوداً غير موجودة. '
        'ارفض بلطف أي طلب ضار أو غير آمن واقترح بديلاً آمناً.'
    )
    contents = []
    for item in history[-6:]:
        role = 'model' if item.get('role') == 'assistant' else 'user'
        text = str(item.get('text', ''))[:1200]
        if text:
            contents.append({'role': role, 'parts': [{'text': text}]})
    contents.append({'role': 'user', 'parts': [{'text': message[:1200]}]})
    payload = json.dumps({
        'systemInstruction': {'parts': [{'text': instruction}]},
        'contents': contents,
        'generationConfig': {'temperature': 0.45, 'maxOutputTokens': 450}
    }).encode('utf-8')
    endpoint = f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent'
    call = request.Request(endpoint, data=payload, headers={
        'Content-Type': 'application/json', 'x-goog-api-key': api_key
    }, method='POST')
    try:
        with request.urlopen(call, timeout=20) as response:
            data = json.loads(response.read().decode('utf-8'))
        return data['candidates'][0]['content']['parts'][0]['text'].strip()
    except (error.URLError, error.HTTPError, KeyError, IndexError, ValueError):
        return None

class Academy(SimpleHTTPRequestHandler):
    sessions={}
    def current(self): return self.sessions.get(self.headers.get('Authorization','').replace('Bearer ',''))
    def do_GET(self):
        path=urlparse(self.path).path
        if path=='/api/health': return reply(self,{'status':'ok','courses':300})
        if path=='/api/courses': return reply(self,{'total':300,'items':[{'id':i+1,'type':'free' if i==0 else 'egp','source_url':'https://maharatech.gov.eg/course/'} for i in range(300)]})
        if path=='/api/me':
            user=self.current(); return reply(self,{'user':user} if user else {'user':None},200 if user else 401)
        return super().do_GET()
    def do_POST(self):
        path=urlparse(self.path).path
        try: data=json.loads(self.rfile.read(int(self.headers.get('Content-Length',0))) or b'{}')
        except Exception: return reply(self,{'error':'Invalid data'},400)
        if path == '/api/ai/gemini':
            message = str(data.get('message', '')).strip()
            history = data.get('history', [])
            if not message: return reply(self, {'error': 'Message is required'}, 400)
            if not isinstance(history, list): history = []
            answer = gemini_reply(message, history)
            return reply(self, {'answer': answer, 'provider': 'gemini' if answer else 'local'})
        if path=='/api/auth/logout': self.sessions.pop(self.headers.get('Authorization','').replace('Bearer ',''),None); return reply(self,{'ok':True})
        if path=='/api/auth/signup':
            name,email,password=data.get('name','').strip(),data.get('email','').strip().lower(),data.get('password','')
            if len(name)<2 or '@' not in email or len(password)<6:return reply(self,{'error':'تحقق من الاسم والبريد وكلمة المرور'},400)
            try:
                with sqlite3.connect(DB) as db: cur=db.execute('INSERT INTO users(name,email,password) VALUES(?,?,?)',(name,email,hashlib.sha256(password.encode()).hexdigest())); user={'id':cur.lastrowid,'name':name,'email':email}
            except sqlite3.IntegrityError:return reply(self,{'error':'البريد مستخدم بالفعل'},409)
        elif path=='/api/auth/login':
            with sqlite3.connect(DB) as db: row=db.execute('SELECT id,name,email FROM users WHERE email=? AND password=?',(data.get('email','').strip().lower(),hashlib.sha256(data.get('password','').encode()).hexdigest())).fetchone()
            if not row:return reply(self,{'error':'البريد أو كلمة المرور غير صحيحة'},401)
            user={'id':row[0],'name':row[1],'email':row[2]}
        else:return reply(self,{'error':'Not found'},404)
        token=secrets.token_urlsafe(32);self.sessions[token]=user;return reply(self,{'token':token,'user':user},201 if path.endswith('signup') else 200)

if __name__=='__main__':
    init_db();print('Digital Academy: http://localhost:8000');ThreadingHTTPServer(('',8000),Academy).serve_forever()
