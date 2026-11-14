(function () {
  'use strict';
  var root = document.documentElement;
  function syncLanguage() {
    var language = root.dataset.lang === 'zh' ? 'zh' : 'en';
    root.lang = language === 'zh' ? 'zh-Hans' : 'en';
    document.querySelectorAll('button[data-lang-value]').forEach(function (button) {
      var active = button.dataset.langValue === language;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-label-en]').forEach(function (element) {
      element.textContent = element.getAttribute('data-label-' + language);
    });
    document.querySelectorAll('[data-placeholder-en]').forEach(function (element) {
      element.placeholder = element.getAttribute('data-placeholder-' + language);
    });
    document.dispatchEvent(new CustomEvent('blog:language'));
  }
  document.querySelectorAll('[data-lang-value]').forEach(function (button) {
    button.addEventListener('click', function () {
      root.dataset.lang = button.dataset.langValue;
      try { localStorage.setItem('app_lang', root.dataset.lang); } catch (e) {}
      // A shared language link applies on arrival; subsequent choices take precedence.
      var url = new URL(location.href);
      if (url.searchParams.has('lang')) {
        url.searchParams.delete('lang');
        history.replaceState(null, '', url.pathname + url.search + url.hash);
      }
      syncLanguage();
    });
  });
  document.querySelectorAll('.md-reader img').forEach(function (image) {
    if (!image.hasAttribute('loading')) image.setAttribute('loading', 'lazy');
    if (!image.hasAttribute('decoding')) image.setAttribute('decoding', 'async');
  });
  syncLanguage();
})();
