const languageCatalog = [
  'الإنجليزية', 'الإسبانية', 'الفرنسية', 'الألمانية', 'الإيطالية', 'التركية',
  'الصينية', 'اليابانية', 'الكورية', 'الروسية', 'البرتغالية', 'الهولندية',
  'السويدية', 'اليونانية', 'العبرية', 'الهندية', 'الأوردو', 'الفارسية',
  'الإندونيسية', 'الماليزية', 'السواحلية', 'اللاتينية'
];

const languagePhotos = [
  '1521737711867-e3b97375f902', '1519671482749-fd09be7ccebf',
  '1467269204594-9661b134dd2b', '1527838832700-5059252407fa',
  '1526772662000-3f88f10405ff', '1500530855697-b586d89ba3ee'
];

const languageGrid = document.querySelector('#languageGrid');
const languageVideoGrid = document.querySelector('#languageVideoGrid');
const languageVideos = document.querySelector('.language-videos');

if (languageGrid && languageVideoGrid) {
  languageGrid.innerHTML = languageCatalog.map((name, index) => {
    const query = encodeURIComponent(`learn ${name} for beginners`);
    const photo = languagePhotos[index % languagePhotos.length];

    return `<article class="language-card">
      <img loading="lazy" src="https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=900&q=82" alt="تعلم ${name}">
      <div>
        <span>50 ج.م</span>
        <h3>${name} للمبتدئين</h3>
        <p>فيديوهات تأسيسية ومحادثة عملية.</p>
        <a href="https://www.youtube.com/results?search_query=${query}" target="_blank" rel="noopener">شاهد الفيديوهات على YouTube ↗</a>
        <button class="language-buy" data-title="${name} للمبتدئين" data-price="50 ج.م">اشترك الآن ↗</button>
      </div>
    </article>`;
  }).join('');

  languageVideoGrid.innerHTML = languageCatalog.map((name, index) => {
    const query = encodeURIComponent(`learn ${name} for beginners`);
    const photo = languagePhotos[(index + 2) % languagePhotos.length];

    return `<button type="button" class="language-video language-buy" data-title="${name} للمبتدئين" data-price="50 ج.م">
      <img loading="lazy" src="https://images.unsplash.com/photo-${photo}?auto=format&fit=crop&w=700&q=80" alt="فيديو ${name}">
      <span class="language-video-play">▶</span><b>فيديو ${name} للمبتدئين</b>
      <span class="language-video-lock">🔒 اشترك للمشاهدة — 50 ج.م</span>
    </button>`;
  }).join('');
}

// Keep language videos in their own final section at the bottom of the page.
if (languageVideos) {
  languageVideos.classList.add('section');
  document.querySelector('main')?.append(languageVideos);
}
