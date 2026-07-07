/* ============================================
   LAKSHAY SAINI PORTFOLIO — script.js
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const isMobile = window.innerWidth <= 768;

  /* ========== NAVBAR ========== */
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ========== ACTIVE NAV LINK ========== */
  const sections    = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a');

  const observerNav = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinksAll.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observerNav.observe(s));

  /* ========== SMOOTH SCROLL ========== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      const target   = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ============================================================
     TERMINAL TAKEOVER — PROJECTS
     ============================================================ */
  const takeover     = document.getElementById('takeover');
  const flash        = document.getElementById('flash');
  const bootScreen   = document.getElementById('bootScreen');
  const bootLinesEl  = document.getElementById('bootLines');
  const progressFill = document.getElementById('progressFill');
  const projScreen   = document.getElementById('projScreen');
  const tkClose      = document.getElementById('tkClose');
  const launchBtn    = document.getElementById('launchProjectsBtn');

  // On mobile use fewer lines and faster timing to prevent freeze
  const bootLinesFull = [
    { text: '$ initializing project_loader.sh',        delay: 0    },
    { text: '$ checking system permissions...',         delay: 350  },
    { text: '[OK] access granted',                      delay: 700  },
    { text: '$ scanning repositories...',               delay: 1000 },
    { text: '[OK] found 3 deployed projects',           delay: 1300 },
    { text: '$ mounting e-rawaana-system ............', delay: 1600 },
    { text: '[OK] e-rawaana-system loaded',             delay: 1850 },
    { text: '$ mounting job-tracker ..........',        delay: 2050 },
    { text: '[OK] job-tracker loaded',                  delay: 2250 },
    { text: '$ mounting hotel-management .......',      delay: 2400 },
    { text: '[OK] hotel-management loaded',             delay: 2600 },
    { text: '$ rendering interface...',                 delay: 2800 },
  ];

  const bootLinesMobile = [
    { text: '$ initializing project_loader.sh',  delay: 0   },
    { text: '[OK] found 3 deployed projects',    delay: 500 },
    { text: '[OK] e-rawaana-system loaded',      delay: 900 },
    { text: '[OK] job-tracker loaded',           delay: 1200 },
    { text: '[OK] hotel-management loaded',      delay: 1500 },
    { text: '$ rendering interface...',          delay: 1800 },
  ];

  const bootLines   = isMobile ? bootLinesMobile : bootLinesFull;
  const BOOT_DURATION = isMobile ? 2200 : 3000;

  let bootTimers = [];
  let typingStarted = false;

  function openTakeover() {
    takeover._savedScroll = window.scrollY;
    document.body.style.overflow = 'hidden';
    takeover.classList.add('active');

    // Flash on open
    flash.classList.remove('hit');
    void flash.offsetWidth;
    flash.classList.add('hit');

    // Reset
    bootLinesEl.innerHTML = '';
    progressFill.style.transition = 'none';
    progressFill.style.width = '0%';
    projScreen.classList.remove('show');
    bootScreen.style.opacity = '1';
    bootScreen.style.display = 'flex';
    document.querySelectorAll('.p-card').forEach(c => c.classList.remove('in'));

    // Print boot lines
    bootLines.forEach(({ text, delay }) => {
      const t = setTimeout(() => {
        const div = document.createElement('div');
        div.className = 'boot-line';
        if (text.startsWith('[OK]')) {
          div.innerHTML = `<span class="ok">[OK]</span>${text.slice(4)}`;
        } else {
          div.innerHTML = `<span class="dim">${text}</span>`;
        }
        bootLinesEl.appendChild(div);
        bootLinesEl.scrollTop = bootLinesEl.scrollHeight;
        requestAnimationFrame(() => div.classList.add('show'));
      }, delay);
      bootTimers.push(t);
    });

    // Progress bar smooth fill
    requestAnimationFrame(() => {
      setTimeout(() => {
        progressFill.style.transition = `width ${BOOT_DURATION}ms linear`;
        progressFill.style.width = '100%';
      }, 30);
    });

    // Reveal projects after boot
    const revealTimer = setTimeout(() => {
      bootScreen.style.transition = 'opacity 0.35s ease';
      bootScreen.style.opacity = '0';

      setTimeout(() => {
        bootScreen.style.display = 'none';
        bootScreen.style.transition = '';
        projScreen.classList.add('show');

        // Stagger cards — longer delay on mobile to avoid paint lag
        const cardDelay = isMobile ? 200 : 140;
        document.querySelectorAll('.p-card').forEach((card, i) => {
          setTimeout(() => card.classList.add('in'), i * cardDelay);
        });

        if (!typingStarted) {
          typingStarted = true;
          setTimeout(type, 600);
        }
      }, 350);
    }, BOOT_DURATION);

    bootTimers.push(revealTimer);
  }

  function closeTakeover() {
    takeover.style.transition = 'opacity 0.4s ease';
    takeover.style.opacity = '0';

    setTimeout(() => {
      takeover.classList.remove('active');
      takeover.style.opacity = '';
      takeover.style.transition = '';
      document.body.style.overflow = '';
      window.scrollTo({ top: takeover._savedScroll || 0, behavior: 'instant' });

      // Clear timers
      bootTimers.forEach(clearTimeout);
      bootTimers = [];
    }, 400);
  }

  if (launchBtn) launchBtn.addEventListener('click', (e) => { e.preventDefault(); openTakeover(); });
  if (tkClose)   tkClose.addEventListener('click', closeTakeover);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && takeover.classList.contains('active')) closeTakeover();
  });

  /* ========== TERMINAL TYPING ========== */
  const typeTexts = [
    'ls -la ./projects',
    'cat e_rawaana_pass.js',
    'git push origin main',
    './deploy --prod'
  ];
  let ti = 0, ci = 0;
  const typedEl = document.getElementById('typed-text');

  function type() {
    if (!typedEl) return;
    if (ci < typeTexts[ti].length) {
      typedEl.textContent += typeTexts[ti][ci++];
      setTimeout(type, isMobile ? 50 : 60);
    } else {
      setTimeout(() => {
        const d = setInterval(() => {
          typedEl.textContent = typedEl.textContent.slice(0, -1);
          if (!typedEl.textContent.length) {
            clearInterval(d);
            ti = (ti + 1) % typeTexts.length;
            ci = 0;
            setTimeout(type, 400);
          }
        }, 26);
      }, 1800);
    }
  }

  /* ========== SCROLL REVEAL ========== */
  const revealEls = document.querySelectorAll(
    '.about-grid, .skill-card, .timeline-item, .contact-grid, .stats, .socials'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ========== CONTACT FORM ========== */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn      = contactForm.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML        = '<i class="fa-solid fa-check"></i> SENT!';
      btn.style.background = '#1a8a1a';
      setTimeout(() => {
        btn.innerHTML        = original;
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

  /* ========== CARD HOVER GLITCH ========== */
  if (!isMobile) {
    document.querySelectorAll('.p-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        const title = card.querySelector('.glitch-title');
        if (title) {
          title.style.animation = 'none';
          void title.offsetWidth;
          title.style.animation = 'glitch 0.4s steps(2) 1';
        }
      });
    });
  }

});
