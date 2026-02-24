/* ==============================================
   LFA Landing Page — Interactions v2
   Vanilla JS, no dependencies
   ============================================== */

(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var clamp = function (v, min, max) { return Math.min(Math.max(v, min), max); };

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==============================================
     1. REVEAL ON SCROLL
     ============================================== */
  function initReveal() {
    var els = $$('.reveal');
    if (!els.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    els.forEach(function (el) { observer.observe(el); });
  }

  /* ==============================================
     2. COUNTER ANIMATION
     ============================================== */
  function animateCounter(el) {
    var target = parseInt(el.dataset.target, 10);
    var suffix = el.dataset.suffix || '';
    var prefix = el.dataset.prefix || '';
    var separator = el.dataset.separator || '';
    var duration = 1800;
    var start = performance.now();

    function formatNumber(n) {
      if (!separator) return n.toString();
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    }

    function step(now) {
      var elapsed = now - start;
      var progress = clamp(elapsed / duration, 0, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);
      el.textContent = prefix + formatNumber(current) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    if (prefersReduced) {
      el.textContent = prefix + formatNumber(target) + suffix;
    } else {
      requestAnimationFrame(step);
    }
  }

  function initCounters() {
    var counters = $$('[data-target]');
    if (!counters.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ==============================================
     3. NAVBAR
     ============================================== */
  function initNavbar() {
    var nav = $('#nav');
    if (!nav) return;
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        nav.classList.toggle('nav-scrolled', window.scrollY > 60);
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ==============================================
     4. FEATURE SCREENSHOT TABS
     ============================================== */
  function initFeaturePanels() {
    function setupTabGroup(tabsId, panelsId) {
      var tabsContainer = $(tabsId);
      var panelsContainer = $(panelsId);
      if (!tabsContainer || !panelsContainer) return;

      var tabs = $$('.feature-tab', tabsContainer);
      var panels = $$('.feature-screenshot', panelsContainer);

      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          var idx = tab.dataset.tab;
          tabs.forEach(function (t) { t.classList.remove('feature-tab--active'); });
          tab.classList.add('feature-tab--active');
          panels.forEach(function (p) { p.classList.remove('feature-screenshot--active'); });
          panels.forEach(function (p) {
            if (p.dataset.panel === idx) p.classList.add('feature-screenshot--active');
          });
        });
      });
    }

    setupTabGroup('#featureTabsAzubi', '#featurePanelsAzubi');
    setupTabGroup('#featureTabsAusbilder', '#featurePanelsAusbilder');
  }

  /* ==============================================
     5. PARALLAX HERO
     ============================================== */
  function initParallax() {
    /* Hero parallax removed — no .hero__bg in Tailwind version */
  }

  /* ==============================================
     6. SMOOTH SCROLL
     ============================================== */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href');
        var target = $(id);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ==============================================
     7. FAQ ACCORDION
     ============================================== */
  function initFAQ() {
    var faqList = $('#faqList');
    if (!faqList) return;

    faqList.addEventListener('click', function (e) {
      var button = e.target.closest('.faq-question');
      if (!button) return;

      var item = button.parentElement;
      var isOpen = item.classList.contains('faq-item--open');

      /* Close all */
      $$('.faq-item--open', faqList).forEach(function (openItem) {
        openItem.classList.remove('faq-item--open');
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      /* Toggle clicked */
      if (!isOpen) {
        item.classList.add('faq-item--open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  }

  /* ==============================================
     INIT
     ============================================== */
  function init() {
    initReveal();
    initCounters();
    initNavbar();
    initFeaturePanels();
    initParallax();
    initSmoothScroll();
    initFAQ();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
