/* ============================================================
   AwareSphere – script.js
   All interactivity: nav, checklists, accordion, quotes,
   breathing exercise, article toggles, form validation,
   scroll reveal, stat counters.
   ============================================================ */

/* ─── 1. NAVBAR ──────────────────────────────────────────── */
(function initNav() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  // Sticky scroll style
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Mobile toggle
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
})();


/* ─── 2. SCROLL REVEAL ───────────────────────────────────── */
(function initReveal() {
  const revealEls = document.querySelectorAll(
    '.info-card, .topic-card, .blog-card, .stat-card, .break-card, .action-item, .accordion-item'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();


/* ─── 3. STAT COUNTER ANIMATION ──────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  let started = false;

  function runCounters() {
    counters.forEach(counter => {
      const target = parseFloat(counter.dataset.target);
      const isDecimal = String(target).includes('.');
      const duration = 1800;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current = Math.min(current + increment, target);
        counter.textContent = isDecimal ? current.toFixed(1) : Math.round(current);
        if (step >= steps) clearInterval(timer);
      }, duration / steps);
    });
  }

  const heroSection = document.querySelector('.hero');
  const heroObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      setTimeout(runCounters, 500);
    }
  }, { threshold: 0.3 });

  if (heroSection) heroObserver.observe(heroSection);
})();


/* ─── 4. INTERACTIVE CHECKLISTS ──────────────────────────── */
(function initChecklists() {
  const configs = {
    energy: {
      listId:     'energy-list',
      progressId: 'energy-progress',
      labelId:    'energy-label',
      resultId:   'energy-result',
      total: 8,
      messages: {
        great: '🌟 Excellent! You are an energy-saving champion! Keep inspiring others.',
        good:  '👍 Great effort! A few more habits and you\'ll be a true energy saver.',
        start: '🌱 Good start! Small changes compound over time — keep going!'
      }
    },
    digital: {
      listId:     'digital-list',
      progressId: 'digital-progress',
      labelId:    'digital-label',
      resultId:   'digital-result',
      total: 8,
      messages: {
        great: '🔐 Excellent! You are well-protected online. Share these habits with others!',
        good:  '⚠️ You\'re mostly safe. Work on the unchecked items to close any gaps.',
        start: '🚨 Several safety habits are missing. Review the tips above carefully!'
      }
    }
  };

  Object.values(configs).forEach(cfg => {
    const list       = document.getElementById(cfg.listId);
    const progressEl = document.getElementById(cfg.progressId);
    const labelEl    = document.getElementById(cfg.labelId);
    const resultEl   = document.getElementById(cfg.resultId);
    if (!list) return;

    function update() {
      const checked = list.querySelectorAll('input:checked').length;
      const pct     = Math.round((checked / cfg.total) * 100);
      progressEl.style.width = pct + '%';
      labelEl.textContent = `${checked} / ${cfg.total} habits adopted`;

      resultEl.className = 'checklist-result show';
      if (pct === 100) {
        resultEl.textContent = cfg.messages.great;
        resultEl.classList.add('great');
      } else if (pct >= 50) {
        resultEl.textContent = cfg.messages.good;
        resultEl.classList.add('good');
      } else {
        resultEl.textContent = cfg.messages.start;
        resultEl.classList.add('start');
      }
    }

    list.addEventListener('change', update);
  });
})();


/* ─── 5. ACCORDION ──────────────────────────────────────── */
(function initAccordion() {
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.parentElement;
      const body   = item.querySelector('.accordion-body');
      const isOpen = btn.classList.contains('open');

      // Close all
      document.querySelectorAll('.accordion-btn').forEach(b => {
        b.classList.remove('open');
        b.parentElement.querySelector('.accordion-body').classList.remove('open');
      });

      // Toggle clicked
      if (!isOpen) {
        btn.classList.add('open');
        body.classList.add('open');
      }
    });
  });
})();


/* ─── 6. QUOTE CAROUSEL ─────────────────────────────────── */
(function initQuotes() {
  const track = document.getElementById('quote-track');
  const dotsEl = document.getElementById('quote-dots');
  if (!track) return;

  const slides = track.querySelectorAll('.quote-slide');
  let current = 0;
  let timer;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'quote-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Quote ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  });

  function goTo(index) {
    slides[current].classList.remove('active');
    dotsEl.children[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dotsEl.children[current].classList.add('active');
    restartTimer();
  }

  function restartTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  restartTimer();
})();


/* ─── 7. BREATHING EXERCISE ─────────────────────────────── */
(function initBreathing() {
  const overlay    = document.getElementById('breathe-overlay');
  const circle     = document.getElementById('breathe-circle');
  const textEl     = document.getElementById('breathe-text');
  const instrEl    = document.getElementById('breathe-instruction');
  const startBtn   = document.getElementById('start-breathe');
  const closeBtn   = document.getElementById('close-breathe');
  const openBtn    = document.getElementById('breathe-btn');
  if (!overlay) return;

  let breatheTimer = null;
  let cycles = 0;

  function resetBreath() {
    clearTimeout(breatheTimer);
    circle.className = 'breathe-circle';
    textEl.textContent = 'Get Ready';
    instrEl.textContent = 'Press Start to begin the 4-7-8 exercise';
    startBtn.textContent = 'Start';
    startBtn.disabled = false;
    cycles = 0;
  }

  function runCycle() {
    // Inhale 4s
    circle.className = 'breathe-circle inhale';
    textEl.textContent = 'Inhale';
    instrEl.textContent = 'Breathe in through your nose... 4 seconds';

    breatheTimer = setTimeout(() => {
      // Hold 7s
      circle.className = 'breathe-circle hold';
      textEl.textContent = 'Hold';
      instrEl.textContent = 'Hold your breath... 7 seconds';

      breatheTimer = setTimeout(() => {
        // Exhale 8s
        circle.className = 'breathe-circle exhale';
        textEl.textContent = 'Exhale';
        instrEl.textContent = 'Breathe out slowly... 8 seconds';

        breatheTimer = setTimeout(() => {
          cycles++;
          if (cycles < 3) {
            instrEl.textContent = `Cycle ${cycles} done. Starting next...`;
            breatheTimer = setTimeout(runCycle, 1000);
          } else {
            circle.className = 'breathe-circle';
            textEl.textContent = '✓ Done';
            instrEl.textContent = '🌟 Great work! You completed 3 cycles. Feel the calm.';
            startBtn.textContent = 'Restart';
            startBtn.disabled = false;
            cycles = 0;
          }
        }, 8000);
      }, 7000);
    }, 4000);
  }

  openBtn.querySelector('button').addEventListener('click', () => {
    overlay.classList.add('active');
    resetBreath();
  });

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
    resetBreath();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      resetBreath();
    }
  });

  startBtn.addEventListener('click', () => {
    startBtn.disabled = true;
    startBtn.textContent = 'Running...';
    cycles = 0;
    runCycle();
  });
})();


/* ─── 8. ARTICLE READ MORE TOGGLE ───────────────────────── */
(function initArticles() {
  document.querySelectorAll('.btn-read').forEach(btn => {
    btn.addEventListener('click', () => {
      const id      = btn.dataset.article;
      const content = document.getElementById(id);
      if (!content) return;

      const isOpen = content.style.display !== 'none';
      content.style.display = isOpen ? 'none' : 'block';
      btn.textContent = isOpen ? 'Read Full Article ↓' : 'Collapse Article ↑';

      if (!isOpen) {
        setTimeout(() => content.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
      }
    });
  });
})();


/* ─── 9. CONTACT FORM VALIDATION ────────────────────────── */
(function initContactForm() {
  const form       = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  if (!form) return;

  function showError(fieldId, msg) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + '-error');
    if (field)  field.classList.add('error');
    if (error)  error.textContent = msg;
  }

  function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + '-error');
    if (field)  field.classList.remove('error');
    if (error)  error.textContent = '';
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Live clearing on input
  ['name', 'email', 'message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => clearError(id));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    clearError('name'); clearError('email'); clearError('message');

    if (!name) {
      showError('name', 'Please enter your full name.');
      valid = false;
    }

    if (!email) {
      showError('email', 'Please enter your email address.');
      valid = false;
    } else if (!validateEmail(email)) {
      showError('email', 'Please enter a valid email address.');
      valid = false;
    }

    if (!message || message.length < 10) {
      showError('message', 'Please enter a message of at least 10 characters.');
      valid = false;
    }

    if (valid) {
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Sending... ⏳';
      submitBtn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
      .then(res => {
        if (res.ok) {
          // ✅ Success — message delivered to your Formspree inbox
          successMsg.style.display = 'block';
          form.reset();
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          setTimeout(() => { successMsg.style.display = 'none'; }, 6000);
        } else {
          // ⚠️ Formspree returned an error
          res.json().then(data => {
            const errMsg = data.errors
              ? data.errors.map(e => e.message).join(', ')
              : 'Submission failed. Please try again.';
            showError('message', '⚠️ ' + errMsg);
          });
        }
      })
      .catch(() => {
        // 🌐 Network error (offline, etc.)
        showError('message', '🌐 Network error. Please check your connection and try again.');
      })
      .finally(() => {
        submitBtn.textContent = 'Send Message 📨';
        submitBtn.disabled = false;
      });
    }
  });
})();


/* ─── 10. ACTIVE NAV HIGHLIGHT ON SCROLL ────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  function setActive() {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.style.background = '';
      link.style.color = '';
      const href = link.getAttribute('href');
      if (href === '#' + current) {
        link.style.background = 'var(--green-pale)';
        link.style.color = 'var(--green-dark)';
      }
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
})();


/* ─── 11. SMOOTH ANCHOR SCROLL (fallback for older browsers) */
(function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 72; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();