const themeToggle = document.createElement('button');
themeToggle.type = 'button';
themeToggle.className = 'theme-toggle';
themeToggle.setAttribute('aria-label', 'تفعيل الوضع الفاتح');

function setTheme(light) {
  document.body.classList.toggle('light-mode', light);
  themeToggle.textContent = light ? '☀' : '☾';
  themeToggle.setAttribute('aria-label', light ? 'العودة للوضع الداكن' : 'تفعيل الوضع الفاتح');
  localStorage.setItem('academy-theme', light ? 'light' : 'dark');
}

setTheme(localStorage.getItem('academy-theme') === 'light');
themeToggle.addEventListener('click', () => setTheme(!document.body.classList.contains('light-mode')));
document.querySelector('.nav')?.insertBefore(themeToggle, document.querySelector('.login'));
