/* ===== Ladder Resort - Main JavaScript ===== */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initGallery();
  initBookingForm();
  initScrollAnimations();
});

/* ----- Sticky Header ----- */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  function updateHeader() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

/* ----- Mobile Navigation ----- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const overlay = document.querySelector('.nav-overlay');

  if (!toggle || !navLinks) return;

  function closeNav() {
    toggle.classList.remove('active');
    navLinks.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('active');
    if (isOpen) {
      closeNav();
    } else {
      toggle.classList.add('active');
      navLinks.classList.add('active');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  if (overlay) {
    overlay.addEventListener('click', closeNav);
  }

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });
}

/* ----- Photo Gallery ----- */
function initGallery() {
  const gallery = document.querySelector('.room-gallery');
  if (!gallery) return;

  const images = gallery.querySelectorAll('img');
  const dots = gallery.querySelectorAll('.gallery-dot');
  const prevBtn = gallery.querySelector('.gallery-arrow.prev');
  const nextBtn = gallery.querySelector('.gallery-arrow.next');
  let currentIndex = 0;
  let autoplayInterval;

  function showSlide(index) {
    images.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentIndex = (index + images.length) % images.length;
    images[currentIndex].classList.add('active');
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');
  }

  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 4000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { showSlide(i); resetAutoplay(); });
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  gallery.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  gallery.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
      resetAutoplay();
    }
  }, { passive: true });

  if (images.length > 1) {
    startAutoplay();
  }
}

/* ----- Booking Form ----- */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Basic validation
    const required = ['name', 'email', 'checkin', 'checkout'];
    const missing = required.filter(field => !data[field] || data[field].trim() === '');

    const messageEl = form.querySelector('.form-message');

    if (missing.length > 0) {
      if (messageEl) {
        messageEl.textContent = 'Please fill in all required fields.';
        messageEl.className = 'form-message error';
      }
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      if (messageEl) {
        messageEl.textContent = 'Please enter a valid email address.';
        messageEl.className = 'form-message error';
      }
      return;
    }

    // Date validation
    const checkin = new Date(data.checkin);
    const checkout = new Date(data.checkout);
    if (checkout <= checkin) {
      if (messageEl) {
        messageEl.textContent = 'Check-out date must be after check-in date.';
        messageEl.className = 'form-message error';
      }
      return;
    }

    // Success
    if (messageEl) {
      messageEl.textContent = 'Thank you! Your booking request has been sent. We will contact you shortly.';
      messageEl.className = 'form-message success';
    }
    form.reset();
  });
}

/* ----- Scroll Animations ----- */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}
