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
    el.style.minHeight = '';
  }

  function initCounters() {
    var counters = $$('[data-target]');
    if (!counters.length) return;

    /* Pre-lock dimensions via invisible clone to prevent layout shift during count-up */
    counters.forEach(function(el) {
      var suffix = el.dataset.suffix || '';
      var prefix = el.dataset.prefix || '';
      var separator = el.dataset.separator || '';
      var target = parseInt(el.dataset.target, 10);
      var finalText = prefix + formatNumber(target, separator) + suffix;
      var clone = el.cloneNode(false);
      clone.style.position = 'absolute';
      clone.style.visibility = 'hidden';
      clone.style.whiteSpace = 'nowrap';
      clone.textContent = finalText;
      el.parentNode.insertBefore(clone, el);
      el.style.minHeight = clone.scrollHeight + 'px';
      el.style.minWidth = clone.scrollWidth + 'px';
      el.style.display = 'inline-block';
      clone.remove();
    });

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

      /* Sync dot thresholds to actual path positions */
      if (totalLen > 0) {
        var timelineRect = timeline.getBoundingClientRect();
        rows.forEach(function (row) {
          var dot = row.querySelector('.rm__dot');
          if (!dot) return;
          var dotRect = dot.getBoundingClientRect();
          var dotY = dotRect.top + dotRect.height / 2 - timelineRect.top;

          /* Binary search along path for the length where path Y == dot Y */
          var lo = 0, hi = totalLen;
          for (var iter = 0; iter < 50; iter++) {
            var mid = (lo + hi) / 2;
            var pt = pathFill.getPointAtLength(mid);
            if (pt.y < dotY) lo = mid;
            else hi = mid;
          }
          row.dataset.rmProgress = ((lo + hi) / 2 / totalLen).toFixed(4);
        });
      }
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
          glow.style.opacity = (progress > 0.01 && progress < 0.92) ? '1' : '0';
        }

        rows.forEach(function (row) {
          var dot = row.querySelector('.rm__dot');
          var card = row.querySelector('.rm__card');
          var branch = row.querySelector('.rm__branch');

          /* Sync card activation with path progress */
          var rowProgress = parseFloat(row.dataset.rmProgress) || 0;
          var isActive = progress >= rowProgress;

          if (dot) dot.classList.toggle('rm__dot--active', isActive);
          if (card) card.classList.toggle('rm__card--active', isActive);
          if (branch) branch.classList.toggle('rm__branch--active', isActive);
        });

        var endDot = document.getElementById('rmEndDot');
        if (endDot) {
          endDot.classList.toggle('rm__end-marker--active', progress >= 0.92);
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

    var words = ['FIAE Ausbildung.', 'IT-Karriere.'];
    var wordIdx = 0;
    var charIdx = 0;
    var isDeleting = false;
    var delay = 100;

    /* Place cursor inside the typing span so it stays right next to text */
    var textNode = document.createTextNode(el.textContent);
    el.textContent = '';
    el.appendChild(textNode);
    var cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    el.appendChild(cursor);

    function tick() {
      var current = words[wordIdx];
      if (isDeleting) {
        charIdx--;
        textNode.textContent = current.substring(0, charIdx);
        delay = 50;
      } else {
        charIdx++;
        textNode.textContent = current.substring(0, charIdx);
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
     11. 3D TILT ON CARDS
     ============================================== */
  function initTiltCards() {
    var cards = $$('.tilt-card');
    if (!cards.length || prefersReduced) return;

    cards.forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        /* Remove transform transition during tilt for instant response */
        card.style.transition = 'border-color .7s cubic-bezier(.16,1,.3,1), box-shadow .7s cubic-bezier(.16,1,.3,1)';
      });
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        var tiltX = (0.5 - y) * 14;
        var tiltY = (x - 0.5) * 14;
        card.style.transform = 'perspective(800px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) scale3d(1.02,1.02,1.02)';
      });
      card.addEventListener('mouseleave', function () {
        /* Restore transition for smooth spring-back */
        card.style.transition = 'border-color .7s cubic-bezier(.16,1,.3,1), transform .4s cubic-bezier(.16,1,.3,1), box-shadow .7s cubic-bezier(.16,1,.3,1)';
        card.style.transform = '';
      });
    });
  }

  /* ==============================================
     12. BENTO CARD MOUSE GLOW
     ============================================== */
  function initBentoGlow() {
    var cards = $$('.bento-featured');
    if (!cards.length || prefersReduced) return;

    cards.forEach(function(card) {
      var glow = document.createElement('div');
      glow.style.cssText = 'position:absolute;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(255,26,26,.07),transparent 70%);pointer-events:none;opacity:0;transition:opacity .3s ease;transform:translate(-50%,-50%);z-index:0;';
      card.appendChild(glow);

      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        glow.style.left = (e.clientX - rect.left) + 'px';
        glow.style.top = (e.clientY - rect.top) + 'px';
        glow.style.opacity = '1';
      });
      card.addEventListener('mouseleave', function() {
        glow.style.opacity = '0';
      });
    });
  }

  /* ==============================================
     13. SOLAR SYSTEM — Lernuniversum
     ============================================== */
  function initSolarSystem() {
    var canvas = document.getElementById('solarCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H, cx, cy, sc;
    var raf = null;
    var stars = [];
    var PLANETS = [
      { abbr: 'FIAE',   orbitR0: 140, r0: 28, speed: 0.00035, angle: Math.PI * 0.25, active: true,  _sx: 0, _sy: 0 },
      { abbr: 'FISI',   orbitR0: 215, r0: 28, speed: 0.00022, angle: Math.PI * 1.6,  active: false, _sx: 0, _sy: 0 },
      { abbr: 'IT-Kfm', orbitR0: 290, r0: 28, speed: 0.00016, angle: Math.PI * 0.9,  active: false, _sx: 0, _sy: 0 },
      { abbr: 'IT-Sys', orbitR0: 360, r0: 28, speed: 0.00011, angle: Math.PI * 2.4,  active: false, _sx: 0, _sy: 0 }
    ];

    function genStars() {
      stars = [];
      for (var i = 0; i < 240; i++)
        stars.push({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.3+0.2, ph: Math.random()*6.28, sp: Math.random()*0.6+0.2 });
    }

    function resize() {
      W = canvas.width  = canvas.parentElement.offsetWidth;
      H = canvas.height = canvas.parentElement.offsetHeight;
      cx = W/2; cy = H/2;
      sc = Math.min(1, Math.min(W, H*1.6) / 800);
      genStars();
    }

    function frame(ts) {
      ctx.clearRect(0, 0, W, H);

      /* Stars */
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var a = 0.15 + 0.55*(0.5+0.5*Math.sin(ts*0.001*s.sp+s.ph));
        ctx.globalAlpha = a;
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;

      /* Sun glow — outer */
      var sg = ctx.createRadialGradient(cx,cy,0,cx,cy,90*sc);
      sg.addColorStop(0,'rgba(255,140,40,.70)'); sg.addColorStop(0.35,'rgba(255,50,10,.28)'); sg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=sg; ctx.beginPath(); ctx.arc(cx,cy,90*sc,0,6.2832); ctx.fill();
      /* Sun corona — mid ring */
      var sc1 = ctx.createRadialGradient(cx,cy,0,cx,cy,50*sc);
      sc1.addColorStop(0,'rgba(255,180,60,.55)'); sc1.addColorStop(0.6,'rgba(255,80,10,.18)'); sc1.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=sc1; ctx.beginPath(); ctx.arc(cx,cy,50*sc,0,6.2832); ctx.fill();
      /* Sun core — 3D sphere */
      var sc2 = ctx.createRadialGradient(cx-10*sc,cy-11*sc,0,cx,cy,32*sc);
      sc2.addColorStop(0,'#fffcf0'); sc2.addColorStop(0.18,'#ffdd88'); sc2.addColorStop(0.55,'#ff9922'); sc2.addColorStop(1,'#aa2200');
      ctx.fillStyle=sc2; ctx.beginPath(); ctx.arc(cx,cy,32*sc,0,6.2832); ctx.fill();
      ctx.fillStyle='rgba(255,255,255,.9)';
      ctx.font='bold '+Math.max(8,Math.round(11*sc))+'px Inter,sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('LFA',cx,cy);

      /* Planets */
      for (var pi = 0; pi < PLANETS.length; pi++) {
        var p = PLANETS[pi];
        p.angle += p.speed*16;
        var r  = p.orbitR0*sc;
        var pr = p.r0*sc;
        var px = cx+Math.cos(p.angle)*r;
        var py = cy+Math.sin(p.angle)*r;
        p._sx=px; p._sy=py;

        /* Orbit ring */
        ctx.strokeStyle = p.active ? 'rgba(255,80,80,.2)' : 'rgba(255,255,255,.07)';
        ctx.lineWidth=1; ctx.setLineDash([3,7]);
        ctx.beginPath(); ctx.arc(cx,cy,r,0,6.2832); ctx.stroke();
        ctx.setLineDash([]);

        if (p.active) {
          var pulse = 0.5+0.5*Math.sin(ts*0.0028);
          var gh = ctx.createRadialGradient(px,py,0,px,py,pr*3.2);
          gh.addColorStop(0,'rgba(255,60,60,'+(0.4+pulse*0.3)+')');
          gh.addColorStop(1,'rgba(255,0,0,0)');
          ctx.fillStyle=gh; ctx.beginPath(); ctx.arc(px,py,pr*3.2,0,6.2832); ctx.fill();
          ctx.strokeStyle='rgba(255,80,80,'+(0.25+pulse*0.55)+')';
          ctx.lineWidth=1.5;
          ctx.beginPath(); ctx.arc(px,py,pr+(3+pulse*5)*sc,0,6.2832); ctx.stroke();
        }

        /* Planet body — 3D specular sphere */
        var specX = px - pr*0.32, specY = py - pr*0.36;
        var pg = ctx.createRadialGradient(specX, specY, 0, px, py, pr);
        if (p.active) {
          pg.addColorStop(0,    '#ffcccc'); /* specular highlight */
          pg.addColorStop(0.18, '#ff6666'); /* bright face */
          pg.addColorStop(0.60, '#cc1111'); /* mid shadow */
          pg.addColorStop(1,    '#4a0000'); /* rim dark */
        } else {
          pg.addColorStop(0,    '#888892'); /* specular highlight */
          pg.addColorStop(0.22, '#58586a'); /* bright face */
          pg.addColorStop(0.62, '#2e2e38'); /* mid shadow */
          pg.addColorStop(1,    '#0d0d12'); /* rim dark */
        }
        ctx.fillStyle=pg; ctx.beginPath(); ctx.arc(px,py,pr,0,6.2832); ctx.fill();
        /* Subtle rim edge */
        ctx.strokeStyle = p.active ? 'rgba(255,130,130,.35)' : 'rgba(100,100,120,.18)';
        ctx.lineWidth=1; ctx.beginPath(); ctx.arc(px,py,pr,0,6.2832); ctx.stroke();

        /* Label */
        ctx.fillStyle = p.active ? '#fff' : '#aaaabc';
        ctx.font = (p.active?'bold ':'')+Math.max(7,Math.round(9*sc))+'px Inter,sans-serif';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(p.abbr, px, py);

        /* Hint */
        ctx.textBaseline='alphabetic';
        if (p.active) {
          ctx.fillStyle='rgba(255,160,160,.85)';
          ctx.font=Math.max(7,Math.round(8*sc))+'px Inter,sans-serif';
          ctx.fillText('↗ Erkunden',px,py+pr+14*sc);
        } else {
          ctx.fillStyle='rgba(120,120,140,.7)';
          ctx.font=Math.max(6,Math.round(7*sc))+'px Inter,sans-serif';
          ctx.fillText('bald',px,py+pr+11*sc);
        }
      }

      raf = requestAnimationFrame(frame);
    }

    canvas.addEventListener('click', function(e) {
      var rect = canvas.getBoundingClientRect();
      var mx = (e.clientX-rect.left)*(W/rect.width);
      var my = (e.clientY-rect.top)*(H/rect.height);
      for (var pi = 0; pi < PLANETS.length; pi++) {
        var p = PLANETS[pi];
        if (!p.active) continue;
        var dx=mx-p._sx, dy=my-p._sy, hit=(p.r0*sc+18);
        if (dx*dx+dy*dy < hit*hit) {
          var sx = p._sx*(rect.width/W)+rect.left;
          var sy = p._sy*(rect.height/H)+rect.top;
          openGalaxy(sx,sy); break;
        }
      }
    });

    canvas.addEventListener('mousemove', function(e) {
      var rect = canvas.getBoundingClientRect();
      var mx = (e.clientX-rect.left)*(W/rect.width);
      var my = (e.clientY-rect.top)*(H/rect.height);
      var hover = false;
      for (var pi = 0; pi < PLANETS.length; pi++) {
        var p = PLANETS[pi];
        if (!p.active) continue;
        var dx=mx-p._sx, dy=my-p._sy, hit=(p.r0*sc+20);
        if (dx*dx+dy*dy < hit*hit) { hover=true; break; }
      }
      canvas.style.cursor = hover?'pointer':'default';
    });

    resize();
    window.addEventListener('resize', function() { cancelAnimationFrame(raf); resize(); raf=requestAnimationFrame(frame); });
    raf = requestAnimationFrame(frame);
  }

  /* ── Galaxy helpers (global scope via window) ── */
  var _galaxyInited = false;

  window.loadD3 = function(cb) {
    if (window.d3) { cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js';
    s.onload = cb; document.head.appendChild(s);
  };

  window.openGalaxy = function(originX, originY) {
    var zl = document.getElementById('zoomLayer');
    var circ = document.getElementById('zoomCircle');
    var ov = document.getElementById('galaxyOverlay');
    var diag = Math.sqrt(window.innerWidth*window.innerWidth+window.innerHeight*window.innerHeight)*2.4;
    circ.style.cssText = 'position:absolute;border-radius:50%;background:#040810;width:'+diag+'px;height:'+diag+'px;left:'+originX+'px;top:'+originY+'px;transform:translate(-50%,-50%) scale(0);transition:none;';
    zl.style.display = 'block';
    requestAnimationFrame(function() { requestAnimationFrame(function() {
      circ.style.transition = 'transform .72s cubic-bezier(.4,0,.2,1)';
      circ.style.transform = 'translate(-50%,-50%) scale(1)';
    }); });
    setTimeout(function() {
      ov.style.opacity='0'; ov.classList.add('go--open');
      zl.style.display='none';
      window.loadD3(function() {
        requestAnimationFrame(function() {
          ov.style.transition='opacity .4s ease'; ov.style.opacity='1';
          if (!_galaxyInited) { window.initGalaxy(); _galaxyInited=true; }
        });
      });
    }, 700);
  };

  window.closeGalaxy = function() {
    var ov = document.getElementById('galaxyOverlay');
    ov.style.opacity='0';
    setTimeout(function() { ov.classList.remove('go--open'); ov.style.opacity=''; }, 420);
  };

  window.galaxySearch = function(val) {
    if (!window._galaxyNode) return;
    var v = val.toLowerCase().trim();
    window._galaxyNode.style('opacity', function(d) {
      if (!v) return 1;
      return (d.label.toLowerCase().includes(v)||(d.fullLabel&&d.fullLabel.toLowerCase().includes(v)))?1:0.06;
    });
  };

  window.initGalaxy = function() {
    var container = document.getElementById('galaxySvgContainer');
    var tooltip   = document.getElementById('galaxyTooltip');
    if (!container || !window.GALAXY_DATA) return;
    container.innerHTML = '';
    var GW = window.innerWidth, GH = window.innerHeight;
    var data  = JSON.parse(JSON.stringify(window.GALAXY_DATA));
    var nodes = data.nodes, links = data.links;

    var svg = d3.select(container).append('svg').attr('width',GW).attr('height',GH);

    /* Stars background */
    var sg = svg.append('g');
    for (var i=0;i<300;i++)
      sg.append('circle').attr('cx',Math.random()*GW).attr('cy',Math.random()*GH)
        .attr('r',Math.random()*1.2+0.2).attr('fill','#fff').attr('opacity',Math.random()*0.45+0.08);

    /* Defs */
    var defs = svg.append('defs');
    /* LF sphere gradient — 3D look with specular highlight */
    nodes.filter(function(d){return d.group==='LF';}).forEach(function(d) {
      var g = defs.append('radialGradient').attr('id','grd-'+d.id)
        .attr('cx','38%').attr('cy','30%').attr('r','68%')
        .attr('fx','38%').attr('fy','26%');
      g.append('stop').attr('offset','0%').attr('stop-color','#ffbbbb');   /* specular */
      g.append('stop').attr('offset','18%').attr('stop-color','#ff5555');  /* bright */
      g.append('stop').attr('offset','65%').attr('stop-color','#cc1111');  /* mid */
      g.append('stop').attr('offset','100%').attr('stop-color','#5a0000'); /* rim */
    });
    /* Comp sphere gradient */
    var cg = defs.append('radialGradient').attr('id','comp-grd')
      .attr('cx','38%').attr('cy','30%').attr('r','65%');
    cg.append('stop').attr('offset','0%').attr('stop-color','#f0f0f8');
    cg.append('stop').attr('offset','100%').attr('stop-color','#7a7a90');
    /* UC sphere gradient */
    var ug = defs.append('radialGradient').attr('id','uc-grd')
      .attr('cx','38%').attr('cy','30%').attr('r','65%');
    ug.append('stop').attr('offset','0%').attr('stop-color','#93e8ff');
    ug.append('stop').attr('offset','100%').attr('stop-color','#0369a1');
    /* LF glow filter */
    var filt = defs.append('filter').attr('id','lfglow').attr('x','-60%').attr('y','-60%').attr('width','220%').attr('height','220%');
    filt.append('feGaussianBlur').attr('stdDeviation','6').attr('result','blur');
    var feMerge = filt.append('feMerge');
    feMerge.append('feMergeNode').attr('in','blur');
    feMerge.append('feMergeNode').attr('in','SourceGraphic');

    /* Zoom */
    var zb = d3.zoom().scaleExtent([0.08,10]).on('zoom',function(ev){grp.attr('transform',ev.transform);});
    svg.call(zb);
    var grp = svg.append('g');

    /* Simulation — cluster=LF->UC (official), parent=Comp->UC (organizational) */
    var sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(function(d){return d.id;})
        .distance(function(d){return d.type==='cluster'?95:38;})
        .strength(function(d){return d.type==='cluster'?0.5:0.65;}))
      .force('charge', d3.forceManyBody().strength(function(d){
        return d.group==='LF'?-560:d.group==='Comp'?-80:-18;
      }))
      .force('center', d3.forceCenter(GW/2,GH/2))
      .force('collide', d3.forceCollide().radius(function(d){return d.radius+5;}).iterations(2))
      .alphaDecay(0.012);

    /* Links — cluster (LF->UC) in red, parent (Comp->UC) in blue-white */
    var link = grp.append('g').selectAll('line').data(links).join('line')
      .attr('stroke',function(d){return d.type==='cluster'?'rgba(255,90,70,.32)':'rgba(180,210,255,.28)';})
      .attr('stroke-width',function(d){return d.type==='cluster'?1.6:1.4;})
      .attr('stroke-opacity',function(d){return d.type==='cluster'?.32:.28;});

    /* Nodes — glow layer for LF */
    var nodeGlow = grp.append('g').selectAll('circle')
      .data(nodes.filter(function(d){return d.group==='LF';})).join('circle')
      .attr('r',function(d){return d.radius+8;})
      .attr('fill','rgba(255,40,40,.12)')
      .attr('filter','url(#lfglow)')
      .attr('pointer-events','none');

    /* Nodes */
    var node = grp.append('g').selectAll('circle').data(nodes).join('circle')
      .attr('r',function(d){return d.radius;})
      .attr('fill',function(d){
        if(d.group==='LF')   return 'url(#grd-'+d.id+')';
        if(d.group==='Comp') return 'url(#comp-grd)';
        return 'url(#uc-grd)';
      })
      .attr('stroke',function(d){
        if(d.group==='LF')   return 'rgba(255,100,80,.45)';
        if(d.group==='Comp') return 'rgba(255,255,255,.18)';
        return 'rgba(56,189,248,.35)';
      })
      .attr('stroke-width',function(d){return d.group==='LF'?2:1;})
      .style('cursor','pointer');

    /* Labels */
    var label = grp.append('g').selectAll('text')
      .data(nodes.filter(function(d){return d.group!=='UC';})).join('text')
      .attr('text-anchor','middle').attr('dominant-baseline','middle')
      .attr('font-size',function(d){return d.group==='LF'?'12px':'7.5px';})
      .attr('font-weight',function(d){return d.group==='LF'?'700':'500';})
      .attr('fill',function(d){return d.group==='LF'?'#fff':'#ccc';})
      .attr('pointer-events','none')
      .text(function(d){return d.label;});

    /* Drag */
    var dragBeh = d3.drag()
      .on('start',function(ev,d){if(!ev.active)sim.alphaTarget(0.3).restart();d.fx=d.x;d.fy=d.y;})
      .on('drag', function(ev,d){d.fx=ev.x;d.fy=ev.y;})
      .on('end',  function(ev,d){if(!ev.active)sim.alphaTarget(0);d.fx=null;d.fy=null;});
    node.call(dragBeh);

    function getConn(d) {
      var s=new Set([d.id]);
      links.forEach(function(l){
        var si=typeof l.source==='object'?l.source.id:l.source;
        var ti=typeof l.target==='object'?l.target.id:l.target;
        if(si===d.id){
          s.add(ti);
          if(d.group==='LF') links.forEach(function(l2){
            var s2=typeof l2.source==='object'?l2.source.id:l2.source;
            var t2=typeof l2.target==='object'?l2.target.id:l2.target;
            if(s2===ti)s.add(t2); if(t2===ti)s.add(s2);
          });
        }
        if(ti===d.id) s.add(si);
      });
      return s;
    }

    function doHighlight(d) {
      var conn=getConn(d);
      node.style('opacity',function(n){return conn.has(n.id)?1:0.05;});
      nodeGlow.style('opacity',function(n){return conn.has(n.id)?1:0.05;});
      link.attr('stroke-opacity',function(l){
        var si=typeof l.source==='object'?l.source.id:l.source;
        var ti=typeof l.target==='object'?l.target.id:l.target;
        return(conn.has(si)&&conn.has(ti))?0.85:0.02;
      });
      label.style('opacity',function(n){return conn.has(n.id)?1:0.08;});
    }

    function resetHighlight() {
      node.style('opacity',1); nodeGlow.style('opacity',1); label.style('opacity',1);
      link.attr('stroke-opacity',function(l){return l.type==='cluster'?.28:.16;});
    }

    /* Hover + tooltip */
    node.on('mouseover',function(ev,d){
      doHighlight(d);
      var lbl=d.fullLabel||d.label;
      tooltip.innerHTML='<strong style="color:'+(d.group==='LF'?'#ff7777':d.group==='Comp'?'#e2e8f0':'#38bdf8')+'">'+d.group+'</strong><br>'+lbl;
      tooltip.style.display='block';
      tooltip.style.left=(ev.clientX+16)+'px'; tooltip.style.top=(ev.clientY-10)+'px';
    })
    .on('mousemove',function(ev){
      tooltip.style.left=(ev.clientX+16)+'px'; tooltip.style.top=(ev.clientY-10)+'px';
    })
    .on('mouseout',function(){resetHighlight();tooltip.style.display='none';});

    /* Click LF → zoom into cluster */
    node.on('click',function(ev,d){
      if(d.group!=='LF') return; ev.stopPropagation();
      doHighlight(d);
      var t=d3.zoomIdentity.translate(GW/2,GH/2).scale(3).translate(-d.x,-d.y);
      svg.transition().duration(650).call(zb.transform,t);
    });

    /* Click background → reset */
    svg.on('click',function(){
      resetHighlight(); tooltip.style.display='none';
      svg.transition().duration(500).call(zb.transform,d3.zoomIdentity);
    });

    window._galaxyNode = node;

    /* Tick */
    sim.on('tick',function(){
      link.attr('x1',function(d){return d.source.x;}).attr('y1',function(d){return d.source.y;})
          .attr('x2',function(d){return d.target.x;}).attr('y2',function(d){return d.target.y;});
      node.attr('cx',function(d){return d.x;}).attr('cy',function(d){return d.y;});
      nodeGlow.attr('cx',function(d){return d.x;}).attr('cy',function(d){return d.y;});
      label.attr('x',function(d){return d.x;}).attr('y',function(d){return d.y;});
    });

    /* Gentle drift */
    setInterval(function(){sim.alpha(0.006).restart();},4000);
  };

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
    initSolarSystem();
    initParticles();
    initScrollEffects();
    initMagneticButtons();
    initTyping();
    initTiltCards();
    initBentoGlow();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
