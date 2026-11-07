/* SGS Ultimate Upgrade — seven room navigation and accessible transitions */
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = document.getElementById("mainNav");
  const menu = document.getElementById("menuToggle");

  // Smoothly close the mobile menu after a room is selected.
  document.querySelectorAll('.journey-card, #mainNav a').forEach(link => {
    link.addEventListener('click', () => {
      nav?.classList.remove('open');
      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      if (!reduce) {
        target.classList.remove('ux-room-arrive');
        requestAnimationFrame(() => target.classList.add('ux-room-arrive'));
      }
    });
  });

  // Mark the current navigation destination while scrolling.
  const sections = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        nav?.querySelectorAll('a').forEach(a => {
          const active = a.getAttribute('href') === `#${entry.target.id}`;
          a.classList.toggle('is-current', active);
          if (active) a.setAttribute('aria-current', 'page');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-25% 0px -60% 0px' });
    sections.forEach(section => observer.observe(section));
  }

  // Keep keyboard users able to tell which room card is focused.
  document.querySelectorAll('.journey-card').forEach(card => {
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') card.classList.add('is-selected');
    });
    card.addEventListener('blur', () => card.classList.remove('is-selected'));
  });
})();
