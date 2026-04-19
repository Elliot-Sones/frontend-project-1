const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Reveal on scroll */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* Compare arrow draw */
const compareEl = document.getElementById('compare');
if (compareEl) {
  const compareObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        compareObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  compareObserver.observe(compareEl);
}

/* ============================================================
   NAV BACKGROUND ON SCROLL
   ============================================================ */
const navEl = document.querySelector('nav');
window.addEventListener('scroll', () => {
  navEl.style.background = window.scrollY > 80 ? 'rgba(236,229,213,0.96)' : 'rgba(236,229,213,0.85)';
}, { passive: true });

/* ============================================================
   §02 STACK V2 : scroll-progress driver
   ============================================================ */
(() => {
  const scrollEl = document.getElementById('stackScroll');
  const items = [...document.querySelectorAll('.stack-v2-item')];
  const mocks = [...document.querySelectorAll('.mock-card')];
  if (!scrollEl || !items.length || !mocks.length) return;

  const TOTAL = items.length;
  let lastIdx = -1;
  let clickLock = false;

  function setActive(idx) {
    if (idx === lastIdx) return;
    items.forEach((el, i) => el.classList.toggle('active', i === idx));
    mocks.forEach((el, i) => el.classList.toggle('active', i === idx));
    lastIdx = idx;
  }

  const isDesktop = () => window.innerWidth >= 1024 && !prefersReducedMotion;

  // Click handlers: just swap the active mock, no scrolling
  items.forEach((el, i) => {
    el.addEventListener('click', () => {
      setActive(i);
      // Lock out the scroll handler so it doesn't override the click
      clickLock = true;
      setTimeout(() => { clickLock = false; }, 1500);
    });
  });

  // Desktop: also drive active state from scroll progress
  if (isDesktop()) {
    let ticking = false;
    function update() {
      if (clickLock) { ticking = false; return; }
      const rect = scrollEl.getBoundingClientRect();
      const scrollTop = -rect.top;
      const scrollHeight = scrollEl.offsetHeight - window.innerHeight;
      if (scrollHeight <= 0) { setActive(0); ticking = false; return; }
      const progress = Math.max(0, Math.min(0.9999, scrollTop / scrollHeight));
      setActive(Math.floor(progress * TOTAL));
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  } else {
    setActive(0);
  }
})();
