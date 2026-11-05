const authModal = document.createElement('div');
authModal.className = 'auth-modal';
authModal.innerHTML = `
  <div class="auth-box" role="dialog" aria-modal="true" aria-labelledby="authTitle">
    <button class="auth-close" type="button" aria-label="إغلاق">×</button>
    <h2 id="authTitle">تسجيل الدخول</h2>
    <form id="authForm">
      <label id="nameField">الاسم<input name="name" autocomplete="name"></label>
      <label>البريد الإلكتروني<input name="email" type="email" autocomplete="email" required></label>
      <label>كلمة المرور<input name="password" type="password" autocomplete="current-password" minlength="6" required></label>
      <p id="authError" role="alert"></p>
      <button class="primary" type="submit">تسجيل الدخول</button>
    </form>
    <button id="authSwitch" type="button">إنشاء حساب جديد</button>
  </div>`;
document.body.append(authModal);

const authForm = authModal.querySelector('#authForm');
const authTitle = authModal.querySelector('#authTitle');
const nameField = authModal.querySelector('#nameField');
const authError = authModal.querySelector('#authError');
const authSwitch = authModal.querySelector('#authSwitch');
const authSubmit = authForm.querySelector('[type="submit"]');
const loginButton = document.querySelector('.login');
const authKey = 'dta_token';
let signup = false;

function setUser(user) {
  loginButton.dataset.logged = user ? 'true' : 'false';
  const label = loginButton.querySelector('.login-label');
  if (label) label.textContent = user ? `مرحباً، ${user.name}` : 'تسجيل الدخول';
  else loginButton.textContent = user ? `مرحباً، ${user.name}` : 'تسجيل الدخول ↗';
}

function setMode(isSignup) {
  signup = isSignup;
  nameField.style.display = signup ? 'grid' : 'none';
  nameField.querySelector('input').required = signup;
  nameField.querySelector('input').autocomplete = signup ? 'name' : 'off';
  authTitle.textContent = signup ? 'إنشاء حساب جديد' : 'تسجيل الدخول';
  authSubmit.textContent = signup ? 'إنشاء الحساب' : 'تسجيل الدخول';
  authSwitch.textContent = signup ? 'لدي حساب بالفعل' : 'إنشاء حساب جديد';
  authError.textContent = '';
}

function openAuth() {
  setMode(false);
  authModal.classList.add('show');
  authForm.elements.email.focus();
}

async function requestAuth(url, options) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'تعذّر إتمام الطلب. حاول مرة أخرى.');
  return data;
}

loginButton.addEventListener('click', async () => {
  if (loginButton.dataset.logged !== 'true') return openAuth();
  loginButton.disabled = true;
  try {
    await requestAuth('/api/auth/logout', {
      method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem(authKey) || ''}` }
    });
  } catch (_) {
    // Clear the local session even if the server was restarted.
  } finally {
    localStorage.removeItem(authKey);
    setUser(null);
    loginButton.disabled = false;
  }
});

authSwitch.addEventListener('click', () => setMode(!signup));
authModal.querySelector('.auth-close').addEventListener('click', () => authModal.classList.remove('show'));
authModal.addEventListener('click', event => { if (event.target === authModal) authModal.classList.remove('show'); });

authForm.addEventListener('submit', async event => {
  event.preventDefault();
  authError.textContent = '';
  authSubmit.disabled = true;
  authSubmit.textContent = 'جاري التحقق...';
  try {
    const data = await requestAuth(signup ? '/api/auth/signup' : '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(authForm)))
    });
    localStorage.setItem(authKey, data.token);
    setUser(data.user);
    authModal.classList.remove('show');
    authForm.reset();
  } catch (error) {
    authError.textContent = error.message === 'Failed to fetch'
      ? 'شغّل الخادم أولاً ثم أعد المحاولة.'
      : error.message;
  } finally {
    authSubmit.disabled = false;
    authSubmit.textContent = signup ? 'إنشاء الحساب' : 'تسجيل الدخول';
  }
});

(async () => {
  const token = localStorage.getItem(authKey);
  if (!token) return setUser(null);
  try {
    const data = await requestAuth('/api/me', { headers: { Authorization: `Bearer ${token}` } });
    setUser(data.user);
  } catch (_) {
    localStorage.removeItem(authKey);
    setUser(null);
  }
})();
