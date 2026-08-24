(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !window.anime) return;

  var animate = window.anime.animate;
  var stagger = window.anime.stagger;
  var heroItems = document.querySelectorAll('[data-motion-hero-item]');

  if (heroItems.length) {
    animate(heroItems, {
      opacity: { from: 0 },
      y: { from: 10 },
      duration: 620,
      delay: stagger(75),
      ease: 'outQuint'
    });
  }

  var sections = document.querySelectorAll('[data-motion-section]');
  if (!sections.length) return;

  if (!('IntersectionObserver' in window)) return;

  Array.prototype.forEach.call(sections, function (section) {
    section.style.opacity = '0';
    section.style.transform = 'translateY(12px)';
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      animate(entry.target, {
        opacity: 1,
        y: 0,
        duration: 560,
        ease: 'outQuint'
      });
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  Array.prototype.forEach.call(sections, function (section) {
    observer.observe(section);
  });
})();
