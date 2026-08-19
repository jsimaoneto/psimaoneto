/* José Simão Neto | redesign v2 · motor de interações e animações */

(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- ano do rodapé ---- */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---- header com sombra ao rolar ---- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-stuck', window.scrollY > 12); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- menu mobile ---- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var aberto = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(aberto));
      toggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menu');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* =====================================================================
     MOTOR DE REVELAÇÃO AO ROLAR (estilo AOS, sem biblioteca externa)
     - [data-anim="fade-up|fade-down|fade-left|fade-right|zoom-in|zoom-out"]
     - [data-stagger] em um contêiner escalona os filhos [data-anim]
     - .reveal continua funcionando (compatibilidade com o site atual)
     ===================================================================== */

  var animTargets = [].slice.call(document.querySelectorAll('[data-anim], .reveal'));

  if (reduce || !('IntersectionObserver' in window)) {
    animTargets.forEach(function (el) { el.classList.add('is-in', 'is-visible'); });
  } else {
    // atraso escalonado nos filhos de contêineres [data-stagger]
    [].slice.call(document.querySelectorAll('[data-stagger]')).forEach(function (group) {
      var step = parseFloat(group.getAttribute('data-stagger')) || 90;
      [].slice.call(group.querySelectorAll('[data-anim]')).forEach(function (child, i) {
        child.style.setProperty('--anim-delay', (i * step) + 'ms');
      });
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in', 'is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

    animTargets.forEach(function (el) { io.observe(el); });
  }

  /* =====================================================================
     PARALLAX SUAVE  ·  [data-parallax="0.15"] (fator de deslocamento)
     ===================================================================== */

  var parallaxEls = [].slice.call(document.querySelectorAll('[data-parallax]'));
  if (!reduce && parallaxEls.length) {
    var ticking = false;
    var runParallax = function () {
      var vh = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var factor = parseFloat(el.getAttribute('data-parallax')) || 0.12;
        var offset = (r.top + r.height / 2 - vh / 2) * factor;
        el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      });
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(runParallax); }
    }, { passive: true });
    window.addEventListener('resize', runParallax);
    runParallax();
  }

  /* =====================================================================
     TROCA DE IMAGENS (showcase)  ·  como no site de referência
     [data-showcase] com filhos .showcase__img; alterna com cross-fade.
     Sincroniza legenda [data-cap] e pontos [data-dots].
     Pausa quando fora da tela e respeita prefers-reduced-motion.
     ===================================================================== */

  [].slice.call(document.querySelectorAll('[data-showcase]')).forEach(function (box) {
    var imgs = [].slice.call(box.querySelectorAll('.showcase__img'));
    if (imgs.length < 2) return;
    var caps = [].slice.call(box.querySelectorAll('[data-cap]'));
    var dotsWrap = box.querySelector('[data-dots]');
    var interval = parseInt(box.getAttribute('data-showcase'), 10) || 3600;
    var i = 0, timer = null, visible = false;

    var dots = [];
    if (dotsWrap) {
      imgs.forEach(function (_, k) {
        var d = document.createElement('button');
        d.className = 'showcase__dot' + (k === 0 ? ' is-on' : '');
        d.setAttribute('aria-label', 'Imagem ' + (k + 1));
        d.addEventListener('click', function () { go(k); reset(); });
        dotsWrap.appendChild(d);
        dots.push(d);
      });
    }

    function go(n) {
      i = (n + imgs.length) % imgs.length;
      imgs.forEach(function (im, k) { im.classList.toggle('is-active', k === i); });
      caps.forEach(function (c, k) { c.classList.toggle('is-active', k === i); });
      dots.forEach(function (d, k) { d.classList.toggle('is-on', k === i); });
    }
    function tick() { go(i + 1); }
    function start() { if (!timer && !reduce) timer = setInterval(tick, interval); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function reset() { stop(); start(); }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { visible = e.isIntersecting; visible ? start() : stop(); });
      }, { threshold: 0.3 }).observe(box);
    } else { start(); }
  });

  /* =====================================================================
     CONTADOR ANIMADO  ·  [data-count="200"] [data-suffix="+"] [data-prefix]
     ===================================================================== */

  var counters = [].slice.call(document.querySelectorAll('[data-count]'));
  if (counters.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        el.textContent = (el.getAttribute('data-prefix') || '') + el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
      });
    } else {
      var countIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          countIO.unobserve(el);
          var target = parseFloat(el.getAttribute('data-count'));
          var prefix = el.getAttribute('data-prefix') || '';
          var suffix = el.getAttribute('data-suffix') || '';
          var dur = 1400, start = null;
          var step = function (ts) {
            if (start === null) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = prefix + Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { countIO.observe(el); });
    }
  }
})();
