// ── Nav state ──
const nav = document.getElementById('nav');
const hero = document.querySelector('.hero');

function updateNav() {
  const heroBottom = hero.offsetTop + hero.offsetHeight - 80;
  const past = window.scrollY > heroBottom;
  nav.classList.toggle('nav--light', !past);
  nav.classList.toggle('nav--solid', past);
}

updateNav();
window.addEventListener('scroll', updateNav, { passive: true });

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
