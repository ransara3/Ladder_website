/* =================================================================
   LADDER RESORT – Main JavaScript
   ================================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------------------------
     1. Sticky Navigation / Scroll Behaviour
  --------------------------------------------------------------- */
  const header = document.getElementById('site-header');

  if (header) {
    function handleScroll() {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initialise on load
  }

  /* ---------------------------------------------------------------
     2. Mobile Navigation Toggle
  --------------------------------------------------------------- */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu   = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      // Prevent body scrolling when menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (navMenu.classList.contains('open') &&
          !navMenu.contains(e.target) &&
          !navToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        navToggle.focus();
      }
    });
  }

  /* ---------------------------------------------------------------
     3. Active Navigation Link Highlighting (Intersection Observer)
  --------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { threshold: 0.4, rootMargin: '-60px 0px -40% 0px' }
  );

  sections.forEach(function (section) { sectionObserver.observe(section); });

  /* ---------------------------------------------------------------
     4. Testimonials Carousel
  --------------------------------------------------------------- */
  const track     = document.getElementById('testimonial-track');
  const dotsWrap  = document.getElementById('carousel-dots');
  const prevBtn   = document.getElementById('carousel-prev');
  const nextBtn   = document.getElementById('carousel-next');

  if (track && dotsWrap && prevBtn && nextBtn) {
    const cards = track.querySelectorAll('.testimonial-card');
    let current  = 0;
    let autoTimer;

    // Create dots
    cards.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Testimonial ' + (i + 1));
      dot.setAttribute('aria-selected', String(i === 0));
      dot.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(dot);
    });

    function goTo(index) {
      current = (index + cards.length) % cards.length;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dotsWrap.querySelectorAll('.carousel-dot').forEach(function (d, i) {
        d.classList.toggle('active', i === current);
        d.setAttribute('aria-selected', String(i === current));
      });
    }

    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(function () { goTo(current + 1); }, 5000);
    }

    prevBtn.addEventListener('click', function () { goTo(current - 1); startAuto(); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); startAuto(); });

    // Keyboard navigation
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { goTo(current - 1); startAuto(); }
      if (e.key === 'ArrowRight') { goTo(current + 1); startAuto(); }
    });

    // Touch/swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 50) {
        goTo(delta < 0 ? current + 1 : current - 1);
        startAuto();
      }
    }, { passive: true });

    startAuto();

    // Pause auto-play when user hovers
    track.parentElement.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
    track.parentElement.addEventListener('mouseleave', startAuto);
  }

  /* ---------------------------------------------------------------
     5. Booking Form Validation & Submission
  --------------------------------------------------------------- */
  const bookingForm   = document.getElementById('booking-form');
  const formSuccess   = document.getElementById('form-success');
  const submitBtn     = document.getElementById('booking-submit');

  if (bookingForm) {
    // Set minimum date to today for date inputs
    const today = new Date().toISOString().split('T')[0];
    const checkinInput  = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');

    if (checkinInput && checkoutInput) {
      checkinInput.setAttribute('min', today);
      checkoutInput.setAttribute('min', today);

      // Ensure checkout is always after check-in
      checkinInput.addEventListener('change', function () {
        const minCheckout = checkinInput.value || today;
        if (checkoutInput.value && checkoutInput.value <= checkinInput.value) {
          checkoutInput.value = '';
        }
        checkoutInput.setAttribute('min', minCheckout);
      });
    }

    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      // Clear previous errors
      bookingForm.querySelectorAll('.error').forEach(function (el) {
        el.classList.remove('error');
      });

      // Validate required fields
      bookingForm.querySelectorAll('[required]').forEach(function (field) {
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });

      // Email format check
      const emailField = document.getElementById('email');
      if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        emailField.classList.add('error');
        valid = false;
      }

      if (!valid) {
        const firstError = bookingForm.querySelector('.error');
        if (firstError) { firstError.focus(); }
        return;
      }

      // Simulate form submission
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled    = true;

      setTimeout(function () {
        formSuccess.removeAttribute('hidden');
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        bookingForm.reset();
        submitBtn.textContent = 'Request Booking';
        submitBtn.disabled    = false;

        // Hide success message after 8 seconds
        setTimeout(function () {
          formSuccess.setAttribute('hidden', '');
        }, 8000);
      }, 1200);
    });
  }

  /* ---------------------------------------------------------------
     6. Newsletter Form
  --------------------------------------------------------------- */
  const newsletterForm    = document.getElementById('newsletter-form');
  const newsletterSuccess = document.getElementById('newsletter-success');

  if (newsletterForm && newsletterSuccess) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      if (!emailInput || !emailInput.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
        if (emailInput) { emailInput.focus(); }
        return;
      }
      newsletterForm.reset();
      newsletterSuccess.removeAttribute('hidden');
      setTimeout(function () {
        newsletterSuccess.setAttribute('hidden', '');
      }, 6000);
    });
  }

  /* ---------------------------------------------------------------
     7. Back-to-Top Button
  --------------------------------------------------------------- */
  const backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 600) {
        backToTop.removeAttribute('hidden');
      } else {
        backToTop.setAttribute('hidden', '');
      }
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------------------
     8. Footer Year
  --------------------------------------------------------------- */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  /* ---------------------------------------------------------------
     9. Scroll-Reveal Animation (lightweight, no library)
  --------------------------------------------------------------- */
  const revealElements = document.querySelectorAll(
    '.room-card, .amenity-card, .gallery-item, .contact-item, .about-content, .about-image-wrap'
  );

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  // Add initial CSS for reveal animation
  const revealStyle = document.createElement('style');
  revealStyle.textContent =
    '.room-card, .amenity-card, .gallery-item, .contact-item, .about-content, .about-image-wrap {' +
    '  opacity: 0; transform: translateY(24px);' +
    '  transition: opacity 0.6s ease, transform 0.6s ease;' +
    '}' +
    '.revealed {' +
    '  opacity: 1 !important; transform: translateY(0) !important;' +
    '}';
  document.head.appendChild(revealStyle);

  // Stagger siblings
  [
    document.querySelectorAll('.rooms-grid .room-card'),
    document.querySelectorAll('.amenities-grid .amenity-card'),
    document.querySelectorAll('.gallery-grid .gallery-item'),
  ].forEach(function (group) {
    group.forEach(function (el, i) {
      el.style.transitionDelay = (i * 0.1) + 's';
    });
  });

  revealElements.forEach(function (el) { revealObserver.observe(el); });

  /* ---------------------------------------------------------------
     10. Gallery keyboard accessibility (Enter/Space to "open")
  --------------------------------------------------------------- */
  document.querySelectorAll('.gallery-item').forEach(function (item) {
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    });
    // Simple focus-triggered highlight already handled via CSS :focus
  });

})();
