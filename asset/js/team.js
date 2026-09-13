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

    /* 2. TEAM HERO SLIDER */
    const track = document.getElementById('teamHeroTrack');
    const slides = document.querySelectorAll('.team-hero .hero-slide');
    const dots = document.querySelectorAll('.team-hero .dot');
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
    }, 5000);

    /* 3. MOBILE MENU TOGGLE */
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('nav-open');
        });
    }

    /* 4. SCROLL TO TOP */
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