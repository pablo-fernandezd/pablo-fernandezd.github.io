/* ═══════════════════════════════════════════════════════════════════
   PORTFOLIO — script.js
   ═══════════════════════════════════════════════════════════════════ */

const isMobile = () => window.matchMedia('(pointer: coarse)').matches;

/* ── 1. Custom cursor ───────────────────────────────────────────── */
if (!isMobile()) {
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px)`;
  });

  (function loopRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx}px,${ry}px)`;
    requestAnimationFrame(loopRing);
  })();

  document.querySelectorAll('a, button, .project-card, .stat-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('cursor-grow'));
    el.addEventListener('mouseleave', () => ring.classList.remove('cursor-grow'));
  });
}

/* ── 2. Hero particle network (canvas) ──────────────────────────── */
(function initParticles() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'hero-canvas';
  hero.prepend(canvas);
  const ctx = canvas.getContext('2d');

  const COUNT   = isMobile() ? 30 : 60;
  const MAXDIST = 130;
  let W, H, particles;

  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function rand(min, max) { return Math.random() * (max - min) + min; }

  particles = Array.from({ length: COUNT }, () => ({
    x:  rand(0, W), y:  rand(0, H),
    vx: rand(-0.3, 0.3), vy: rand(-0.3, 0.3),
    r:  rand(1.2, 2.5),
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;  p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(78,154,241,0.55)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAXDIST) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(78,154,241,${0.18 * (1 - dist / MAXDIST)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── 3. Magnetic buttons ────────────────────────────────────────── */
if (!isMobile()) {
  document.querySelectorAll('.btn-primary, .btn-outline, .btn-outline-sm').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) * 0.28;
      const dy = (e.clientY - cy) * 0.28;
      btn.style.transform = `translate(${dx}px,${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ── 4. Card spotlight glow ─────────────────────────────────────── */
if (!isMobile()) {
  document.querySelectorAll('.project-card, .stat-card, .edu-card, .timeline-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = ((e.clientX - r.left) / r.width)  * 100;
      const y  = ((e.clientY - r.top)  / r.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
      card.classList.add('spotlight');
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('spotlight');
    });
  });
}

/* ── 5. Hero content stagger on load ────────────────────────────── */
window.addEventListener('load', () => {
  const items = document.querySelectorAll(
    '.hero-greeting, .hero-name, .hero-tagline, .hero-description, .hero-actions'
  );
  items.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(24px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }));
  });
});

/* ── 6. Navbar scroll effect ────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ── 7. Scroll-reveal ───────────────────────────────────────────── */
const revealTargets = document.querySelectorAll(
  '.timeline-item, .project-card, .edu-card'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 90);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

revealTargets.forEach(el => observer.observe(el));

/* ── 8. Active nav link on scroll ───────────────────────────────── */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => {
        a.classList.toggle('active-link', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

/* ── 9. Typed tagline ───────────────────────────────────────────── */
const taglines = [
  'I build scalable software & intelligent systems.',
  'Backend Engineer. Data Engineer. AI Enthusiast.',
  'Python · Java · Cloud · Machine Learning.',
];

const taglineEl = document.querySelector('.hero-tagline');
if (taglineEl) {
  let idx = 0, charIdx = 0, deleting = false, paused = false;

  function type() {
    const current = taglines[idx];
    if (paused) { paused = false; setTimeout(type, 1800); return; }
    if (!deleting) {
      taglineEl.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) { deleting = true; paused = true; }
      setTimeout(type, 55);
    } else {
      taglineEl.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) { deleting = false; idx = (idx + 1) % taglines.length; }
      setTimeout(type, 28);
    }
  }
  setTimeout(type, 1200);
}

/* ── 10. Counter animation ──────────────────────────────────────── */
const statCards = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el  = entry.target;
      const txt = el.textContent;
      const num = parseFloat(txt);
      const sfx = txt.replace(String(num), '');
      if (!isNaN(num)) {
        let start = 0;
        const step = ts => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / 1200, 1);
          el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * num) + sfx;
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = num + sfx;
        };
        requestAnimationFrame(step);
      }
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statCards.forEach(el => counterObserver.observe(el));
