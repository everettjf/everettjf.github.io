(function () {
  'use strict';
  document.querySelectorAll('.md-reader img').forEach(function (image) {
    if (!image.hasAttribute('loading')) image.setAttribute('loading', 'lazy');
    if (!image.hasAttribute('decoding')) image.setAttribute('decoding', 'async');
  });
  var article = document.querySelector('.post-article[data-bilingual]');
  if (!article) return;
  var root = document.documentElement;
  function syncLanguage() {
    var language = root.dataset.articleLang === 'zh' ? 'zh' : 'en';
    article.lang = language === 'zh' ? 'zh-Hans' : 'en';
    article.querySelectorAll('button[data-lang-value]').forEach(function (button) {
      var active = button.dataset.langValue === language;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }
  article.querySelectorAll('[data-lang-value]').forEach(function (button) {
    button.addEventListener('click', function () {
      root.dataset.articleLang = button.dataset.langValue;
      try { localStorage.setItem('article_lang', root.dataset.articleLang); } catch (e) {}
      var url = new URL(location.href);
      if (url.searchParams.has('lang')) {
        url.searchParams.delete('lang');
        history.replaceState(null, '', url.pathname + url.search + url.hash);
      }
      syncLanguage();
    });
  });
  syncLanguage();
})();
