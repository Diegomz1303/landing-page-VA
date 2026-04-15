'use strict';

/* ── NAVBAR ──────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 70);
}, { passive: true });

hamburger.addEventListener('click', openNav);
document.getElementById('mobileClose').addEventListener('click', closeNav);

function openNav() {
  hamburger.classList.add('open');
  mobileNav.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeNav() {
  hamburger.classList.remove('open');
  mobileNav.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* Close mobile nav on backdrop click */
mobileNav.addEventListener('click', e => {
  if (e.target === mobileNav) closeNav();
});

/* ── SMOOTH SCROLL ───────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ── SCROLL ANIMATIONS (IntersectionObserver) ────── */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up, .fade-in, .slide-right').forEach(el => io.observe(el));

/* ── SERVICE CARDS STAGGER ───────────────────────── */
const servicesGrid = document.getElementById('servicesGrid');
const gridIO = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    entries[0].target.classList.add('in-view');
    gridIO.disconnect();
  }
}, { threshold: 0.08 });
gridIO.observe(servicesGrid);

/* ── ANIMATED COUNTERS ───────────────────────────── */
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function animateCounter(el, target, duration) {
  const start = performance.now();
  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOutCubic(t) * target);
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

let countersRan = false;
const statsGrid = document.getElementById('statsGrid');
const counterIO = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !countersRan) {
    countersRan = true;
    document.querySelectorAll('.counter').forEach(el => {
      animateCounter(el, parseInt(el.dataset.target, 10), 2200);
    });
    counterIO.disconnect();
  }
}, { threshold: 0.25 });
counterIO.observe(statsGrid);

/* ── TESTIMONIALS CAROUSEL ───────────────────────── */
const track = document.getElementById('testiTrack');
const dots  = document.querySelectorAll('.c-dot');
let current = 0;
let autoTimer;

function getVisible() {
  const w = window.innerWidth;
  if (w < 540)  return 1;
  if (w < 900)  return 2;
  return 3;
}

function goTo(idx) {
  const cards   = track.children;
  const visible = getVisible();
  const max     = Math.max(0, cards.length - visible);
  current = Math.max(0, Math.min(idx, max));

  const cardW = cards[0].offsetWidth + 22; // card width + gap
  track.style.transform = `translateX(-${current * cardW}px)`;

  dots.forEach((d, i) => {
    const active = i === current;
    d.classList.toggle('active', active);
    d.setAttribute('aria-selected', String(active));
  });
}

document.getElementById('testiNext').addEventListener('click', () => {
  const visible = getVisible();
  const max     = Math.max(0, track.children.length - visible);
  goTo(current >= max ? 0 : current + 1);
  resetTimer();
});

document.getElementById('testiPrev').addEventListener('click', () => {
  const visible = getVisible();
  const max     = Math.max(0, track.children.length - visible);
  goTo(current <= 0 ? max : current - 1);
  resetTimer();
});

dots.forEach(d => {
  d.addEventListener('click', () => { goTo(parseInt(d.dataset.i, 10)); resetTimer(); });
});

function startTimer() {
  autoTimer = setInterval(() => {
    const visible = getVisible();
    const max = Math.max(0, track.children.length - visible);
    goTo(current >= max ? 0 : current + 1);
  }, 4500);
}

function resetTimer() {
  clearInterval(autoTimer);
  startTimer();
}

startTimer();
track.addEventListener('mouseenter', () => clearInterval(autoTimer));
track.addEventListener('mouseleave', startTimer);
window.addEventListener('resize', () => goTo(current), { passive: true });

/* ── CONTACT FORM → WHATSAPP ─────────────────────── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const name  = document.getElementById('f-name').value.trim();
    const phone = document.getElementById('f-phone').value.trim();
    const pet   = document.getElementById('f-pet').value.trim();
    const typeEl = document.getElementById('f-type');
    const type  = typeEl.options[typeEl.selectedIndex].text;
    const msg   = document.getElementById('f-msg').value.trim();

    const text =
      `🐾 *Nueva Cita - Clínica Veterinaria Alvarez*\n\n` +
      `👤 *Nombre:* ${name || '—'}\n` +
      `📞 *Teléfono:* ${phone || '—'}\n` +
      `🐶 *Mascota:* ${pet || '—'}\n` +
      `🏷️ *Tipo:* ${type === 'Selecciona una opción' ? '—' : type}\n` +
      `📋 *Motivo:* ${msg || '—'}`;

    const url = `https://wa.me/51956662849?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');

    const btn = contactForm.querySelector('.form-btn');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fab fa-whatsapp"></i> ¡Abriendo WhatsApp!';
    btn.style.background = '#25d366';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3500);
  });
}

/* ── HERO PARALLAX (subtle) ──────────────────────── */
const heroDots = document.querySelector('.hero-dots');
if (heroDots) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroDots.style.transform = `translateY(${window.scrollY * 0.18}px)`;
    }
  }, { passive: true });
}
