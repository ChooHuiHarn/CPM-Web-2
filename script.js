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
  const decorations = hero.querySelectorAll('.decorations img');
  decorations.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    const elCenterX = rect.left + rect.width / 2;
    const elCenterY = rect.top + rect.height / 2;
    const dx = heroCenterX - elCenterX;
    const dy = heroCenterY - elCenterY;

    el.style.setProperty('--dx', `${dx}px`);
    el.style.setProperty('--dy', `${dy}px`);
    el.style.opacity = '0';
    el.style.animation = `popFromCenter 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.15 + i * 0.06}s both`;
  });
});
