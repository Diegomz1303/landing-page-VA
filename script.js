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

    const name      = document.getElementById('f-name').value.trim();
    const pet       = document.getElementById('f-pet').value.trim();
    const typeEl    = document.getElementById('f-type');
    const type      = typeEl.options[typeEl.selectedIndex].text;
    const sex       = document.getElementById('f-sex').value;
    const age       = document.getElementById('f-age').value;
    const size      = document.getElementById('f-size').value;
    const exoticType = document.getElementById('f-exotic-type').value.trim();
    const msg       = document.getElementById('f-msg').value.trim();

    const especieTxt = type === 'Selecciona una opción' ? '—' : type;
    const extraFields = typeEl.value === 'exotica'
      ? `🦎 *Tipo de exótico:* ${exoticType || '—'}\n🎂 *Edad:* ${age || '—'}\n`
      : `⚥ *Sexo:* ${sex || '—'}\n🎂 *Edad:* ${age || '—'}\n📏 *Tamaño:* ${size || '—'}\n`;

    const text =
      `🐾 *Cita - Clínica Veterinaria Alvarez*\n\n` +
      `👤 *Propietario:* ${name || '—'}\n` +
      `🐶 *Mascota:* ${pet || '—'}\n` +
      `🏷️ *Especie:* ${especieTxt}\n` +
      extraFields +
      `📋 *Motivo:* ${msg || '—'}`;

    const phone = typeEl.value === 'exotica' ? '51998417342' : '51956662849';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
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

/* ── CHAT FLOTANTE ───────────────────────────────── */
const chatWidget  = document.getElementById('chatWidget');
const chatToggle  = document.getElementById('chatToggle');
const chatClose   = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatReplies  = document.getElementById('chatReplies');

const faqs = [
  {
    q: '💰 ¿Cuánto cuesta la consulta?',
    a: 'Nuestros precios de consulta son:\n🐾 Perros y gatos: S/ 30\n🦎 Animales exóticos: S/ 40\n\n¡Te esperamos!'
  },
  {
    q: '📍 ¿Dónde están ubicados?',
    a: 'Nos encontramos en:\n📌 Calle Castrovirreyna N° 474\nIca, Perú 11002\n\n¡Fácil de encontrar en el centro de Ica!'
  },
  {
    q: '🕐 ¿Cuál es el horario?',
    a: 'Atendemos:\n📅 Lunes a Sábado\n⏰ 9:00 am – 7:30 pm\n\nDomingos cerrado.'
  },
  {
    q: '🚗 ¿Hacen servicio a domicilio?',
    a: '¡Sí! Ofrecemos servicio veterinario a domicilio en toda la ciudad de Ica. 🏠\n\nEscríbenos por WhatsApp para coordinar.'
  },
  {
    q: '🦎 ¿Atienden animales exóticos?',
    a: '¡Sí! Es nuestra nueva especialidad. 🌟\n\nAtendemos: conejos, hamsters, reptiles, aves y más animales no convencionales.'
  },
  {
    q: '✂️ ¿Cuánto cuesta el baño y corte?',
    a: 'El precio varía según el tamaño y raza de tu mascota. 🛁\n\nEscríbenos por WhatsApp con una foto de tu peludito y te damos el precio exacto.'
  },
  {
    q: '📅 ¿Cómo agendo una cita?',
    a: 'Puedes agendar tu cita de dos formas:\n\n1️⃣ Llena el formulario en esta página\n2️⃣ Escríbenos directo al WhatsApp: 956 662 849'
  },
  {
    q: '🐰 ¿En qué consiste la Promo Bunny?',
    a: 'La Promo Bunny incluye atención especializada para conejos y animales pequeños. 🐾\n\nEscríbenos al WhatsApp para conocer todos los detalles y precio.'
  },
  {
    q: '🚨 ¿Atienden emergencias?',
    a: 'Para emergencias contáctanos de inmediato:\n📞 956 662 849\n\nHaremos todo lo posible por atenderte a la brevedad. 💙'
  }
];

function addMsg(text, type) {
  const msg = document.createElement('div');
  msg.className = `chat-msg ${type}`;
  if (type === 'bot') {
    msg.innerHTML = `<div class="chat-msg-icon">🐾</div><div class="chat-msg-bubble">${text}</div>`;
  } else {
    msg.innerHTML = `<div class="chat-msg-bubble">${text}</div>`;
  }
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showMainReplies() {
  chatReplies.innerHTML = '';
  faqs.forEach((faq, i) => {
    const btn = document.createElement('button');
    btn.className = 'chat-qr-btn';
    btn.textContent = faq.q;
    btn.addEventListener('click', () => {
      addMsg(faq.q, 'user');
      chatReplies.innerHTML = '';
      setTimeout(() => {
        addMsg(faq.a, 'bot');
        setTimeout(showBackBtn, 400);
      }, 300);
    });
    chatReplies.appendChild(btn);
  });
}

function showBackBtn() {
  chatReplies.innerHTML = '';
  const back = document.createElement('button');
  back.className = 'chat-qr-btn chat-qr-back';
  back.textContent = '← Ver todas las preguntas';
  back.addEventListener('click', showMainReplies);
  chatReplies.appendChild(back);

  const wa = document.createElement('button');
  wa.className = 'chat-qr-btn';
  wa.style.cssText = 'background:#25d366;color:#fff;border-color:#25d366;width:100%;justify-content:center;';
  wa.innerHTML = '💬 Hablar por WhatsApp';
  wa.addEventListener('click', () => window.open('https://wa.me/51956662849', '_blank', 'noopener'));
  chatReplies.appendChild(wa);
}

function openChat() {
  chatWidget.classList.add('open');
  if (!chatMessages.children.length) {
    setTimeout(() => {
      addMsg('¡Hola! 👋 Soy el asistente de Clínica Veterinaria Alvarez.\n\n¿En qué puedo ayudarte hoy?', 'bot');
      setTimeout(showMainReplies, 400);
    }, 200);
  }
}

chatToggle.addEventListener('click', () => {
  chatWidget.classList.contains('open') ? chatWidget.classList.remove('open') : openChat();
});
chatClose.addEventListener('click', () => chatWidget.classList.remove('open'));

/* ── CHIPS MOTIVO CONSULTA ───────────────────────── */
const chips   = document.querySelectorAll('.motivo-chip');
const msgArea = document.getElementById('f-msg');

if (chips.length && msgArea) {
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      const selected = [...chips]
        .filter(c => c.classList.contains('active'))
        .map(c => c.dataset.value)
        .join(', ');
      msgArea.value = selected;
      msgArea.focus();
    });
  });

  msgArea.addEventListener('input', () => {
    const manual = msgArea.value;
    chips.forEach(chip => {
      chip.classList.toggle('active', manual.includes(chip.dataset.value));
    });
  });
}

/* ── CAMPOS EXTRA MASCOTA ────────────────────────── */
const petInput           = document.getElementById('f-pet');
const petExtra           = document.getElementById('petExtra');
const typeSelect         = document.getElementById('f-type');
const petNonExoticFields = document.getElementById('petNonExoticFields');
const exoticTypeGroup    = document.getElementById('exoticTypeGroup');

function updatePetExtra() {
  const hasName   = petInput.value.trim().length > 0;
  const isExotica = typeSelect.value === 'exotica';
  petExtra.classList.toggle('visible', hasName);
  if (petNonExoticFields) petNonExoticFields.style.display = isExotica ? 'none' : '';
  if (exoticTypeGroup)    exoticTypeGroup.style.display    = isExotica ? ''     : 'none';
}

if (petInput && petExtra && typeSelect) {
  petInput.addEventListener('input', updatePetExtra);
  typeSelect.addEventListener('change', updatePetExtra);
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
