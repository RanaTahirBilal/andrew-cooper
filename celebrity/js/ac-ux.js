/* UX and accessibility behaviour the MegaOne demo does not provide:
   drawer state + Escape + focus return, and a carousel that respects
   reduced-motion. Everything here degrades safely if it fails. */
(function () {
  "use strict";

  /* ---------- off-canvas menu ---------- */
  var toggle = document.getElementById('sidemenu_toggle');
  var drawer = document.getElementById('sideMenu');
  var closeBtn = document.getElementById('btn_sideNavClose');

  function isOpen() { return drawer && drawer.classList.contains('side-menu-active'); }

  function syncState() {
    if (!toggle) { return; }
    var open = isOpen();
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function closeDrawer(returnFocus) {
    if (!drawer) { return; }
    drawer.classList.remove('side-menu-active');
    var x = document.getElementById('close_side_menu');
    if (x) { x.style.display = 'none'; }
    syncState();
    if (returnFocus && toggle) { toggle.focus(); }
  }

  if (toggle && drawer) {
    // the demo's own handler toggles the class; watch for it rather than fight it
    new MutationObserver(syncState).observe(drawer, { attributes: true, attributeFilter: ['class'] });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !isOpen()) { return; }
      closeDrawer(true);
    });

    // focus trap while the drawer is open
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !isOpen()) { return; }
      var items = [].slice.call(drawer.querySelectorAll('a[href],button'))
        .filter(function (el) { return el.offsetParent !== null; });
      if (!items.length) { return; }
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    // a link in the drawer navigates the page; close it behind them
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a[href^="#"]')) { closeDrawer(false); }
    });
    if (closeBtn) { closeBtn.addEventListener('click', function () { closeDrawer(true); }); }
    syncState();
  }

  /* ---------- carousel ----------
     Auto-advance was removed in the markup (WCAG 2.2.2: no pause control).
     Add keyboard control so the arrows are not the only way through. */
  var carousel = document.getElementById('carouselExampleCaptions');
  if (carousel && window.jQuery && jQuery.fn.carousel) {
    jQuery(carousel).carousel({ interval: false, keyboard: true });
  }
  if (carousel) {
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', function (e) {
      if (!window.jQuery) { return; }
      if (e.key === 'ArrowRight') { jQuery(carousel).carousel('next'); }
      if (e.key === 'ArrowLeft') { jQuery(carousel).carousel('prev'); }
    });
  }

  /* ---------- anchor links must clear the fixed header ----------
     The demo binds $('.scroll').on('click') and animates to
     offset().top - 0, which parks the target under the fixed navbar.
     Unbind it first, then handle the scroll with the header height
     subtracted. CSS scroll-margin-top covers non-JS paths. */
  if (window.jQuery) { jQuery('.scroll').off('click'); }
  var nav = document.querySelector('.navbar');
  [].slice.call(document.querySelectorAll('a[href^="#"]')).forEach(function (a) {
    var id = a.getAttribute('href');
    if (!id || id === '#' || id === '#main') { return; }
    a.addEventListener('click', function (e) {
      var target = document.querySelector(id);
      if (!target) { return; }
      e.preventDefault();
      var offset = (nav ? nav.getBoundingClientRect().height : 0) + 12;
      var y = target.getBoundingClientRect().top + window.pageYOffset - offset;
      var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: y < 0 ? 0 : y, behavior: still ? 'auto' : 'smooth' });
      if (history.replaceState) { history.replaceState(null, '', id); }
    });
  });
}());
