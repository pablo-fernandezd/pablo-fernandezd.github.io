/* ── Navbar scroll effect ───────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

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

/* ── Scroll-reveal with IntersectionObserver ────────────────────── */
const revealTargets = document.querySelectorAll(
  '.timeline-item, .project-card, .edu-card'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealTargets.forEach(el => observer.observe(el));

/* ── Active nav link on scroll ──────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
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

/* ── Typed-effect on hero tagline ───────────────────────────────── */
const taglines = [
  'I build scalable software & intelligent systems.',
  'Backend Engineer. Data Engineer. AI Enthusiast.',
  'Python · Java · Cloud · Machine Learning.',
];

const taglineEl = document.querySelector('.hero-tagline');
if (taglineEl) {
  let idx = 0;
  let charIdx = 0;
  let deleting = false;
  let paused = false;

  function type() {
    const current = taglines[idx];

    if (paused) {
      paused = false;
      setTimeout(type, 1800);
      return;
    }

    if (!deleting) {
      taglineEl.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        paused = true;
      }
      setTimeout(type, 55);
    } else {
      taglineEl.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        idx = (idx + 1) % taglines.length;
      }
      setTimeout(type, 28);
    }
  }

  setTimeout(type, 1200);
}

/* ── Smooth counter animation for stat cards ────────────────────── */
const statCards = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent;
      const num = parseFloat(text);
      const hasSuffix = text.replace(String(num), '');
      if (!isNaN(num)) {
        let start = 0;
        const duration = 1200;
        const step = (timestamp) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * num) + hasSuffix;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = num + hasSuffix;
        };
        requestAnimationFrame(step);
      }
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statCards.forEach(el => counterObserver.observe(el));
