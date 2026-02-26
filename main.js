'use strict';
/* ═══════════════════════════════════════════════
   CHARITICS — main.js
═══════════════════════════════════════════════ */

/* ── 1. NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });


/* ── 2. HAMBURGER + SOUS-MENUS ACCORDÉON ── */
const hamBtn      = document.getElementById('hamBtn');
const mobileMenu  = document.getElementById('mobile-menu');

// Ouvrir / fermer le menu global
hamBtn.addEventListener('click', () => {
  const isOpen = hamBtn.classList.toggle('is-open');
  hamBtn.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.classList.toggle('is-open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Sous-menus accordéon (.mob-parent)
mobileMenu.querySelectorAll('.mob-parent').forEach(parent => {
  parent.addEventListener('click', () => {
    const sub = parent.nextElementSibling;
    if (!sub || !sub.classList.contains('mob-sub')) return;

    const isOpen = parent.classList.toggle('is-open');
    sub.classList.toggle('is-open', isOpen);

    // Fermer les autres sous-menus
    mobileMenu.querySelectorAll('.mob-parent').forEach(other => {
      if (other !== parent) {
        other.classList.remove('is-open');
        const otherSub = other.nextElementSibling;
        if (otherSub) otherSub.classList.remove('is-open');
      }
    });
  });
});

// Fermer le menu quand on clique un lien (liens simples ou sous-liens)
mobileMenu.querySelectorAll('.mob-link, .mob-sub a').forEach(link => {
  link.addEventListener('click', () => {
    hamBtn.classList.remove('is-open');
    hamBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
    // Fermer tous les sous-menus
    mobileMenu.querySelectorAll('.mob-parent').forEach(p => {
      p.classList.remove('is-open');
      const s = p.nextElementSibling;
      if (s) s.classList.remove('is-open');
    });
  });
});


/* ── 3. SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ── 4. SLIDER FACTORY ── */
function createSlider({ trackId, dotsId, prevId, nextId, getPerPage, intervalMs }) {
  const track = document.getElementById(trackId);
  if (!track) return;

  const dotsContainer = dotsId ? document.getElementById(dotsId) : null;
  const prevBtn = prevId ? document.getElementById(prevId) : null;
  const nextBtn = nextId ? document.getElementById(nextId) : null;
  const cards = Array.from(track.children);
  let currentPage = 0, timer;

  function getTotalPages() {
    return Math.max(1, Math.ceil(cards.length / getPerPage()));
  }

  function goToPage(index) {
    const total = getTotalPages();
    currentPage = ((index % total) + total) % total;
    const gap = 22;
    const pp = getPerPage();
    const vw = track.parentElement.clientWidth;
    const cardW = (vw - gap * (pp - 1)) / pp;
    track.style.transform = `translateX(-${currentPage * pp * (cardW + gap)}px)`;
    if (dotsContainer) {
      dotsContainer.querySelectorAll('.dot').forEach((d, i) =>
        d.classList.toggle('active', i === currentPage));
    }
  }

  if (dotsContainer) {
    dotsContainer.querySelectorAll('.dot').forEach((d, i) =>
      d.addEventListener('click', () => { goToPage(i); resetTimer(); }));
  }
  if (prevBtn) prevBtn.addEventListener('click', () => { goToPage(currentPage - 1); resetTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goToPage(currentPage + 1); resetTimer(); });

  track.parentElement.addEventListener('mouseenter', () => clearInterval(timer));
  track.parentElement.addEventListener('mouseleave', startTimer);
  window.addEventListener('resize', () => goToPage(0), { passive: true });

  function startTimer() { timer = setInterval(() => goToPage(currentPage + 1), intervalMs); }
  function resetTimer() { clearInterval(timer); startTimer(); }
  startTimer();
}

createSlider({
  trackId:'donTrack', dotsId:'donDots', prevId:'donPrev', nextId:'donNext',
  getPerPage: () => window.innerWidth < 580 ? 1 : window.innerWidth < 860 ? 2 : 4,
  intervalMs: 4500
});
createSlider({
  trackId:'testiTrack', dotsId:'testiDots', prevId:null, nextId:null,
  getPerPage: () => window.innerWidth < 580 ? 1 : window.innerWidth < 860 ? 2 : 4,
  intervalMs: 5000
});
createSlider({
  trackId:'blogTrack', dotsId:null, prevId:'blogPrev', nextId:'blogNext',
  getPerPage: () => window.innerWidth < 580 ? 1 : window.innerWidth < 860 ? 2 : 3,
  intervalMs: 6000
});


/* ── 5. AMOUNT PILLS ── */
const pills = Array.from(document.querySelectorAll('.amount-pill'));
const customAmt = document.getElementById('customAmt');

pills.forEach(pill => {
  pill.addEventListener('click', () => {
    pills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    if (customAmt) customAmt.value = pill.dataset.val;
  });
});
if (customAmt) {
  customAmt.addEventListener('input', () =>
    pills.forEach(p => p.classList.remove('active')));
}


/* ── 6. COUNTER ANIMATION ── */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting || entry.target._animated) return;
    entry.target._animated = true;
    const el = entry.target;
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const startTime = performance.now();
    function step(now) {
      const p = Math.min((now - startTime) / duration, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target) + '+';
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + '+';
    }
    requestAnimationFrame(step);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el =>
  counterObserver.observe(el));


/* ── 7. ACCORDION (section volunteer) ── */
function toggleAcc(header) {
  const item = header.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.acc-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}
