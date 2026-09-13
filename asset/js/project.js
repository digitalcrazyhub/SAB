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
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    slideElements.forEach(el => observer.observe(el));

    /* 2. LIGHTBOX POPUP FUNCTIONALITY */
    const cards = Array.from(document.querySelectorAll('.project-card'));
    const modal = document.getElementById('lightboxModal');
    const overlay = document.getElementById('lightboxOverlay');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');

    let activeIndex = 0;

    function openLightbox(index) {
        activeIndex = index;
        const card = cards[activeIndex];
        const imgSrc = card.querySelector('.project-img-box img').src;
        const title = card.dataset.title;
        const desc = card.dataset.desc;

        lightboxImg.src = imgSrc;
        lightboxTitle.textContent = title;
        lightboxDesc.textContent = desc;

        modal.classList.add('is-active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        modal.classList.remove('is-active');
        document.body.style.overflow = '';
    }

    function showNext() {
        activeIndex = (activeIndex + 1) % cards.length;
        openLightbox(activeIndex);
    }

    function showPrev() {
        activeIndex = (activeIndex - 1 + cards.length) % cards.length;
        openLightbox(activeIndex);
    }

    cards.forEach((card, idx) => {
        card.addEventListener('click', () => openLightbox(idx));
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (overlay) overlay.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', showNext);
    if (prevBtn) prevBtn.addEventListener('click', showPrev);

    // Keyboard controls for modal
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('is-active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });

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