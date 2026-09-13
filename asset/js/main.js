 document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. INTERSECTION OBSERVER FOR CONTAINER & SECTION SLIDING
       ========================================================================== */
    const slideElements = document.querySelectorAll('.slide-on-scroll');

    const slideObserverOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.15
    };

    const slideObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, slideObserverOptions);

    slideElements.forEach(el => slideObserver.observe(el));

    /* ==========================================================================
       2. HERO CAROUSEL ANIMATION ENGINE
       ========================================================================== */
    const track = document.getElementById('heroTrack');
    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('.dot'));
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const progressFill = document.getElementById('progressFill');
    const heroSection = document.querySelector('.hero-slider-section');

    let currentIndex = 0;
    const totalSlides = slides.length;
    const slideDuration = 6000;
    let slideTimer = null;
    let progressTimer = null;
    let startTime = 0;

    function goToSlide(index) {
        if (index < 0) {
            index = totalSlides - 1;
        } else if (index >= totalSlides) {
            index = 0;
        }

        currentIndex = index;
        track.style.transform = `translate3d(-${currentIndex * 100}%, 0, 0)`;

        slides.forEach((slide, i) => {
            slide.classList.toggle('is-active', i === currentIndex);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === currentIndex);
        });

        startSlideTimer();
    }

    function startSlideTimer() {
        stopSlideTimer();
        startTime = Date.now();

        progressTimer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const percentage = Math.min((elapsed / slideDuration) * 100, 100);
            if (progressFill) progressFill.style.width = `${percentage}%`;
        }, 25);

        slideTimer = setTimeout(() => {
            goToSlide(currentIndex + 1);
        }, slideDuration);
    }

    function stopSlideTimer() {
        if (slideTimer) clearTimeout(slideTimer);
        if (progressTimer) clearInterval(progressTimer);
        if (progressFill) progressFill.style.width = '0%';
    }

    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => goToSlide(i));
    });

    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopSlideTimer);
        heroSection.addEventListener('mouseleave', startSlideTimer);
    }

    // Touch Swipe Support for Hero
    let touchStartX = 0;
    let isTouching = false;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        isTouching = true;
        stopSlideTimer();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        if (!isTouching) return;
        const diffX = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diffX) > 45) {
            if (diffX > 0) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(currentIndex - 1);
            }
        } else {
            startSlideTimer();
        }
        isTouching = false;
    }, { passive: true });

    goToSlide(0);

    /* ==========================================================================
       3. SERVICES INTERACTIVE TAB SLIDING
       ========================================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const activePanel = document.getElementById(target);
            activePanel.classList.add('active');

            // Reset and trigger slide animations on active elements
            const leftEl = activePanel.querySelector('.tab-img-box');
            const rightEl = activePanel.querySelector('.tab-info-box');

            leftEl.style.animation = 'none';
            rightEl.style.animation = 'none';
            void leftEl.offsetWidth; // Trigger reflow
            leftEl.style.animation = '';
            rightEl.style.animation = '';
        });
    });
});

//Number counting animation
document.addEventListener('DOMContentLoaded', () => {
    const statsBanner = document.querySelector('.stats-banner');
    const counters = document.querySelectorAll('.stat-counter');
    let animationFrames = [];

    // Deceleration easing calculation
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    function cancelActiveAnimations() {
        animationFrames.forEach(id => cancelAnimationFrame(id));
        animationFrames = [];
    }

    function resetCounters() {
        cancelActiveAnimations();
        counters.forEach(counter => {
            counter.textContent = '0';
        });
    }

    function startCounting() {
        cancelActiveAnimations();

        counters.forEach((counter, index) => {
            const target = parseInt(counter.dataset.target, 10);
            const isComma = counter.dataset.format === 'comma';
            const duration = 1800; // 1.8 seconds duration
            const startTime = performance.now();

            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutCubic(progress);
                const currentVal = Math.floor(easedProgress * target);

                counter.textContent = isComma ? currentVal.toLocaleString('en-US') : currentVal;

                if (progress < 1) {
                    animationFrames[index] = requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = isComma ? target.toLocaleString('en-US') : target;
                }
            };

            animationFrames[index] = requestAnimationFrame(updateCounter);
        });
    }

    // IntersectionObserver triggers every time the section enters or leaves view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Section entered viewport (scrolling up or down)
                statsBanner.classList.add('is-visible');
                startCounting();
            } else {
                // Section left viewport -> reset values for the next scroll encounter
                statsBanner.classList.remove('is-visible');
                resetCounters();
            }
        });
    }, {
        threshold: 0.25, // Activates when 25% of the banner is in view
        rootMargin: '0px 0px -40px 0px'
    });

    if (statsBanner) {
        observer.observe(statsBanner);
    }
});

