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
}, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });

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


/* ── CONTACT FORM → WHATSAPP ─────────────────────── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const name   = document.getElementById('f-name').value.trim();
    const pet    = document.getElementById('f-pet').value.trim();
    const typeEl = document.getElementById('f-type');
    const type   = typeEl.options[typeEl.selectedIndex].text;
    const sex    = document.getElementById('f-sex').value;
    const age    = document.getElementById('f-age').value;
    const size   = document.getElementById('f-size').value;
    const msg    = document.getElementById('f-msg').value.trim();

    const text =
      `🐾 *Cita - Clínica Veterinaria Alvarez*\n\n` +
      `👤 *Propietario:* ${name || '—'}\n` +
      `🐶 *Mascota:* ${pet || '—'}\n` +
      `🏷️ *Especie:* ${type === 'Selecciona una opción' ? '—' : type}\n` +
      `⚥ *Sexo:* ${sex || '—'}\n` +
      `🎂 *Edad:* ${age || '—'}\n` +
      `📏 *Tamaño:* ${size || '—'}\n` +
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

/* ── CAMPOS EXTRA MASCOTA ────────────────────────── */
const petInput  = document.getElementById('f-pet');
const petExtra  = document.getElementById('petExtra');
if (petInput && petExtra) {
  petInput.addEventListener('input', () => {
    petExtra.classList.toggle('visible', petInput.value.trim().length > 0);
  });
}

/* ── MAPA FACADE ─────────────────────────────────── */
const mapaBtn = document.getElementById('mapaBtn');
if (mapaBtn) {
  mapaBtn.addEventListener('click', () => {
    const col = document.getElementById('mapaCol');
    col.innerHTML = '<iframe src="https://maps.google.com/maps?q=Calle+Castrovirreyna+474,+Ica,+Peru&output=embed" title="Ubicación Clínica Veterinaria Alvarez" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" style="width:100%;height:100%;display:block;border:none;"></iframe>';
  });
}

/* ── ABOUT CAROUSEL ──────────────────────────────── */
const aboutSlides = document.querySelectorAll('.about-slide');
const aboutDots   = document.querySelectorAll('.about-dot');
let aboutCurrent  = 0;
let aboutTimer;

function goToAbout(idx) {
  aboutSlides[aboutCurrent].classList.remove('active');
  aboutDots[aboutCurrent].classList.remove('active');
  aboutCurrent = (idx + aboutSlides.length) % aboutSlides.length;
  aboutSlides[aboutCurrent].classList.add('active');
  aboutDots[aboutCurrent].classList.add('active');
}

function startAboutTimer() {
  aboutTimer = setInterval(() => goToAbout(aboutCurrent + 1), 4000);
}
function resetAboutTimer() { clearInterval(aboutTimer); startAboutTimer(); }

document.getElementById('aboutNext').addEventListener('click', () => { goToAbout(aboutCurrent + 1); resetAboutTimer(); });
document.getElementById('aboutPrev').addEventListener('click', () => { goToAbout(aboutCurrent - 1); resetAboutTimer(); });
aboutDots.forEach(d => d.addEventListener('click', () => { goToAbout(+d.dataset.i); resetAboutTimer(); }));

startAboutTimer();

/* ── MODALS ──────────────────────────────────────── */
function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('linkPrivacidad').addEventListener('click', e => {
  e.preventDefault();
  openModal('modalPrivacidad');
});

document.getElementById('linkTerminos').addEventListener('click', e => {
  e.preventDefault();
  openModal('modalTerminos');
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.querySelector('.modal-close').addEventListener('click', () => closeModal(overlay.id));
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(overlay.id); });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
  }
});

/* ── HERO PARALLAX (subtle) ──────────────────────── */
const heroDots = document.querySelector('.hero-dots');
if (heroDots) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroDots.style.transform = `translateY(${window.scrollY * 0.18}px)`;
    }
  }, { passive: true });
}
