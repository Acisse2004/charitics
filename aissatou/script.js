/* ============================================
   CHARITICS – script.js
   ============================================ */

/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.style.background = window.scrollY > 60 ? '#07101e' : '#0f1523';
  const btn = document.getElementById('backTop');
  if (btn) btn.classList.toggle('show', window.scrollY > 400);
});

/* ── BACK TO TOP ── */
const backTop = document.getElementById('backTop');
if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── MOBILE HAMBURGER ── */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => navMenu.classList.toggle('open'));
}

/* ── ACCORDION ── */
document.querySelectorAll('.acc-header').forEach(header => {
  header.addEventListener('click', () => {
    const item   = header.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.acc-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ── AMOUNT BUTTONS ── */
document.querySelectorAll('.amt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.amt-btn').forEach(b => {
      b.classList.remove('active');
      b.style.background = 'rgba(255,255,255,0.15)';
      b.style.color = '#fff';
    });
    btn.classList.add('active');
    btn.style.background = '#F15A2B';
    btn.style.color = '#fff';
    const input = document.getElementById('customAmt');
    if (input) input.value = btn.dataset.v;
  });
});

/* ── COUNTER ANIMATION ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  let current = 0;
  const step  = Math.max(1, Math.ceil(target / 80));
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + '+';
    if (current >= target) clearInterval(timer);
  }, 20);
}

const counterSection = document.querySelector('.counters');
if (counterSection) {
  let fired = false;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !fired) {
      fired = true;
      document.querySelectorAll('.counter-num').forEach(animateCounter);
    }
  }, { threshold: 0.4 });
  obs.observe(counterSection);
}

/* ── FADE-IN ON SCROLL ── */
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

/* ══════════════════════════════════════════
   DONATIONS SLIDER
══════════════════════════════════════════ */
(function initSlider() {
  const track    = document.getElementById('sliderTrack');
  const btnPrev  = document.getElementById('slidePrev');
  const btnNext  = document.getElementById('slideNext');
  if (!track || !btnPrev || !btnNext) return;

  let index = 0;

  function visibleCount() {
    if (window.innerWidth <= 768)  return 1;
    if (window.innerWidth <= 1100) return 2;
    return 3;
  }

  function cardStep() {
    const card = track.querySelector('.dcard');
    if (!card) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 25;
    return card.offsetWidth + gap;
  }

  function maxIndex() {
    const total = track.querySelectorAll('.dcard').length;
    return Math.max(0, total - visibleCount());
  }

  function goTo(i) {
    track.style.transition = 'transform .42s cubic-bezier(.4,0,.2,1)';
    index = i;
    track.style.transform = `translateX(-${index * cardStep()}px)`;
  }

  btnPrev.addEventListener('click', () => goTo(index - 1));
  btnNext.addEventListener('click', () => goTo(index + 1));

  let tx = 0;
  track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = tx - e.changedTouches[0].clientX;
    if (diff > 50)  goTo(index + 1);
    if (diff < -50) goTo(index - 1);
  });

  let dragging = false, mx = 0;
  track.addEventListener('mousedown',  e => { dragging = true; mx = e.clientX; track.style.cursor = 'grabbing'; });
  window.addEventListener('mouseup',   e => {
    if (!dragging) return;
    dragging = false; track.style.cursor = '';
    const diff = mx - e.clientX;
    if (diff > 50)  goTo(index + 1);
    if (diff < -50) goTo(index - 1);
  });

  window.addEventListener('resize', () => goTo(0));

  /* Cloner les cartes pour boucle infinie */
  const origDcards = Array.from(track.querySelectorAll('.dcard'));
  origDcards.forEach(card => {
    const c = card.cloneNode(true);
    c.setAttribute('aria-hidden', 'true');
    track.appendChild(c);
  });
  const totalDcards = origDcards.length;

  /* Reset silencieux quand on depasse les originaux */
  track.addEventListener('transitionend', () => {
    if (index >= totalDcards) {
      track.style.transition = 'none';
      index = 0;
      track.style.transform = 'translateX(0)';
      setTimeout(() => { track.style.transition = 'transform .42s cubic-bezier(.4,0,.2,1)'; }, 20);
    }
  });

  function nextAuto() { goTo(index + 1); }
  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(nextAuto, 2000);
  }
  let autoTimer = setInterval(nextAuto, 2000);
  btnPrev.addEventListener('click', resetAuto);
  btnNext.addEventListener('click', resetAuto);
  track.addEventListener('touchend', resetAuto);
  document.querySelector('.slider-viewport').addEventListener('mouseenter', () => clearInterval(autoTimer));
  document.querySelector('.slider-viewport').addEventListener('mouseleave', () => resetAuto());
})();

/* ══════════════════════════════════════════
   TESTIMONIALS – boucle infinie, avance carte par carte toutes les 3s
══════════════════════════════════════════ */
(function initTestiSlider() {
  const track = document.getElementById('testiTrack');
  if (!track) return;

  /* Récupère les originaux */
  const originals = Array.from(track.querySelectorAll('.testicard:not([aria-hidden])'));
  const total = originals.length;

  /* Clone les cartes à la fin pour la boucle infinie */
  originals.forEach(card => {
    const c = card.cloneNode(true);
    c.setAttribute('aria-hidden', 'true');
    track.appendChild(c);
  });

  let index = 0;

  function cardStep() {
    const card = track.querySelector('.testicard');
    const gap  = parseFloat(getComputedStyle(track).gap) || 25;
    return card.offsetWidth + gap;
  }

  function goTo(i, animate) {
    if (animate === false) {
      track.style.transition = 'none';
    } else {
      track.style.transition = 'transform .7s cubic-bezier(.4,0,.2,1)';
    }
    index = i;
    track.style.transform = `translateX(-${index * cardStep()}px)`;
  }

  /* Quand on arrive sur les clones → reset silencieux au début */
  track.addEventListener('transitionend', () => {
    if (index >= total) goTo(0, false);
  });

  /* Avance d'une carte toutes les 3 secondes */
  setInterval(() => goTo(index + 1), 2000);

})();

/* ══════════════════════════════════════════
   GALLERY STRIP – slider infini toutes les 3s
══════════════════════════════════════════ */
(function initGallerySlider() {
  const track = document.getElementById('galleryTrack');
  if (!track) return;

  const originals = Array.from(track.querySelectorAll('img'));
  const total = originals.length;

  /* Clone les images pour boucle infinie */
  originals.forEach(img => {
    const c = img.cloneNode(true);
    c.setAttribute('aria-hidden', 'true');
    track.appendChild(c);
  });

  let index = 0;

  function imgStep() {
    const img = track.querySelector('img');
    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    return img.offsetWidth + gap;
  }

  function goTo(i, animate) {
    if (animate === false) {
      track.style.transition = 'none';
    } else {
      track.style.transition = 'transform .7s cubic-bezier(.4,0,.2,1)';
    }
    index = i;
    track.style.transform = `translateX(-${index * imgStep()}px)`;
  }

  /* Reset silencieux quand on depasse les originaux */
  track.addEventListener('transitionend', () => {
    if (index >= total) goTo(0, false);
  });

  /* Avance toutes les 3 secondes */
  setInterval(() => goTo(index + 1), 2000);

})();

/* ══════════════════════════════════════════
   BLOG SLIDER – boucle infinie toutes les 2s
══════════════════════════════════════════ */
(function initBlogSlider() {
  const track   = document.getElementById('blogTrack');
  const btnPrev = document.getElementById('blogPrev');
  const btnNext = document.getElementById('blogNext');
  if (!track) return;

  const originals = Array.from(track.querySelectorAll('.bcard'));
  const total = originals.length;

  /* Clone pour boucle infinie */
  originals.forEach(c => {
    const cl = c.cloneNode(true);
    cl.setAttribute('aria-hidden','true');
    track.appendChild(cl);
  });

  let index = 0;

  function cardStep() {
    const card = track.querySelector('.bcard');
    const gap  = parseFloat(getComputedStyle(track).gap) || 20;
    return card.offsetWidth + gap;
  }

  function goTo(i, animate) {
    track.style.transition = animate === false ? 'none' : 'transform .6s cubic-bezier(.4,0,.2,1)';
    index = i;
    track.style.transform = `translateX(-${index * cardStep()}px)`;
  }

  track.addEventListener('transitionend', () => {
    if (index >= total) goTo(0, false);
    if (index < 0)      goTo(total - 1, false);
  });

  if (btnNext) btnNext.addEventListener('click', () => { clearInterval(timer); goTo(index + 1); resetTimer(); });
  if (btnPrev) btnPrev.addEventListener('click', () => { clearInterval(timer); goTo(index - 1); resetTimer(); });

  function resetTimer() { timer = setInterval(() => goTo(index + 1), 2000); }
  let timer = setInterval(() => goTo(index + 1), 2000);
})();