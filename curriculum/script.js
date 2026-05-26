/* The Intelligence Curriculum — small UI helpers.
   Only what's needed: theme toggle, mobile nav, and ToC active-link tracking. */

(function () {
  'use strict';

  // ---------- Theme toggle ----------
  var root = document.documentElement;
  var toggle = document.getElementById('themeToggle');
  var themePreference = null;

  function currentTheme() {
    if (themePreference === 'light' || themePreference === 'dark') return themePreference;
    // Fall back to OS preference if not explicitly set.
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (toggle) toggle.setAttribute('aria-label',
      theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }

  // Initialize aria-label to match the actually-applied theme
  applyTheme(currentTheme());

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = (root.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
      themePreference = next;
      applyTheme(next);
    });
  }

  // ---------- Mobile nav toggle ----------
  var header = document.getElementById('header');
  var navBtn = document.querySelector('.nav-toggle');
  if (header && navBtn) {
    navBtn.addEventListener('click', function () {
      var open = header.getAttribute('data-open') === 'true';
      header.setAttribute('data-open', open ? 'false' : 'true');
      navBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });

    // Close mobile nav when a link is clicked
    header.querySelectorAll('nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        header.setAttribute('data-open', 'false');
        navBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- Active section highlight in ToC ----------
  var tocLinks = Array.prototype.slice.call(
    document.querySelectorAll('.toc a[href^="#"]')
  );
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var idToLink = {};
    var targets = [];
    tocLinks.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (el) { idToLink[id] = a; targets.push(el); }
    });

    var active = null;
    var observer = new IntersectionObserver(function (entries) {
      // Pick the topmost intersecting entry
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var link = idToLink[entry.target.id];
          if (!link) return;
          if (active) active.classList.remove('is-active');
          link.classList.add('is-active');
          active = link;
        }
      });
    }, {
      rootMargin: '-30% 0px -55% 0px',
      threshold: 0
    });

    targets.forEach(function (el) { observer.observe(el); });
  }

})();
