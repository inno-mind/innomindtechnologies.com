(function () {
  'use strict';

  // ===== PARTICLE NEURAL NETWORK =====
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };
  let animFrameId;

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const area = canvas.width * canvas.height;
    const count = Math.min(Math.floor(area / 8000), 120);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // mouse repulsion
      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.vx += (dx / dist) * force * 0.2;
          p.vy += (dy / dist) * force * 0.2;
        }
      }

      p.x += p.vx;
      p.y += p.vy;

      // dampen velocity
      p.vx *= 0.99;
      p.vy *= 0.99;

      // wrap edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 212, 255, ' + p.opacity + ')';
      ctx.fill();

      // connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          const lineOpacity = (1 - dist / 160) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(0, 212, 255, ' + lineOpacity + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    animFrameId = requestAnimationFrame(drawParticles);
  }

  function initParticles() {
    resizeCanvas();
    createParticles();
    drawParticles();
  }

  window.addEventListener('resize', function () {
    cancelAnimationFrame(animFrameId);
    initParticles();
  });

  canvas.addEventListener('mousemove', function (e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', function () {
    mouse.x = null;
    mouse.y = null;
  });

  initParticles();

  // ===== HEADER SCROLL EFFECT =====
  var header = document.getElementById('header');
  var lastScrollY = 0;

  window.addEventListener('scroll', function () {
    var scrollY = window.scrollY;
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }, { passive: true });

  // ===== HAMBURGER MENU =====
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');
  var overlay = document.createElement('div');
  overlay.className = 'mobile-overlay';
  document.body.appendChild(overlay);

  function toggleMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (navLinks.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // ===== SCROLL REVEAL =====
  var revealEls = document.querySelectorAll('.reveal');

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var delay = el.dataset.delay;
        if (delay) {
          setTimeout(function () {
            el.classList.add('visible');
          }, parseInt(delay));
        } else {
          el.classList.add('visible');
        }
        revealObserver.unobserve(el);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ===== STAGGER SERVICE CARDS =====
  var serviceCards = document.querySelectorAll('.services-grid .glass-card');
  var cardObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var cards = entry.target.parentElement.querySelectorAll('.glass-card');
        cards.forEach(function (card, i) {
          setTimeout(function () {
            card.classList.add('visible');
          }, i * 120);
        });
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  if (serviceCards.length > 0) {
    cardObserver.observe(serviceCards[0]);
  }

  // ===== WHY CARDS STAGGER =====
  var whyCards = document.querySelectorAll('.why-grid .why-card');
  var whyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var cards = entry.target.parentElement.querySelectorAll('.why-card');
        cards.forEach(function (card, i) {
          setTimeout(function () {
            card.classList.add('visible');
          }, i * 150);
        });
        whyObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  if (whyCards.length > 0) {
    whyObserver.observe(whyCards[0]);
  }

  // ===== STAT COUNTER ANIMATION =====
  var statNumbers = document.querySelectorAll('.stat-number');
  var countersStarted = false;

  var statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  if (statNumbers.length > 0) {
    statsObserver.observe(statNumbers[0].closest('.stats-grid'));
  }

  function animateCounters() {
    statNumbers.forEach(function (el) {
      var target = parseInt(el.dataset.target);
      var duration = 2000;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(step);
    });
  }

  // ===== CARD GLOW FOLLOW MOUSE =====
  document.querySelectorAll('.glass-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.background = 'radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(0, 212, 255, 0.08), transparent 60%)';
        glow.style.opacity = '1';
      }
    });

    card.addEventListener('mouseleave', function () {
      var glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.opacity = '0';
      }
    });
  });

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
