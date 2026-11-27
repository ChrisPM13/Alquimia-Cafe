const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

const menuImageTrigger = document.querySelector('.menu-image-trigger');
const menuLightbox = document.querySelector('.menu-lightbox');
const menuLightboxClose = document.querySelector('.menu-lightbox-close');

if (menuImageTrigger && menuLightbox && menuLightboxClose) {
  menuImageTrigger.addEventListener('click', () => menuLightbox.showModal());
  menuLightboxClose.addEventListener('click', () => menuLightbox.close());
  menuLightbox.addEventListener('click', (event) => {
    if (event.target === menuLightbox) menuLightbox.close();
  });
}

const specialDrinkCards = document.querySelectorAll('.special-drink-card');
specialDrinkCards.forEach((card) => {
  card.addEventListener('click', () => {
    specialDrinkCards.forEach((drinkCard) => {
      const active = drinkCard === card;
      drinkCard.classList.toggle('is-active', active);
      drinkCard.setAttribute('aria-expanded', String(active));
    });
  });
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const carousel = document.querySelector('[data-carousel]');

if (carousel) {
  const slides = [...carousel.querySelectorAll('.hero-drink')];
  const dots = [...carousel.querySelectorAll('.carousel-dot')];
  const counter = document.querySelector('.slide-count');
  let currentSlide = 0;
  let autoplayTimer;
  let touchStart = null;

  const showSlide = (index, direction = 1, animate = true) => {
    const previousSlide = currentSlide;
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.remove('is-active', 'is-next', 'is-leaving', 'is-leaving-right');
      const active = slideIndex === currentSlide;
      if (active) slide.classList.add('is-active');
      slide.setAttribute('aria-hidden', String(!active));
    });

    if (animate && previousSlide !== currentSlide) {
      const leavingSlide = slides[previousSlide];
      const leavingClass = direction > 0 ? 'is-leaving' : 'is-leaving-right';
      leavingSlide.classList.add(leavingClass);
      window.setTimeout(() => leavingSlide.classList.remove(leavingClass), 750);
    }

    const previewOffset = direction > 0 ? 1 : -1;
    const previewIndex = (currentSlide + previewOffset + slides.length) % slides.length;
    slides[previewIndex].classList.add('is-next');

    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === currentSlide;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-pressed', String(active));
    });

    if (counter) {
      counter.textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    }
  };

  const startAutoplay = () => {
    window.clearInterval(autoplayTimer);
    autoplayTimer = window.setInterval(() => showSlide(currentSlide + 1), 5000);
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index, index >= currentSlide ? 1 : -1);
      startAutoplay();
    });
  });

  carousel.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch') {
      touchStart = { x: event.clientX, y: event.clientY };
    }
  });

  carousel.addEventListener('pointerup', (event) => {
    if (!touchStart) return;

    const deltaX = event.clientX - touchStart.x;
    const deltaY = event.clientY - touchStart.y;
    touchStart = null;

    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      const direction = deltaX < 0 ? 1 : -1;
      showSlide(currentSlide + direction, direction);
      startAutoplay();
    }
  });

  carousel.addEventListener('pointercancel', () => {
    touchStart = null;
  });

  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      showSlide(currentSlide - 1, -1);
      startAutoplay();
    } else if (event.key === 'ArrowRight') {
      showSlide(currentSlide + 1, 1);
      startAutoplay();
    }
  });

  showSlide(0, 1, false);
  startAutoplay();
}

