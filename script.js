// ===== DROPDOWN MENU =====
document.querySelectorAll('.has-dropdown').forEach(item => {
    item.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = this.classList.contains('open');
      function toggleMenu() {
        const navLinks = document.querySelector(".nav-links");
        const hamburger = document.querySelector(".hamburger");
      
        navLinks.classList.toggle("active");
        hamburger.classList.toggle("active");
      }
      
      // Ferme tous les dropdowns
      document.querySelectorAll('.has-dropdown').forEach(d => d.classList.remove('open'));
      // Ouvre celui cliqué si était fermé
      if (!isOpen) this.classList.add('open');
    });
  });
  
  // Ferme dropdown en cliquant ailleurs
  document.addEventListener('click', () => {
    document.querySelectorAll('.has-dropdown').forEach(d => d.classList.remove('open'));
  });
  
  // ===== SCROLL ANIMATIONS =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
  
  // ===== COUNTER ANIMATION =====
  function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = +el.dataset.count;
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current);
        if (current >= target) clearInterval(timer);
      }, 20);
    });
}
  const statsObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { animateCounters(); statsObs.disconnect(); }
  }, { threshold: 0.3 });
  const statsGrid = document.querySelector('.stats-grid');
  if (statsGrid) statsObs.observe(statsGrid);
  
  // ===== ACCORDION =====
  function toggleAcc(header) {
    const body = header.nextElementSibling;
    const isOpen = body.classList.contains('open');
    document.querySelectorAll('.acc-body').forEach(b => b.classList.remove('open'));
    document.querySelectorAll('.acc-header').forEach(h => {
      h.classList.remove('active');
      h.querySelector('.icon i').className = 'fas fa-arrow-right';
    });
    if (!isOpen) {
      body.classList.add('open');
      header.classList.add('active');
      header.querySelector('.icon i').className = 'fas fa-plus';
    }
  }
  
  // ===== DONATE PILLS =====
  function selectAmount(pill, val) {
    document.querySelectorAll('.amount-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    const input = document.getElementById('donateAmt');
    if (input) input.value = val;
  }
  
  // ===== NAV SHADOW =====
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (nav) nav.style.boxShadow = window.scrollY > 50 ? '0 4px 30px rgba(0,0,0,0.3)' : 'none';
  });
  