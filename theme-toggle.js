const themeToggle = document.createElement('button');
themeToggle.type = 'button';
themeToggle.className = 'theme-toggle';
themeToggle.setAttribute('aria-label', 'تفعيل الوضع الفاتح');

function setTheme(light) {
  document.body.classList.toggle('light-mode', light);
  themeToggle.innerHTML = light
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15.6A9 9 0 0 1 8.4 3 9 9 0 1 0 21 15.6Z"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15ZM12 0h1v3h-2V0h1Zm0 21h1v3h-2v-3h1ZM3 11v2H0v-2h3Zm21 0v2h-3v-2h3ZM4.2 2.8l2.1 2.1-1.4 1.4-2.1-2.1 1.4-1.4Zm15 15 2.1 2.1-1.4 1.4-2.1-2.1 1.4-1.4ZM21.2 4.2l-2.1 2.1-1.4-1.4 2.1-2.1 1.4 1.4Zm-15 15-2.1 2.1-1.4-1.4 2.1-2.1 1.4 1.4Z"/></svg>';
  themeToggle.setAttribute('aria-label', light ? 'العودة للوضع الداكن' : 'تفعيل الوضع الفاتح');
  localStorage.setItem('academy-theme', light ? 'light' : 'dark');
}

setTheme(localStorage.getItem('academy-theme') === 'light');
themeToggle.addEventListener('click', () => setTheme(!document.body.classList.contains('light-mode')));
document.querySelector('.nav-actions')?.prepend(themeToggle);
