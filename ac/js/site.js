/* Site behaviour: sticky nav, mobile drawer, typewriter, anchors, back-to-top. */
(function () {
  "use strict";

  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  var backdrop = document.getElementById('navBackdrop');
  var goTop = document.getElementById('goTop');
  var yr = document.getElementById('yr');

  if (yr) { yr.textContent = new Date().getFullYear(); }

  /* --- sticky nav --- */
  function onScroll() {
    if (nav) { nav.classList.toggle('is-stuck', window.pageYOffset > 60); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- mobile drawer --- */
  function closeMenu() {
    if (!links) { return; }
    links.classList.remove('is-open');
    if (backdrop) { backdrop.classList.remove('is-on'); }
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<i class="las la-bars" aria-hidden="true"></i>';
    }
    document.body.style.overflow = '';
  }
  function openMenu() {
    links.classList.add('is-open');
    if (backdrop) { backdrop.classList.add('is-on'); }
    toggle.setAttribute('aria-expanded', 'true');
    toggle.innerHTML = '<i class="las la-times" aria-hidden="true"></i>';
    document.body.style.overflow = 'hidden';
  }
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      if (links.classList.contains('is-open')) { closeMenu(); } else { openMenu(); }
    });
  }
  if (backdrop) { backdrop.addEventListener('click', closeMenu); }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeMenu(); }
  });

  /* --- smooth anchor scrolling with fixed-header offset --- */
  function headerOffset() {
    return (nav && window.innerWidth > 991) ? nav.offsetHeight + 8 : 12;
  }
  [].slice.call(document.querySelectorAll('a[href^="#"]')).forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#') { return; }
      var target = document.querySelector(id);
      if (!target) { return; }
      e.preventDefault();
      closeMenu();
      var y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset();
      var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: y < 0 ? 0 : y, behavior: still ? 'auto' : 'smooth' });
      if (history.replaceState) { history.replaceState(null, '', id); }
    });
  });

  /* --- back to top --- */
  if (goTop) {
    goTop.addEventListener('click', function () {
      var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' });
    });
  }

  /* --- typewriter --- */
  var tw = document.getElementById('tw');
  if (tw) {
    var phrases = [
      'patent litigation',
      'aviation regulation',
      'intellectual property',
      'strategic transactions',
      'building what has not existed'
    ];
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still) {
      tw.textContent = phrases[0];
    } else {
      var pi = 0, ci = 0, erasing = false;
      (function tick() {
        var word = phrases[pi];
        tw.textContent = word.slice(0, ci);
        var wait = erasing ? 34 : 62;
        if (!erasing && ci === word.length) { erasing = true; wait = 1700; }
        else if (erasing && ci === 0) { erasing = false; pi = (pi + 1) % phrases.length; wait = 320; }
        else { ci += erasing ? -1 : 1; }
        setTimeout(tick, wait);
      }());
    }
  }
}());
