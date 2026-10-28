/**
 * Dezente Einblend-Animation: Elemente mit dem Attribut `data-reveal`
 * werden beim Hineinscrollen sanft eingeblendet (siehe global.css).
 * Respektiert "Bewegung reduzieren" in den Systemeinstellungen.
 */
const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  items.forEach((el) => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  items.forEach((el) => io.observe(el));
}
