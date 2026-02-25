/* ==============================================
   LFA Landing Page — Immersive Interactions v3
   Vanilla JS, no dependencies
   ============================================== */

(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var clamp = function (v, min, max) { return Math.min(Math.max(v, min), max); };

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==============================================
     1. REVEAL ON SCROLL (re-triggering)
     ============================================== */
  function initReveal() {
    var els = $$('.reveal');
    if (!els.length) return;

    /* Assign staggered delays to direct sibling reveal children only */
    els.forEach(function (el) {
      var parent = el.parentElement;
      if (!parent) return;
      /* Only count direct children that are .reveal — prevents deep nesting from inflating delays */
      var siblings = Array.prototype.slice.call(parent.children).filter(function(c) { return c.classList.contains('reveal'); });
      if (siblings.length > 1) {
        var idx = siblings.indexOf(el);
        if (idx > 0) {
          el.style.transitionDelay = Math.min(idx * 0.08, 0.4) + 's';
        }
      }
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
        } else {
          /* Only reset if element is above viewport (scrolled past and back up) */
          var rect = entry.boundingClientRect;
          if (rect.top > 0) {
            entry.target.classList.remove('reveal--visible');
          }
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function (el) { observer.observe(el); });
  }

  /* ==============================================
     2. COUNT-UP COUNTER (re-triggering)
     ============================================== */
  function formatNumber(num, separator) {
    if (!separator) return String(num);
    var str = String(num);
    var result = '';
    for (var i = str.length - 1, c = 0; i >= 0; i--, c++) {
      if (c > 0 && c % 3 === 0) result = separator + result;
      result = str[i] + result;
    }
    return result;
  }

  function animateCounter(el) {
    var target = parseInt(el.dataset.target, 10);
    var suffix = el.dataset.suffix || '';
    var prefix = el.dataset.prefix || '';
    var separator = el.dataset.separator || '';
    var duration = 1600;
    var start = null;

    if (el._raf) cancelAnimationFrame(el._raf);

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      /* ease-out curve */
      var ease = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(ease * target);
      el.textContent = prefix + formatNumber(current, separator) + suffix;
      if (progress < 1) {
        el._raf = requestAnimationFrame(step);
      }
    }
    el._raf = requestAnimationFrame(step);
  }

  function resetCounter(el) {
    if (el._raf) cancelAnimationFrame(el._raf);
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    el.textContent = prefix + '0' + suffix;
  }

  function initCounters() {
    var counters = $$('[data-target]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
        } else {
          resetCounter(entry.target);
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
     4. SMOOTH SCROLL
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
     5. FAQ ACCORDION
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
     6. SUBTLE PARALLAX ON SCROLL
     ============================================== */
  function initScrollEffects() {
    /* Removed — section opacity animation caused gray bleed-through
       during scrolling. Sections use reveal animations instead. */
  }

  /* ==============================================
     7. IMMERSIVE ROADMAP
     ============================================== */
  function initRoadmap() {
    var timeline = document.getElementById('roadmapTimeline');
    var svg = document.getElementById('rmSvg');
    var pathBg = document.getElementById('rmPathBg');
    var pathFill = document.getElementById('rmPathFill');
    var glow = document.getElementById('rmGlow');
    if (!timeline || !svg || !pathBg || !pathFill) return;

    var rows = $$('.rm__row', timeline);
    var ticking = false;
    var totalLen = 0;

    /* Build snake SVG path through the timeline — big smooth curves */
    function buildSnakePath() {
      var lineEl = document.getElementById('rmLine');
      if (!lineEl) return;
      var h = timeline.offsetHeight;
      var w = 120; /* wider SVG for bigger curves */
      lineEl.style.width = w + 'px';
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      svg.setAttribute('width', w);
      svg.setAttribute('height', h);

      /* Big smooth S-curves */
      var amp = 40; /* much larger horizontal swing */
      var cx = w / 2;
      var segH = 260; /* vertical distance per half-wave */
      var segments = Math.ceil(h / segH);
      var d = 'M ' + cx + ' 0';

      for (var i = 0; i < segments; i++) {
        var y0 = i * segH;
        var yMid = Math.min(y0 + segH * 0.5, h);
        var yEnd = Math.min(y0 + segH, h);
        var dir = (i % 2 === 0) ? 1 : -1;
        /* Smooth cubic bezier: control points push sideways, endpoint returns to center */
        d += ' C ' + (cx + amp * dir) + ' ' + (y0 + segH * 0.25) + ', ' + (cx + amp * dir) + ' ' + (y0 + segH * 0.75) + ', ' + cx + ' ' + yEnd;
      }

      pathBg.setAttribute('d', d);
      pathFill.setAttribute('d', d);

      totalLen = pathFill.getTotalLength();
      pathFill.style.strokeDasharray = totalLen;
      pathFill.style.strokeDashoffset = totalLen;
    }

    buildSnakePath();
    window.addEventListener('resize', buildSnakePath);

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var rect = timeline.getBoundingClientRect();
        var vh = window.innerHeight;
        var start = rect.top - vh * 0.65;
        var end = rect.bottom - vh * 0.25;
        var range = end - start;
        var progress = range > 0 ? clamp(-start / range, 0, 1) : 0;

        /* Animate snake path fill */
        if (totalLen) {
          pathFill.style.strokeDashoffset = totalLen * (1 - progress);
        }

        /* Glow follows progress along the path */
        if (glow && totalLen) {
          var pt = pathFill.getPointAtLength(progress * totalLen);
          glow.style.top = pt.y + 'px';
          glow.style.left = pt.x + 'px';
          glow.style.opacity = (progress > 0.01 && progress < 0.99) ? '1' : '0';
        }

        rows.forEach(function (row) {
          var dot = row.querySelector('.rm__dot');
          var card = row.querySelector('.rm__card');
          var branch = row.querySelector('.rm__branch');

          var isActive = false;
          if (dot) {
            var dotRect = dot.getBoundingClientRect();
            var dotCenter = dotRect.top + dotRect.height / 2;
            isActive = dotCenter < vh * 0.75 && dotCenter > -vh * 0.3;
          }

          if (dot) dot.classList.toggle('rm__dot--active', isActive);
          if (card) card.classList.toggle('rm__card--active', isActive);
          if (branch) branch.classList.toggle('rm__branch--active', isActive);
        });

        var endDot = document.getElementById('rmEndDot');
        if (endDot) {
          endDot.classList.toggle('rm__end-dot--active', progress >= 0.95);
        }

        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ==============================================
     8. HERO PARTICLES — Immersive WOW Effect
     ============================================== */
  function initParticles() {
    if (prefersReduced) return;

    var canvas = document.getElementById('heroParticles');
    var hero = document.getElementById('hero');
    if (!canvas || !hero) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var mouse = { x: -9999, y: -9999, prevX: -9999, prevY: -9999, speed: 0 };
    var count = 140;
    var connectDist = 180;
    var mouseRadius = 320;
    var running = true;
    var time = 0;

    /* Particle pools for burst effect */
    var burstParticles = [];

    function resize() {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    function create(x, y, isBurst) {
      var angle = Math.random() * Math.PI * 2;
      var speed = isBurst ? (Math.random() * 4 + 2) : (Math.random() * 0.6 + 0.1);
      var tier = Math.random();
      var size, opacity;
      if (tier < 0.15) {
        /* Large glowing orbs */
        size = Math.random() * 5 + 3;
        opacity = Math.random() * 0.3 + 0.15;
      } else if (tier < 0.45) {
        /* Medium particles */
        size = Math.random() * 3 + 1.5;
        opacity = Math.random() * 0.5 + 0.15;
      } else {
        /* Small dust */
        size = Math.random() * 1.5 + 0.5;
        opacity = Math.random() * 0.6 + 0.1;
      }
      return {
        x: x !== undefined ? x : Math.random() * canvas.width,
        y: y !== undefined ? y : Math.random() * canvas.height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: size,
        baseSize: size,
        opacity: opacity,
        baseOpacity: opacity,
        hue: Math.random() < 0.7 ? 0 : (Math.random() * 30 - 10), /* red-orange spectrum */
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        life: isBurst ? 1 : -1,
        isBurst: !!isBurst
      };
    }

    function seed() {
      resize();
      particles = [];
      for (var i = 0; i < count; i++) particles.push(create());
    }

    function spawnBurst(x, y, amount) {
      for (var i = 0; i < amount; i++) {
        burstParticles.push(create(x, y, true));
      }
    }

    function animate() {
      if (!running) return;
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* Calculate mouse speed */
      if (mouse.x > 0 && mouse.prevX > 0) {
        var mdx = mouse.x - mouse.prevX;
        var mdy = mouse.y - mouse.prevY;
        mouse.speed = Math.sqrt(mdx * mdx + mdy * mdy);
      }
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;

      /* Dynamic mouse radius based on speed */
      var dynRadius = mouseRadius + Math.min(mouse.speed * 3, 200);

      /* Update & draw main particles */
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var dx = mouse.x - p.x;
        var dy = mouse.y - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        /* Pulsing size */
        p.pulse += p.pulseSpeed;
        p.size = p.baseSize * (1 + Math.sin(p.pulse) * 0.3);

        if (dist < dynRadius && dist > 0) {
          /* Magnetic attraction + orbital swirl */
          var force = (dynRadius - dist) / dynRadius;
          var attract = force * 0.06;
          var swirl = force * 0.03;
          p.vx += dx / dist * attract - dy / dist * swirl;
          p.vy += dy / dist * attract + dx / dist * swirl;

          /* Particles grow near mouse */
          p.size *= (1 + force * 0.8);
          p.opacity = p.baseOpacity + force * 0.4;
        } else {
          p.opacity += (p.baseOpacity - p.opacity) * 0.05;
        }

        /* Gentle drift with noise-like motion */
        p.vx += Math.sin(time + p.pulse * 3) * 0.003;
        p.vy += Math.cos(time + p.pulse * 2) * 0.003;

        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;

        /* Wrap around */
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        /* Draw particle with glow */
        var r = p.hue >= 0 ? Math.min(224 + p.hue, 255) : 224;
        var g = Math.max(21 + p.hue, 0);
        var b = 21;

        if (p.size > 3) {
          /* Large particles get a glow aura */
          var glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
          glow.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',' + (p.opacity * 0.3) + ')');
          glow.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
          ctx.fillStyle = glow;
          ctx.fillRect(p.x - p.size * 4, p.y - p.size * 4, p.size * 8, p.size * 8);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + p.opacity + ')';
        ctx.fill();
      }

      /* Update & draw burst particles */
      for (var i = burstParticles.length - 1; i >= 0; i--) {
        var bp = burstParticles[i];
        bp.life -= 0.02;
        if (bp.life <= 0) {
          burstParticles.splice(i, 1);
          continue;
        }
        bp.vx *= 0.96;
        bp.vy *= 0.96;
        bp.x += bp.vx;
        bp.y += bp.vy;
        bp.size = bp.baseSize * bp.life;

        var alpha = bp.life * bp.baseOpacity;
        ctx.beginPath();
        ctx.arc(bp.x, bp.y, bp.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,80,80,' + alpha + ')';
        ctx.fill();
      }

      /* Draw connections — thicker, gradient-based */
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          var effectiveDist = connectDist;
          /* Extend connection range near mouse */
          var midX = (particles[i].x + particles[j].x) / 2;
          var midY = (particles[i].y + particles[j].y) / 2;
          var dmx = mouse.x - midX;
          var dmy = mouse.y - midY;
          var dMouse = Math.sqrt(dmx * dmx + dmy * dmy);
          if (dMouse < dynRadius) {
            effectiveDist = connectDist + (dynRadius - dMouse) / dynRadius * 100;
          }

          if (dist < effectiveDist) {
            var opacity = (1 - dist / effectiveDist) * 0.25;
            /* Boost opacity for connections near mouse */
            if (dMouse < dynRadius) {
              opacity *= (1 + (1 - dMouse / dynRadius) * 2);
            }
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(224,21,21,' + Math.min(opacity, 0.5) + ')';
            ctx.lineWidth = Math.max(0.5, (1 - dist / effectiveDist) * 2.5);
            ctx.stroke();
          }
        }
      }

      /* Mouse glow — much larger and more dramatic */
      if (mouse.x > 0 && mouse.y > 0) {
        var glowSize = 250 + mouse.speed * 2;

        /* Outer ambient glow */
        var grad1 = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, glowSize);
        grad1.addColorStop(0, 'rgba(224,21,21,.12)');
        grad1.addColorStop(0.4, 'rgba(224,21,21,.05)');
        grad1.addColorStop(1, 'rgba(224,21,21,0)');
        ctx.fillStyle = grad1;
        ctx.fillRect(mouse.x - glowSize, mouse.y - glowSize, glowSize * 2, glowSize * 2);

        /* Inner bright core */
        var grad2 = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 40);
        grad2.addColorStop(0, 'rgba(255,100,100,.15)');
        grad2.addColorStop(1, 'rgba(224,21,21,0)');
        ctx.fillStyle = grad2;
        ctx.fillRect(mouse.x - 40, mouse.y - 40, 80, 80);
      }

      requestAnimationFrame(animate);
    }

    var lastBurstTime = 0;
    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;

      /* Spawn micro-bursts while moving fast */
      var now = performance.now();
      if (mouse.speed > 8 && now - lastBurstTime > 80) {
        spawnBurst(mouse.x, mouse.y, Math.min(Math.floor(mouse.speed / 4), 6));
        lastBurstTime = now;
      }
    });

    hero.addEventListener('mouseleave', function () {
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.speed = 0;
    });

    /* Click burst */
    hero.addEventListener('click', function (e) {
      var rect = hero.getBoundingClientRect();
      spawnBurst(e.clientX - rect.left, e.clientY - rect.top, 20);
    });

    window.addEventListener('resize', resize);

    seed();
    animate();
  }

  /* ==============================================
     9. MAGNETIC HOVER ON BUTTONS
     ============================================== */
  function initMagneticButtons() {
    var btns = $$('.magnetic-btn');
    if (!btns.length || prefersReduced) return;

    btns.forEach(function(btn) {
      btn.addEventListener('mousemove', function(e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
      });
      btn.addEventListener('mouseleave', function() {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ==============================================
     10. TYPING ANIMATION IN HERO
     ============================================== */
  function initTyping() {
    var el = document.getElementById('heroTyping');
    if (!el || prefersReduced) return;

    var words = ['FIAE Ausbildung.', 'IT-Karriere.', 'Deine Zukunft.', 'Duale Bildung.'];
    var wordIdx = 0;
    var charIdx = 0;
    var isDeleting = false;
    var delay = 100;

    /* Add cursor */
    var cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    el.parentNode.insertBefore(cursor, el.nextSibling);

    function tick() {
      var current = words[wordIdx];
      if (isDeleting) {
        charIdx--;
        el.textContent = current.substring(0, charIdx);
        delay = 50;
      } else {
        charIdx++;
        el.textContent = current.substring(0, charIdx);
        delay = 80 + Math.random() * 60;
      }

      if (!isDeleting && charIdx === current.length) {
        delay = 2500;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        delay = 400;
      }

      setTimeout(tick, delay);
    }

    /* Start after reveal animation completes */
    setTimeout(tick, 2000);
  }

  /* ==============================================
     INIT
     ============================================== */
  function init() {
    initReveal();
    initCounters();
    initNavbar();
    initSmoothScroll();
    initFAQ();
    initRoadmap();
    initParticles();
    initScrollEffects();
    initMagneticButtons();
    initTyping();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
