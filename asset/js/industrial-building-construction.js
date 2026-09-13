document.addEventListener('DOMContentLoaded', () => {

    /* 1. SCROLL SLIDING REVEAL ENGINE */
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

    /* 2. MOBILE MENU TOGGLE */
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('nav-open');
        });
    }

    /* 3. SCROLL TO TOP FLOATING BUTTON */
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