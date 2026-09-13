document.addEventListener('DOMContentLoaded', () => {

    /* 1. INTERSECTION OBSERVER FOR CONTAINER SLIDING REVEALS */
    const slideElements = document.querySelectorAll('.slide-on-scroll');

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    slideElements.forEach(el => observer.observe(el));

    /* 2. NUMERIC COUNT-UP ENGINE */
    const counterElements = document.querySelectorAll('.counter');
    let hasAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                counterElements.forEach(counter => {
                    const target = parseInt(counter.dataset.target, 10);
                    const duration = 2000;
                    const startTime = performance.now();

                    const updateCount = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        counter.textContent = Math.floor(progress * target);

                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            counter.textContent = target;
                        }
                    };

                    requestAnimationFrame(updateCount);
                });
                hasAnimated = true;
            }
        });
    }, { threshold: 0.3 });

    const metricsSection = document.querySelector('.banner-metrics-section');
    if (metricsSection) counterObserver.observe(metricsSection);

    const historySection = document.querySelector('.history-section');
    if (historySection) counterObserver.observe(historySection);

    /* 3. MOBILE NAVIGATION TOGGLE */
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('nav-open');
        });
    }

    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', (event) => {
            const dropdown = toggle.closest('.nav-dropdown');
            if (window.innerWidth <= 768 && !dropdown.classList.contains('is-open')) {
                event.preventDefault();
            }
            const isOpen = dropdown.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', isOpen);
        });
    });

    /* 4. SCROLL TO TOP FLOATING BUTTON */
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