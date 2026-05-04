/* ============================================================
   WEBTION LAB — Angular-style SPA Router & App Controller
   app.js — Main application entry point
   ============================================================ */

'use strict';

/* ── CONFIG ─────────────────────────────────────────────── */
const WebtionApp = {
  CONTACT_EMAIL: 'Ravi.shanka.lawaniya@gmail.com',
  PHONE:         '+91 97111 86182',
  ADDRESS:       'Noida, Uttar Pradesh, India',
  COMPANY:       'Webtion Lab',
  TAGLINE:       'A Mint of Creativity',

  currentPage: 'home',
  routes: ['home', 'webdev', 'maintenance', 'clinic', 'quote'],

  /* ── INIT ── */
  init() {
    this.bindNavbar();
    this.handleHashRouting();
    this.initReveal();
    this.initCounters();
    window.addEventListener('hashchange', () => this.handleHashRouting());
    window.addEventListener('scroll',    () => this.onScroll());
  },

  /* ── ROUTING ── */
  navigate(page) {
    if (!this.routes.includes(page)) page = 'home';
    this.currentPage = page;

    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Show target page
    const target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');

    // Update nav active state
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.dataset.page === page);
    });

    // Update hash without scrolling
    history.pushState(null, '', '#' + page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Re-init reveal on new page
    setTimeout(() => this.initReveal(), 150);

    // Close mobile menu
    NavbarController.close();
  },

  handleHashRouting() {
    const hash = window.location.hash.replace('#', '') || 'home';
    this.navigate(hash);
  },

  /* ── SCROLL ── */
  onScroll() {
    const nav = document.getElementById('main-nav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
  },

  /* ── REVEAL ANIMATIONS ── */
  initReveal() {
    const els = document.querySelectorAll('.reveal:not(.visible)');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.10 });
    els.forEach(el => observer.observe(el));
  },

  /* ── COUNTER ANIMATION ── */
  initCounters() {
    const els = document.querySelectorAll('.stat-num');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el     = e.target;
          const target = parseInt(el.dataset.target);
          const suffix = el.dataset.suffix || '';
          const t0     = performance.now();
          const step   = now => {
            const p  = Math.min((now - t0) / 1800, 1);
            const v  = Math.floor((1 - Math.pow(1 - p, 4)) * target);
            el.textContent = v + suffix;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.50 });
    els.forEach(el => observer.observe(el));
  },

  /* ── NAV BINDING ── */
  bindNavbar() {
    // All nav links
    document.querySelectorAll('[data-page]').forEach(el => {
      el.addEventListener('click', () => this.navigate(el.dataset.page));
    });
  }
};

/* ── NAVBAR CONTROLLER ──────────────────────────────────── */
const NavbarController = {
  open() {
    document.getElementById('hamburger').classList.add('open');
    document.getElementById('mob-nav').classList.add('open');
  },
  close() {
    document.getElementById('hamburger').classList.remove('open');
    document.getElementById('mob-nav').classList.remove('open');
  },
  toggle() {
    const isOpen = document.getElementById('mob-nav').classList.contains('open');
    isOpen ? this.close() : this.open();
  }
};

/* ── BOOT ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => WebtionApp.init());
