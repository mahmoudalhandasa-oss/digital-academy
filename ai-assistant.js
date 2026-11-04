const aiLauncher = document.createElement('button');
aiLauncher.type = 'button';
aiLauncher.className = 'ai-launch';
aiLauncher.innerHTML = '<i>AI</i><span>AI مجاناً</span>';
document.querySelector('.nav')?.insertBefore(aiLauncher, document.querySelector('.login'));

const aiAssistant = document.createElement('aside');
aiAssistant.className = 'ai-assistant';
aiAssistant.setAttribute('aria-label', 'المساعد الذكي المجاني');
aiAssistant.innerHTML = `
  <div class="ai-head"><span class="ai-head-mark">AI</span><div><strong>مساعد Gemini الذكي</strong><small>اسأل أي سؤال — والدورات واللغات والبكالوريا</small></div><button class="ai-close" type="button" aria-label="إغلاق">×</button></div>
  <div class="ai-messages" aria-live="polite"></div>
  <div class="ai-suggestions"><button type="button" class="ai-suggestion">رشح لي دورة</button><button type="button" class="ai-suggestion">أي لغة أبدأ بها؟</button><button type="button" class="ai-suggestion">خطة للبكالوريا</button></div>
  <form class="ai-form"><input aria-label="اكتب سؤالك" placeholder="اكتب سؤالك هنا..." autocomplete="off"><button>إرسال</button></form>`;
document.body.append(aiAssistant);

const aiMessages = aiAssistant.querySelector('.ai-messages');
const aiInput = aiAssistant.querySelector('input');
const aiState = { topic: '', messages: [] };

function addAiMessage(text, kind = 'bot', extraClass = '') {
  const message = document.createElement('p');
  message.className = `ai-message ${kind} ${extraClass}`;
  message.textContent = text;
  aiMessages.append(message);
  aiMessages.scrollTop = aiMessages.scrollHeight;
  return message;
}

function normalizeArabic(text) {
  return text.toLowerCase().replace(/[إأآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/[^\u0600-\u06ff\w\s]/g, ' ');
}

function hasAny(text, words) {
  return words.some(word => text.includes(word));
}

function aiReply(question) {
  const q = normalizeArabic(question);
  const wantsPrice = hasAny(q, ['سعر', 'تكلفه', 'اشتراك', 'دفع', 'جنيه', 'كام', 'بكام', '50']);
  const wantsStart = hasAny(q, ['ابدا', 'ابدأ', 'ابدء', 'ترشح', 'رشح', 'انسب', 'افضل', 'اختار', 'اختيار']);
  const wantsPlan = hasAny(q, ['خطه', 'خطة', 'جدول', 'مده', 'مدة', 'وقت', 'ساعه', 'ساعات']);
  const isBacc = hasAny(q, ['بكالوريا', 'ثانويه', 'طالب', 'طلاب', 'ثانوي']);
  const isLanguage = hasAny(q, ['لغه', 'لغات', 'انجليزي', 'فرنسي', 'الماني', 'اسباني', 'تركي', 'صيني', 'ياباني', 'كوري']);
  const isCourse = hasAny(q, ['دوره', 'دورات', 'كورس', 'كورسات', 'برمجه', 'ذكاء', 'بيانات', 'امن', 'ويب', 'تطوير', 'python', 'react']);

  if (hasAny(q, ['شكرا', 'متشكر', 'تسلم'])) return 'العفو! أنا موجود لمساعدتك في اختيار المسار المناسب أو توضيح تفاصيل الاشتراك.';
  if (hasAny(q, ['مرحبا', 'اهلا', 'السلام'])) return 'أهلاً بك! أخبرني بهدفك: لغة جديدة، مهارة تقنية، أم مراجعة للبكالوريا؟';

  if (isBacc) {
    aiState.topic = 'baccalaureate';
    if (wantsPrice) return 'اشتراك محتوى البكالوريا الكامل هو 50 ج.م. اضغط «اشترك الآن عبر Vodafone Cash» في قسم البكالوريا لبدء الطلب.';
    if (wantsPlan) return 'للبكالوريا: ابدأ بشرح واحد قصير يومياً، ثم اكتب 3 نقاط مما فهمته وراجعها في نهاية الأسبوع. المحتوى يركز على البرمجة والذكاء الاصطناعي بصورة مبسطة.';
    return 'قسم البكالوريا يشرح البرمجة والذكاء الاصطناعي بطريقة مبسطة قبل الحفظ. يمكنك البدء بالفيديوهات ثم الاشتراك لفتح الشرح الكامل بسعر 50 ج.م.';
  }

  if (isLanguage || aiState.topic === 'language') {
    aiState.topic = 'language';
    if (wantsPrice) return 'مسار كل لغة وفيديوهاته بسعر 50 ج.م. بعد الاشتراك ستتمكن من متابعة فيديوهات اللغة المقفلة أسفل الصفحة.';
    if (hasAny(q, ['انجليزي', 'انجليز'])) return 'الإنجليزية خيار ممتاز للبداية؛ ستفيدك في الدراسة والعمل والمصادر التقنية. ابدأ بمسار المبتدئين ثم طبّق بالمحادثة يومياً 15 دقيقة.';
    if (wantsStart) return 'إن كانت هذه أول لغة لك، ابدأ بالإنجليزية. وللسفر أو الدراسة في أوروبا اختر الفرنسية أو الألمانية أو الإسبانية حسب هدفك. جميع المسارات مناسبة للمبتدئين.';
    if (wantsPlan) return 'خطة بسيطة للغة: 20 دقيقة يومياً للفيديو، و10 دقائق لمفردات جديدة، ثم 10 دقائق استماع أو تكرار بصوت مرتفع. الاستمرارية أهم من عدد الساعات.';
    return 'لدينا 22 لغة للمبتدئين، منها الإنجليزية والفرنسية والألمانية والإسبانية والتركية والصينية واليابانية والكورية. ما اللغة التي تفكر في تعلمها؟';
  }

  if (isCourse || aiState.topic === 'course') {
    aiState.topic = 'course';
    if (wantsPrice) return 'المنصة تضم دورات مجانية وأخرى مدفوعة بالجنيه والدولار. استخدم الفلاتر أعلى قسم الدورات لتظهر الأسعار المناسبة لك.';
    if (hasAny(q, ['python', 'بايثون', 'ذكاء', 'ai'])) return 'أنصحك بالبدء بمقدمة في Python ثم مدخل الذكاء الاصطناعي، وبعدها تحليل البيانات أو التعلم العميق. هذا ترتيب مناسب للمبتدئ.';
    if (hasAny(q, ['ويب', 'موقع', 'front', 'react', 'html'])) return 'لمسار تطوير الويب: ابدأ بـ HTML وCSS، ثم JavaScript، وبعدها React. لا تنتقل للمرحلة التالية قبل تنفيذ مشروع صغير.';
    if (hasAny(q, ['امن', 'سيبراني', 'حمايه'])) return 'لمسار الأمن السيبراني: ابدأ بأساسيات الشبكات، ثم مبادئ الحماية، وبعدها الاختبار الأخلاقي والتشفير. المعرفة بالشبكات مهمة قبل الأدوات.';
    if (hasAny(q, ['بيانات', 'data', 'sql'])) return 'لمسار البيانات: ابدأ بـ Excel أو أساسيات البيانات، ثم SQL، وبعدها Python للتحليل. نفّذ مشروعاً بسيطاً بعد كل مرحلة.';
    if (wantsStart) return 'إذا كنت مبتدئاً تماماً، اختر تطوير الويب أو Python؛ كلاهما يعطيك أساساً قوياً. أخبرني هل هدفك وظيفة، مشروع شخصي، أم دراسة؟';
    return 'تتوفر دورات في تطوير الويب والذكاء الاصطناعي والأمن السيبراني والبيانات والعمل الحر. قل لي هدفك أو مستواك وسأرشح لك نقطة بداية.';
  }

  if (wantsPrice) return 'اللغات ومحتوى البكالوريا بسعر 50 ج.م، بينما الدورات التقنية بها خيارات مجانية ومدفوعة. عن أي قسم تريد معرفة السعر بالتحديد؟';
  if (hasAny(q, ['مساعده', 'ساعدني', 'كيف'])) return 'بكل سرور. اكتب هدفك أو المجال الذي تريد تعلمه، مثل: «أريد تعلم البرمجة من الصفر» أو «ما أفضل لغة أبدأ بها؟».';
  return 'يمكنني المساعدة في الدورات واللغات والبكالوريا. وللأسئلة العامة، فعّل مفتاح Gemini في الخادم ليجيبك الذكاء الاصطناعي على أي موضوع.';
}

async function askAi(question) {
  const text = question.trim();
  if (!text) return;
  addAiMessage(text, 'user');
  aiState.messages.push({ role: 'user', text });
  aiInput.value = '';
  const typing = addAiMessage('جاري التفكير...', 'bot', 'ai-typing');
  let answer = '';
  try {
    const response = await fetch('/api/ai/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: aiState.messages.slice(0, -1) })
    });
    if (response.ok) answer = (await response.json()).answer || '';
  } catch (_) {
    // The local assistant remains available when the site is opened as static files.
  }
  typing.remove();
  answer = answer || aiReply(text);
  aiState.messages.push({ role: 'assistant', text: answer });
  addAiMessage(answer);
}

addAiMessage('أهلاً! اسألني أي سؤال. ويمكنني أيضاً مساعدتك في الدورات واللغات والبكالوريا.');
aiLauncher.addEventListener('click', () => { aiAssistant.classList.add('show'); aiInput.focus(); });
aiAssistant.querySelector('.ai-close').addEventListener('click', () => aiAssistant.classList.remove('show'));
aiAssistant.querySelector('.ai-form').addEventListener('submit', event => { event.preventDefault(); askAi(aiInput.value); });
aiAssistant.querySelectorAll('.ai-suggestion').forEach(button => button.addEventListener('click', () => askAi(button.textContent)));
