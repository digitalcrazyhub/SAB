document.addEventListener('DOMContentLoaded', () => {


    /* ============================================================
       1. SCROLL REVEAL
       ============================================================ */

    const slideElements =
        document.querySelectorAll(
            '.slide-on-scroll'
        );


    if ('IntersectionObserver' in window) {

        const observer =
            new IntersectionObserver(
                (entries, obs) => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                'is-visible'
                            );

                            obs.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.10,

                    rootMargin:
                        '0px 0px -40px 0px'
                }
            );


        slideElements.forEach(element => {

            observer.observe(element);

        });

    } else {

        slideElements.forEach(element => {

            element.classList.add(
                'is-visible'
            );

        });

    }



    /* ============================================================
       2. HERO SLIDER
       SAME BEHAVIOUR AS TEAM PAGE
       ============================================================ */

    const heroTrack =
        document.getElementById(
            'teamHeroTrack'
        );


    const heroSlides =
        document.querySelectorAll(
            '.team-hero .hero-slide'
        );


    const heroDots =
        document.querySelectorAll(
            '.team-hero .dot'
        );


    let heroIndex = 0;

    let heroTimer = null;


    function goToHeroSlide(index) {

        if (
            !heroTrack ||
            heroSlides.length === 0
        ) {

            return;

        }


        heroIndex =
            (index + heroSlides.length)
            % heroSlides.length;


        heroTrack.style.transform =
            `translate3d(-${heroIndex * 100}%, 0, 0)`;


        heroDots.forEach((dot, i) => {

            const active =
                i === heroIndex;


            dot.classList.toggle(
                'is-active',
                active
            );


            dot.setAttribute(
                'aria-current',
                active
                    ? 'true'
                    : 'false'
            );

        });

    }


    function stopHeroSlider() {

        if (heroTimer !== null) {

            clearInterval(heroTimer);

            heroTimer = null;

        }

    }


    function startHeroSlider() {

        if (
            heroSlides.length <= 1
        ) {

            return;

        }


        stopHeroSlider();


        heroTimer =
            setInterval(() => {

                goToHeroSlide(
                    heroIndex + 1
                );

            }, 5000);

    }


    heroDots.forEach(
        (dot, index) => {

            dot.addEventListener(
                'click',
                () => {

                    goToHeroSlide(
                        index
                    );

                    startHeroSlider();

                }
            );

        }
    );


    if (
        heroSlides.length > 0
    ) {

        goToHeroSlide(0);

        startHeroSlider();

    }



    /* ============================================================
       3. PROJECT LIGHTBOX
       ============================================================ */

    const cards =
        Array.from(
            document.querySelectorAll(
                '.project-card'
            )
        );


    const modal =
        document.getElementById(
            'lightboxModal'
        );


    const overlay =
        document.getElementById(
            'lightboxOverlay'
        );


    const closeBtn =
        document.getElementById(
            'lightboxClose'
        );


    const prevBtn =
        document.getElementById(
            'lightboxPrev'
        );


    const nextBtn =
        document.getElementById(
            'lightboxNext'
        );


    const lightboxImg =
        document.getElementById(
            'lightboxImg'
        );


    const lightboxTitle =
        document.getElementById(
            'lightboxTitle'
        );


    const lightboxDesc =
        document.getElementById(
            'lightboxDesc'
        );


    let activeIndex = 0;


    function getProjectData(index) {

        const card =
            cards[index];


        if (!card) {

            return null;

        }


        const image =
            card.querySelector(
                '.project-img-box img'
            );


        return {

            image:
                image
                    ? image.getAttribute('src')
                    : '',

            title:
                card.dataset.title ||
                card.querySelector(
                    '.project-title'
                )?.textContent.trim() ||
                'Project',

            description:
                card.dataset.desc ||
                card.querySelector(
                    '.project-desc'
                )?.textContent.trim() ||
                ''

        };

    }



    function openLightbox(index) {

        if (
            !modal ||
            !lightboxImg ||
            cards.length === 0
        ) {

            return;

        }


        activeIndex =
            (index + cards.length)
            % cards.length;


        const project =
            getProjectData(
                activeIndex
            );


        if (!project) {

            return;

        }


        lightboxImg.src =
            project.image;


        lightboxImg.alt =
            project.title;


        if (lightboxTitle) {

            lightboxTitle.textContent =
                project.title;

        }


        if (lightboxDesc) {

            lightboxDesc.textContent =
                project.description;

        }


        modal.classList.add(
            'is-active'
        );


        modal.setAttribute(
            'aria-hidden',
            'false'
        );


        document.body.classList.add(
            'lightbox-open'
        );


        if (cards.length <= 1) {

            prevBtn?.classList.add(
                'is-hidden'
            );

            nextBtn?.classList.add(
                'is-hidden'
            );

        } else {

            prevBtn?.classList.remove(
                'is-hidden'
            );

            nextBtn?.classList.remove(
                'is-hidden'
            );

        }


        closeBtn?.focus();

    }



    function closeLightbox() {

        if (!modal) {

            return;

        }


        modal.classList.remove(
            'is-active'
        );


        modal.setAttribute(
            'aria-hidden',
            'true'
        );


        document.body.classList.remove(
            'lightbox-open'
        );

    }



    function showNext() {

        if (
            cards.length <= 1
        ) {

            return;

        }


        openLightbox(
            activeIndex + 1
        );

    }



    function showPrevious() {

        if (
            cards.length <= 1
        ) {

            return;

        }


        openLightbox(
            activeIndex - 1
        );

    }



    /* ============================================================
       PROJECT CARD CLICK
       ============================================================ */

    cards.forEach(
        (card, index) => {


            card.addEventListener(
                'click',
                () => {

                    openLightbox(
                        index
                    );

                }
            );


            card.setAttribute(
                'tabindex',
                '0'
            );


            card.addEventListener(
                'keydown',
                event => {


                    if (
                        event.key === 'Enter' ||
                        event.key === ' '
                    ) {

                        event.preventDefault();


                        openLightbox(
                            index
                        );

                    }

                }
            );

        }
    );



    /* ============================================================
       LIGHTBOX BUTTONS
       ============================================================ */

    closeBtn?.addEventListener(
        'click',
        closeLightbox
    );


    overlay?.addEventListener(
        'click',
        closeLightbox
    );


    prevBtn?.addEventListener(
        'click',
        showPrevious
    );


    nextBtn?.addEventListener(
        'click',
        showNext
    );



    /* ============================================================
       KEYBOARD CONTROLS
       ============================================================ */

    document.addEventListener(
        'keydown',
        event => {


            if (
                !modal ||
                !modal.classList.contains(
                    'is-active'
                )
            ) {

                return;

            }


            if (
                event.key === 'Escape'
            ) {

                closeLightbox();

                return;

            }


            if (
                event.key === 'ArrowRight'
            ) {

                showNext();

                return;

            }


            if (
                event.key === 'ArrowLeft'
            ) {

                showPrevious();

                return;

            }

        }
    );



    /* ============================================================
       4. MOBILE NAVIGATION
       ============================================================ */

    const mobileToggle =
        document.getElementById(
            'mobileToggle'
        );


    const mainNav =
        document.getElementById(
            'mainNav'
        );


    if (
        mobileToggle &&
        mainNav
    ) {


        mobileToggle.addEventListener(
            'click',
            () => {


                const isOpen =
                    mainNav.classList.toggle(
                        'nav-open'
                    );


                mobileToggle.classList.toggle(
                    'is-active',
                    isOpen
                );


                mobileToggle.setAttribute(
                    'aria-expanded',
                    isOpen
                        ? 'true'
                        : 'false'
                );


            }
        );

    }



    /* ============================================================
       5. MOBILE DROPDOWNS
       ============================================================ */

    const dropdownToggles =
        document.querySelectorAll(
            '.dropdown-toggle'
        );


    dropdownToggles.forEach(
        toggle => {


            toggle.addEventListener(
                'click',
                event => {


                    const dropdown =
                        toggle.closest(
                            '.nav-dropdown'
                        );


                    if (!dropdown) {

                        return;

                    }


                    if (
                        window.innerWidth <= 768
                    ) {


                        event.preventDefault();


                        const isOpen =
                            dropdown.classList.toggle(
                                'is-open'
                            );


                        toggle.setAttribute(
                            'aria-expanded',
                            isOpen
                                ? 'true'
                                : 'false'
                        );

                    }

                }
            );

        }
    );



    /* ============================================================
       6. CLOSE MOBILE NAV AFTER NORMAL LINK CLICK
       ============================================================ */

    document.addEventListener(
        'click',
        event => {


            if (
                window.innerWidth > 768
            ) {

                return;

            }


            const link =
                event.target.closest(
                    '#mainNav a'
                );


            if (!link) {

                return;

            }


            if (
                link.classList.contains(
                    'dropdown-toggle'
                )
            ) {

                return;

            }


            mainNav?.classList.remove(
                'nav-open'
            );


            mobileToggle?.classList.remove(
                'is-active'
            );


            mobileToggle?.setAttribute(
                'aria-expanded',
                'false'
            );

        }
    );



    /* ============================================================
       7. SCROLL TO TOP
       ============================================================ */

    const scrollUp =
        document.getElementById(
            'scrollUp'
        );


    function updateScrollButton() {

        if (!scrollUp) {

            return;

        }


        if (
            window.scrollY > 400
        ) {

            scrollUp.classList.add(
                'is-visible'
            );

        } else {

            scrollUp.classList.remove(
                'is-visible'
            );

        }

    }


    window.addEventListener(
        'scroll',
        updateScrollButton,
        {
            passive: true
        }
    );


    updateScrollButton();


    scrollUp?.addEventListener(
        'click',
        () => {

            window.scrollTo({

                top: 0,

                behavior: 'smooth'

            });

        }
    );



    /* ============================================================
       8. RESET MOBILE NAVIGATION ON DESKTOP RESIZE
       ============================================================ */

    window.addEventListener(
        'resize',
        () => {


            if (
                window.innerWidth > 768
            ) {


                mainNav?.classList.remove(
                    'nav-open'
                );


                mobileToggle?.classList.remove(
                    'is-active'
                );


                mobileToggle?.setAttribute(
                    'aria-expanded',
                    'false'
                );


                document
                    .querySelectorAll(
                        '.nav-dropdown'
                    )
                    .forEach(
                        dropdown => {

                            dropdown.classList.remove(
                                'is-open'
                            );

                        }
                    );

            }

        }
    );


});