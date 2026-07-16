document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero-section');
  const heroRect = hero.getBoundingClientRect();
  const heroCenterX = heroRect.left + heroRect.width / 2;
  const heroCenterY = heroRect.top + heroRect.height / 2;

  // Animate title from center
  const title = hero.querySelector('.hero-title');
  title.style.opacity = '0';
  title.style.animation = 'titlePop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both';

  // Animate each decoration outward from the hero center
  const decorations = [...hero.querySelectorAll('.decorations img')];
  decorations.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    const elCenterX = rect.left + rect.width / 2;
    const elCenterY = rect.top + rect.height / 2;
    el.style.setProperty('--dx', `${heroCenterX - elCenterX}px`);
    el.style.setProperty('--dy', `${heroCenterY - elCenterY}px`);
    el.style.opacity = '0';
    el.style.animation = `popFromCenter 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.15 + i * 0.06}s both`;
  });

  // Wait for all pop animations to finish, then enable proximity hover
  const totalAnimMs = (0.15 + (decorations.length - 1) * 0.06 + 0.7) * 1000 + 50;

  setTimeout(() => {
    // Clear animations and reset transforms
    decorations.forEach(el => {
      el.style.animation = 'none';
      el.style.transform = 'translate(0, 0)';
    });

    // Force reflow so rects reflect settled positions
    hero.getBoundingClientRect();

    // Store each image's natural center (viewport-relative)
    const naturalCenters = decorations.map(el => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });

    // Enable smooth transition for proximity movement
    decorations.forEach(el => {
      el.style.transition = 'transform 0.35s ease-out';
    });

    const RADIUS = 150;   // px — how close the cursor needs to be
    const MAX_SHIFT = 20; // px — maximum nudge distance

    hero.addEventListener('mousemove', (e) => {
      const mx = e.clientX;
      const my = e.clientY;

      decorations.forEach((el, i) => {
        const { x, y } = naturalCenters[i];
        const distX = mx - x;
        const distY = my - y;
        const dist = Math.hypot(distX, distY);

        if (dist < RADIUS) {
          const strength = 1 - dist / RADIUS;
          const tx = (distX / dist) * MAX_SHIFT * strength;
          const ty = (distY / dist) * MAX_SHIFT * strength;
          el.style.transform = `translate(${tx}px, ${ty}px)`;
        } else {
          el.style.transform = 'translate(0, 0)';
        }
      });
    });

    // Snap back when the cursor leaves the hero
    hero.addEventListener('mouseleave', () => {
      decorations.forEach(el => {
        el.style.transform = 'translate(0, 0)';
      });
    });
  }, totalAnimMs);
});
