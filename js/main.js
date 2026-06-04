// Mark that JS-driven animations are active. The feature-block "hidden"
// state is gated behind this class so a stale/failed script can never
// leave content permanently blank — it just shows without the fade-in.
document.documentElement.classList.add('js-anim');

// Reveal-on-scroll animations (one-time)
const revealEls = document.querySelectorAll(
  '.project-card, .cs-section, .case-hero-image, .about-photo, .about-content, .fade-up, .case-hero h1, .case-hero-sub'
);

if ('IntersectionObserver' in window) {
  // Trigger the moment any part of an element enters (with a small early margin),
  // then stop observing. Using threshold 0 keeps tall sections from getting stuck hidden.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });

  revealEls.forEach(el => observer.observe(el));

  // Safety net: if anything is still hidden after a few seconds (observer
  // quirk, fast scroll, etc.), reveal it so content is never left blank.
  setTimeout(() => {
    revealEls.forEach(el => {
      if (!el.classList.contains('in-view')) {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in-view');
      }
    });
  }, 2500);
} else {
  // No IntersectionObserver support: just show everything.
  revealEls.forEach(el => el.classList.add('in-view'));
}

// Feature walkthrough blocks: ease in AND out, re-triggering each time they
// enter/leave the central band of the viewport.
const featureEls = document.querySelectorAll('.cs-feature');
if ('IntersectionObserver' in window) {
  const featureObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
    });
  }, { threshold: 0, rootMargin: '-12% 0px -12% 0px' });

  featureEls.forEach(el => featureObserver.observe(el));
} else {
  featureEls.forEach(el => el.classList.add('in-view'));
}

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

// Image carousels — seamless infinite loop.
// We clone the first and last slides onto the ends of the track. When the user
// scrolls onto a clone we let the transition finish, then silently snap to the
// matching real slide (no transition), so wrapping never visibly rewinds.
document.querySelectorAll('.cs-carousel').forEach(carousel => {
  const track = carousel.querySelector('.cs-carousel-track');
  const realSlides = Array.from(carousel.querySelectorAll('.cs-carousel-slide'));
  const dotsWrap = carousel.querySelector('.cs-carousel-dots');
  const n = realSlides.length;

  // Dots reflect the real slides only.
  const dots = [];
  realSlides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap?.appendChild(dot);
    dots.push(dot);
  });

  if (n <= 1) return; // nothing to loop

  // Clone ends. Track layout becomes: [lastClone, s0 … s(n-1), firstClone].
  const firstClone = realSlides[0].cloneNode(true);
  const lastClone = realSlides[n - 1].cloneNode(true);
  firstClone.setAttribute('aria-hidden', 'true');
  lastClone.setAttribute('aria-hidden', 'true');
  track.appendChild(firstClone);
  track.insertBefore(lastClone, realSlides[0]);

  // Position 0 = lastClone, 1..n = real slides, n+1 = firstClone.
  let pos = 1;
  let animating = false;

  function setTransform(animate) {
    if (!animate) track.style.transition = 'none';
    track.style.transform = 'translateX(-' + pos * 100 + '%)';
    if (!animate) {
      void track.offsetWidth; // force reflow so the snap is instant
      track.style.transition = '';
    }
  }

  function updateDots() {
    const ri = ((pos - 1) % n + n) % n;
    dots.forEach((d, di) => d.classList.toggle('active', di === ri));
  }

  function move(delta) {
    if (animating) return;
    animating = true;
    pos += delta;
    setTransform(true);
    updateDots();
  }

  function goTo(i) {
    if (animating) return;
    pos = i + 1;
    setTransform(true);
    updateDots();
  }

  track.addEventListener('transitionend', (e) => {
    if (e.propertyName !== 'transform') return;
    animating = false;
    if (pos === n + 1) {        // landed on first clone → snap to real first
      pos = 1;
      setTransform(false);
    } else if (pos === 0) {     // landed on last clone → snap to real last
      pos = n;
      setTransform(false);
    }
  });

  setTransform(false); // start on the real first slide (offset past last clone)
  updateDots();

  carousel.querySelector('.cs-carousel-prev')?.addEventListener('click', () => move(-1));
  carousel.querySelector('.cs-carousel-next')?.addEventListener('click', () => move(1));
});

// Make content images open full-size in a new tab so visitors can inspect
// details. Skips images already inside a link (carousels, project cards, logo).
document.querySelectorAll('main img').forEach(img => {
  if (img.closest('a')) return;
  const src = img.getAttribute('src');
  if (!src) return;
  const link = document.createElement('a');
  link.href = src;
  link.target = '_blank';
  link.rel = 'noopener';
  link.className = 'img-zoom-link';
  img.parentNode.insertBefore(link, img);
  link.appendChild(img);
});

// Nav border on scroll
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });
