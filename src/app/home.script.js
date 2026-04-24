(() => {
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Hero video: force play since autoplay can be skipped after dangerouslySetInnerHTML */
(() => {
  const heroVideo = document.querySelector('.hero-castle video');
  if (heroVideo && !prefersReducedMotion) {
    const tryPlay = () => heroVideo.play().catch(() => {});
    if (heroVideo.readyState >= 2) tryPlay();
    else heroVideo.addEventListener('loadeddata', tryPlay, { once: true });
  }
})();

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

/* ============================================================
   NAV BACKGROUND ON SCROLL
   ============================================================ */
const navEl = document.querySelector('nav');
window.addEventListener('scroll', () => {
  navEl.style.background = window.scrollY > 80 ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.85)';
}, { passive: true });

})();
