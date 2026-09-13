document.addEventListener('DOMContentLoaded', () => {

    /* 1. SCROLL SLIDING REVEAL (INTERSECTION OBSERVER) */
    const slideElements = document.querySelectorAll('.slide-on-scroll');

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    slideElements.forEach(el => observer.observe(el));

    /* 2. CONTACT HERO AUTO-SLIDER */
    const track = document.getElementById('contactHeroTrack');
    const slides = document.querySelectorAll('.contact-hero .hero-slide');
    const dots = document.querySelectorAll('.contact-hero .dot');
    let currentIndex = 0;

    function goToSlide(index) {
        currentIndex = (index + slides.length) % slides.length;
        if (track) {
            track.style.transform = `translate3d(-${currentIndex * 100}%, 0, 0)`;
        }
        dots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === currentIndex);
        });
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => goToSlide(i));
    });

    setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 5500);

    /* 3. CONTACT FORM VALIDATION */
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            let isValid = true;

            const firstName = document.getElementById('firstName');
            const lastName = document.getElementById('lastName');
            const phone = document.getElementById('phone');
            const email = document.getElementById('email');
            const message = document.getElementById('message');

            const firstNameError = document.getElementById('firstNameError');
            const lastNameError = document.getElementById('lastNameError');
            const phoneError = document.getElementById('phoneError');
            const emailError = document.getElementById('emailError');
            const messageError = document.getElementById('messageError');

            // Reset errors
            [firstNameError, lastNameError, phoneError, emailError, messageError].forEach(el => el.textContent = '');

            // First Name validation
            if (firstName.value.trim() === '') {
                firstNameError.textContent = 'First name is required';
                isValid = false;
            }

            // Last Name validation
            if (lastName.value.trim() === '') {
                lastNameError.textContent = 'Last name is required';
                isValid = false;
            }

            // Phone validation (10 digits)
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phone.value.replace(/[^0-9]/g, ''))) {
                phoneError.textContent = 'Please enter a valid 10-digit phone number';
                isValid = false;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                emailError.textContent = 'Please enter a valid email address';
                isValid = false;
            }

            // Message validation
            if (message.value.trim().length < 10) {
                messageError.textContent = 'Message must be at least 10 characters';
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
            }
        });
    }

    /* 4. MOBILE NAVIGATION TOGGLE */
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('nav-open');
        });
    }

    /* 5. SCROLL TO TOP BUTTON */
    const scrollUp = document.getElementById('scrollUp');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollUp.classList.add('is-visible');
        } else {
            scrollUp.classList.remove('is-visible');
        }
    });

    if (scrollUp) {
        scrollUp.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});