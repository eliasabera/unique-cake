/* =============================================================
   animations.js — Unique Cake House
   
   Strategy:
   - Scroll reveals use IntersectionObserver + CSS classes (bulletproof)
   - GSAP is used ONLY for hero entrance & hover effects (no gsap.from on scroll sections)
   - Nothing can stay invisible — CSS handles all visibility
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ===========================================================
     1. SCROLL REVEAL — IntersectionObserver
     Adds .visible class when elements with .reveal / .reveal-left /
     .reveal-right / .reveal-scale scroll into view.
     This is 100% reliable. No GSAP dependency.
  =========================================================== */
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale'
  );

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // Only animate once
        }
      });
    }, {
      threshold: 0.1,     // Trigger when 10% of element is visible
      rootMargin: '0px 0px -40px 0px', // Slight offset so it feels intentional
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: if IntersectionObserver is not supported, show everything
    revealElements.forEach(el => el.classList.add('visible'));
  }

  /* ===========================================================
     2. NAVBAR — scroll effect (add/remove .scrolled class)
  =========================================================== */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* ===========================================================
     3. MOBILE HAMBURGER MENU TOGGLE
  =========================================================== */
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    const closeMenu = () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');
      navLinks.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  /* ===========================================================
     4. HERO ENTRANCE — GSAP timeline (only above-the-fold content)
     Uses gsap.from() safely because these elements are always
     visible on page load — no ScrollTrigger needed.
  =========================================================== */
  if (typeof gsap !== 'undefined') {

    // --- Navbar slide down ---
    gsap.from('.header', {
      y: -60,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.1,
      clearProps: 'all',
    });

    // --- Hero content staggered entrance ---
    const heroTl = gsap.timeline({ delay: 0.3 });

    const heroSelectors = [
      { sel: '.hero-badge',       from: { opacity: 0, y: 20 },   dur: 0.6, ease: 'back.out(1.7)', offset: '0' },
      { sel: '.hero-title',       from: { opacity: 0, y: 40 },   dur: 0.8, ease: 'power3.out',    offset: '-=0.2' },
      { sel: '.hero-description', from: { opacity: 0, y: 30 },   dur: 0.7, ease: 'power2.out',    offset: '-=0.4' },
      { sel: '.hero-buttons',     from: { opacity: 0, y: 20 },   dur: 0.6, ease: 'back.out(1.7)', offset: '-=0.3' },
      { sel: '.hero-featured-card', from: { opacity: 0, x: -40 }, dur: 0.8, ease: 'power3.out',   offset: '-=0.3' },
      { sel: '.hero-image-wrapper', from: { opacity: 0, x: 60, scale: 0.92 }, dur: 1, ease: 'power3.out', offset: '-=0.8' },
    ];

    heroSelectors.forEach(item => {
      const el = document.querySelector(item.sel);
      if (el) {
        heroTl.from(el, {
          ...item.from,
          duration: item.dur,
          ease: item.ease,
          clearProps: 'all',
        }, item.offset);
      }
    });

    // --- Hero featured card floating loop ---
    const floatCard = document.querySelector('.hero-featured-card');
    if (floatCard) {
      heroTl.eventCallback('onComplete', () => {
        gsap.to(floatCard, {
          y: -10,
          duration: 2.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      });
    }

    // --- CTA button glow pulse ---
    const ctaBtn = document.querySelector('.hero-buttons .btn-primary');
    if (ctaBtn) {
      gsap.to(ctaBtn, {
        boxShadow: '0 10px 30px rgba(246, 108, 103, 0.4)',
        duration: 1.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2,
      });
    }

    // --- Hero image parallax on scroll ---
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      const heroImg = document.querySelector('.hero-image-wrapper');
      if (heroImg) {
        gsap.to(heroImg, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }
    }

    /* =========================================================
       5. HOVER EFFECTS — GSAP powered
    ========================================================= */

    // --- Cake cards ---
    document.querySelectorAll('.cake-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -12,
          boxShadow: '0 25px 60px rgba(0,0,0,0.15)',
          duration: 0.4,
          ease: 'power2.out',
        });
        const img = card.querySelector('.cake-image img');
        if (img) gsap.to(img, { scale: 1.08, duration: 0.5, ease: 'power2.out' });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
          duration: 0.4,
          ease: 'power2.out',
        });
        const img = card.querySelector('.cake-image img');
        if (img) gsap.to(img, { scale: 1, duration: 0.5, ease: 'power2.out' });
      });
    });

    // --- Feature card icon ---
    document.querySelectorAll('.feature-card').forEach(card => {
      const icon = card.querySelector('.feature-icon');
      card.addEventListener('mouseenter', () => {
        if (icon) gsap.to(icon, { scale: 1.1, rotation: -8, duration: 0.35, ease: 'back.out(1.7)' });
      });
      card.addEventListener('mouseleave', () => {
        if (icon) gsap.to(icon, { scale: 1, rotation: 0, duration: 0.35, ease: 'power2.out' });
      });
    });

  } // end if (gsap)

  /* ===========================================================
     6. NEWSLETTER FORM — submit feedback
  =========================================================== */
  const form = document.getElementById('newsletterForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      const originalText = btn.textContent;

      if (typeof gsap !== 'undefined') {
        gsap.timeline()
          .to(btn, { scale: 0.95, duration: 0.1, ease: 'power1.in' })
          .to(btn, { scale: 1.05, duration: 0.2, ease: 'back.out(2)' })
          .to(btn, { scale: 1, duration: 0.15 });
      }

      btn.textContent = '🎂 Subscribed!';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  }

});
