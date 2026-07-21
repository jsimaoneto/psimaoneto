/* José Simão Neto | interações do site */

(function () {
  'use strict';

  /* ---- ano do rodapé ---- */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---- header com sombra ao rolar ---- */
  var header = document.querySelector('.site-header');
  var onScroll = function () {
    header.classList.toggle('is-stuck', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

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

  /* ---- revelação progressiva das seções ---- */
  var alvos = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    alvos.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada, i) {
      if (!entrada.isIntersecting) return;
      var el = entrada.target;
      setTimeout(function () { el.classList.add('is-visible'); }, i * 70);
      observer.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  alvos.forEach(function (el) { observer.observe(el); });
})();
