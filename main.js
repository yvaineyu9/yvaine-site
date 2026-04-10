// ── Nav state + Hero parallax ──
const nav = document.getElementById('nav');
const hero = document.querySelector('.hero');
const planet = document.getElementById('planet');

let scrollY = 0;

function onScroll() {
  scrollY = window.scrollY;
  // Nav state
  const heroBottom = hero.offsetTop + hero.offsetHeight - 80;
  const past = scrollY > heroBottom;
  nav.classList.toggle('nav--light', !past);
  nav.classList.toggle('nav--solid', past);
  // Planet: parallax translate + counter-clockwise rotation
  if (planet) {
    const translateY = scrollY * 0.35;
    const rotate = -(scrollY * 0.08); // negative = counter-clockwise
    planet.style.transform = `translate(-50%, calc(-50% + ${translateY}px)) rotate(${rotate}deg)`;
  }
}

onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// ── Cosmic particles ──
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  function createParticles() {
    const count = Math.floor((w * h) / 9000);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.2,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        baseAlpha: Math.random() * 0.6 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
      });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    // Parallax offset based on scroll, deeper particles move less
    const scrollOffset = scrollY * 0.25;
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.twinkle += 0.02;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
      const alpha = p.baseAlpha * (0.5 + 0.5 * Math.sin(p.twinkle));
      const drawY = p.y + scrollOffset * (p.r * 0.6);
      ctx.beginPath();
      ctx.arc(p.x, drawY % h, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }

  resize();
  createParticles();
  tick();
  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
})();

// ── Reveal on scroll ──
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      const index = Array.from(siblings).indexOf(entry.target);
      entry.target.style.transitionDelay = `${index * 80}ms`;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => observer.observe(el));

// ── Smooth scroll ──
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
