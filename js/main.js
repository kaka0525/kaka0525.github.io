// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.project-card, .cs-section, .case-hero-image, .about-photo, .about-content, .fade-up, .case-hero h1, .case-hero-sub'
).forEach(el => observer.observe(el));

// Trigger hero on load
window.addEventListener('load', () => {
  document.querySelector('.hero')?.classList.add('in-view');
});

// Expandable accordions (e.g. Research Details)
document.querySelectorAll('.cs-accordion-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const acc = btn.closest('.cs-accordion');
    const open = acc.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
});

// Tabbed sections (e.g. Explorations and Iterations)
document.querySelectorAll('.cs-tabs').forEach(tabs => {
  const buttons = tabs.querySelectorAll('.cs-tab-btn');
  const panels = tabs.querySelectorAll('.cs-tab-panel');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      tabs.querySelector('#' + btn.dataset.tab)?.classList.add('active');
    });
  });
});

// Image carousels
document.querySelectorAll('.cs-carousel').forEach(carousel => {
  const track = carousel.querySelector('.cs-carousel-track');
  const slides = carousel.querySelectorAll('.cs-carousel-slide');
  const dotsWrap = carousel.querySelector('.cs-carousel-dots');
  let index = 0;

  const dots = [];
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap?.appendChild(dot);
    dots.push(dot);
  });

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + index * 100 + '%)';
    dots.forEach((d, di) => d.classList.toggle('active', di === index));
  }

  carousel.querySelector('.cs-carousel-prev')?.addEventListener('click', () => goTo(index - 1));
  carousel.querySelector('.cs-carousel-next')?.addEventListener('click', () => goTo(index + 1));
});

// Nav border on scroll
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });
