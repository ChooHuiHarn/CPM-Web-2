document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero-section');
  const heroRect = hero.getBoundingClientRect();
  const heroCenterX = heroRect.left + heroRect.width / 2;
  const heroCenterY = heroRect.top + heroRect.height / 2;

  const title = hero.querySelector('.hero-title');
  const decorations = [...hero.querySelectorAll('.decorations img')];

  title.animate(
    [
      { transform: 'scale(0.2)', opacity: '0' },
      { transform: 'scale(1)',   opacity: '1' }
    ],
    { duration: 600, delay: 100, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fill: 'both' }
  );

  decorations.forEach((el, i) => {
    const r  = el.getBoundingClientRect();
    const dx = heroCenterX - (r.left + r.width  / 2);
    const dy = heroCenterY - (r.top  + r.height / 2);

    el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(0.15)`, opacity: '0' },
        { transform: 'translate(0px, 0px) scale(1)',             opacity: '1' }
      ],
      { duration: 700, delay: 150 + i * 60, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fill: 'both' }
    );
  });

  const totalAnimMs = 150 + (decorations.length - 1) * 60 + 700 + 200;
  setTimeout(activateHover, totalAnimMs);

  function activateHover() {
    decorations.forEach(el => {
      el.getAnimations().forEach(a => a.cancel());
    });

    void hero.offsetHeight;

    const centers = decorations.map(el => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });

    decorations.forEach(el => {
      el.style.transition = 'transform 0.35s ease-out';
    });

    const RADIUS    = 150; 
    const MAX_SHIFT = 20;  

    hero.addEventListener('mousemove', e => {
      decorations.forEach((el, i) => {
        const dx   = e.clientX - centers[i].x;
        const dy   = e.clientY - centers[i].y;
        const dist = Math.hypot(dx, dy);

        if (dist < RADIUS && dist > 0) {
          const s = (1 - dist / RADIUS) * MAX_SHIFT / dist;
          el.style.transform = `translate(${dx * s}px, ${dy * s}px)`;
        } else {
          el.style.transform = '';
        }
      });
    });

    hero.addEventListener('mouseleave', () => {
      decorations.forEach(el => { el.style.transform = ''; });
    });
  }
});
