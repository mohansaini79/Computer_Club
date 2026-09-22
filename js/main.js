/* ============================================
   SUG Computer Club – Web Craft
   Main JavaScript
   ============================================ */

/* ============================
   PARTICLE BACKGROUND
   ============================ */
(function initParticles() {
  const canvas = document.getElementById('particles-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const COLORS = [
    'rgba(196,181,253,', // lavender
    'rgba(124,58,237,',  // violet
    'rgba(79,70,229,',   // indigo
    'rgba(165,180,252,', // periwinkle
    'rgba(56,189,248,',  // sky
  ];

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x:    rand(0, W),
      y:    rand(0, H),
      r:    rand(0.6, 1.8),          // tiny pixel dots
      vx:   rand(-0.25, 0.25),
      vy:   rand(-0.35, -0.08),      // drift upward slowly
      alpha: rand(0.12, 0.45),
      color,
      pulse: rand(0, Math.PI * 2),   // phase offset for breathing
    };
  }

  function initParticlesList() {
    const count = Math.min(Math.floor((W * H) / 9000), 120);
    particles = Array.from({ length: count }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const t = performance.now() * 0.0008;

    for (const p of particles) {
      // Gentle breathing opacity
      const breath = p.alpha + Math.sin(t + p.pulse) * 0.06;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.max(0, Math.min(1, breath)) + ')';
      ctx.fill();

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.y < -4)  p.y = H + 4;
      if (p.y > H + 4) p.y = -4;
      if (p.x < -4)  p.x = W + 4;
      if (p.x > W + 4) p.x = -4;
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); initParticlesList(); }, { passive: true });

  resize();
  initParticlesList();
  draw();
})();


document.addEventListener('DOMContentLoaded', () => {
  // Init Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ---- Navbar scroll ----
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  // ---- Hamburger menu ----
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navOverlay = document.getElementById('nav-overlay');

  function toggleMenu(open) {
    const isOpen = typeof open === 'boolean' ? open : !navMenu.classList.contains('active');
    hamburger.classList.toggle('active', isOpen);
    navMenu.classList.toggle('active', isOpen);
    navOverlay.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.classList.toggle('no-scroll', isOpen);
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => toggleMenu());
  }
  if (navOverlay) {
    navOverlay.addEventListener('click', () => toggleMenu(false));
  }
  // Close menu on nav link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) toggleMenu(false);
    });
  });

  // ---- Active nav link ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---- Scroll animations ----
  const animEls = document.querySelectorAll('[data-animate]');
  if (animEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    animEls.forEach(el => observer.observe(el));
  }

  // ---- Stats counter ----
  const statItems = document.querySelectorAll('.stat-item[data-count]');
  if (statItems.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const count = parseInt(target.dataset.count, 10);
          const numEl = target.querySelector('.stat-number');
          if (numEl && !target.dataset.counted) {
            target.dataset.counted = 'true';
            animateCount(numEl, 0, count, 800);
          }
          countObserver.unobserve(target);
        }
      });
    }, { threshold: 0.5 });
    statItems.forEach(el => countObserver.observe(el));
  }

  function animateCount(el, start, end, duration) {
    const startTime = performance.now();
    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (end - start) * ease);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ---- Modal ----
  const modal = document.getElementById('joinModal');
  const modalClose = document.getElementById('modalClose');
  const joinForm = document.getElementById('joinForm');
  const formSuccess = document.getElementById('formSuccess');

  window.openJoinModal = function () {
    if (!modal) return;
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    // Focus first input
    setTimeout(() => {
      const firstInput = modal.querySelector('input, select, textarea');
      if (firstInput) firstInput.focus();
    }, 100);
  };

  function closeJoinModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove('no-scroll');
  }

  if (modalClose) modalClose.addEventListener('click', closeJoinModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeJoinModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.hidden) closeJoinModal();
  });

  // ---- Form validation ----
  if (joinForm) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Clear errors
      joinForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

      // Required fields
      const requiredFields = joinForm.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        const group = field.closest('.form-group');
        const error = group.querySelector('.form-error');
        if (!field.value.trim()) {
          valid = false;
          group.classList.add('error');
          if (error) error.textContent = 'This field is required';
        }
      });

      // Email check
      const emailField = joinForm.querySelector('[type="email"]');
      if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value.trim())) {
          valid = false;
          const group = emailField.closest('.form-group');
          group.classList.add('error');
          const error = group.querySelector('.form-error');
          if (error) error.textContent = 'Enter a valid email';
        }
      }

      // Phone check
      const phoneField = joinForm.querySelector('[type="tel"]');
      if (phoneField && phoneField.value.trim()) {
        if (!/^[0-9]{10}$/.test(phoneField.value.trim())) {
          valid = false;
          const group = phoneField.closest('.form-group');
          group.classList.add('error');
          const error = group.querySelector('.form-error');
          if (error) error.textContent = 'Enter a valid 10-digit number';
        }
      }

      if (valid) {
        joinForm.hidden = true;
        if (formSuccess) {
          formSuccess.hidden = false;
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
      }
    });
  }

  // ---- Contact form ----
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      contactForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
      contactForm.querySelectorAll('[required]').forEach(field => {
        const group = field.closest('.form-group');
        const error = group.querySelector('.form-error');
        if (!field.value.trim()) {
          valid = false;
          group.classList.add('error');
          if (error) error.textContent = 'This field is required';
        }
      });
      const emailField = contactForm.querySelector('[type="email"]');
      if (emailField && emailField.value.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
          valid = false;
          const group = emailField.closest('.form-group');
          group.classList.add('error');
          const error = group.querySelector('.form-error');
          if (error) error.textContent = 'Enter a valid email';
        }
      }
      if (valid) {
        contactForm.hidden = true;
        if (contactSuccess) {
          contactSuccess.hidden = false;
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
      }
    });
  }

  // ---- Gallery filters ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
});
