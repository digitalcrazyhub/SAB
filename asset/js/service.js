document.addEventListener("DOMContentLoaded", () => {

    /* ============================================================
       1. SCROLL REVEAL
    ============================================================ */

    const slideElements =
        document.querySelectorAll(".slide-on-scroll");


    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            (entries, obs) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("is-visible");

                        obs.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );


        slideElements.forEach((element) => {
            observer.observe(element);
        });

    } else {

        /*
         * Fallback for older browsers
         */

        slideElements.forEach((element) => {
            element.classList.add("is-visible");
        });

    }


    /* ============================================================
       2. HERO SLIDER
    ============================================================ */

    const track =
        document.getElementById("serviceHeroTrack");

    const slides =
        document.querySelectorAll(
            ".team-hero .hero-slide"
        );

    const dots =
        document.querySelectorAll(
            ".team-hero .dot"
        );


    let currentIndex = 0;

    let heroTimer = null;


    /*
     * Stop if the hero does not exist.
     */

    if (track && slides.length > 0) {

        const goToSlide = (index) => {

            currentIndex =
                (index + slides.length) %
                slides.length;


            track.style.transform =
                `translate3d(-${currentIndex * 100}%, 0, 0)`;


            dots.forEach((dot, dotIndex) => {

                const active =
                    dotIndex === currentIndex;


                dot.classList.toggle(
                    "is-active",
                    active
                );


                dot.setAttribute(
                    "aria-selected",
                    String(active)
                );

            });

        };


        const startHeroSlider = () => {

            /*
             * Do not start autoplay if there is only
             * one slide.
             */

            if (slides.length <= 1) {
                return;
            }


            stopHeroSlider();


            heroTimer = window.setInterval(() => {

                goToSlide(currentIndex + 1);

            }, 5000);

        };


        const stopHeroSlider = () => {

            if (heroTimer !== null) {

                window.clearInterval(heroTimer);

                heroTimer = null;
            }

        };


        /*
         * Dot navigation
         */

        dots.forEach((dot, index) => {

            dot.addEventListener("click", () => {

                goToSlide(index);

                startHeroSlider();

            });

        });


        /*
         * Pause while mouse is over hero
         */

        const hero =
            document.querySelector(".team-hero");


        if (hero) {

            hero.addEventListener(
                "mouseenter",
                stopHeroSlider
            );


            hero.addEventListener(
                "mouseleave",
                startHeroSlider
            );


            hero.addEventListener(
                "focusin",
                stopHeroSlider
            );


            hero.addEventListener(
                "focusout",
                startHeroSlider
            );

        }


        /*
         * Pause when browser tab is hidden.
         */

        document.addEventListener(
            "visibilitychange",
            () => {

                if (document.hidden) {

                    stopHeroSlider();

                } else {

                    startHeroSlider();

                }

            }
        );


        /*
         * Respect reduced-motion preference.
         */

        const reducedMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;


        if (!reducedMotion) {

            startHeroSlider();

        }

    }


    /* ============================================================
       3. MOBILE NAVIGATION
    ============================================================ */

    /*
     * The common navbar is loaded separately.
     *
     * Therefore this code uses event delegation so it
     * still works if navbar.html is injected after
     * DOMContentLoaded.
     */

    document.addEventListener(
        "click",
        (event) => {

            const toggle =
                event.target.closest("#mobileToggle");


            if (toggle) {

                const mainNav =
                    document.getElementById("mainNav");


                if (mainNav) {

                    const isOpen =
                        mainNav.classList.toggle(
                            "nav-open"
                        );


                    toggle.setAttribute(
                        "aria-expanded",
                        String(isOpen)
                    );

                }

            }

        }
    );


    /* ============================================================
       4. MOBILE DROPDOWN
    ============================================================ */

    document.addEventListener(
        "click",
        (event) => {

            const toggle =
                event.target.closest(
                    ".dropdown-toggle"
                );


            if (!toggle) {
                return;
            }


            if (window.innerWidth > 768) {
                return;
            }


            const dropdown =
                toggle.closest(".nav-dropdown");


            if (!dropdown) {
                return;
            }


            /*
             * First tap opens the dropdown.
             * Second tap can follow the actual link.
             */

            if (!dropdown.classList.contains("is-open")) {

                event.preventDefault();

                dropdown.classList.add("is-open");

                toggle.setAttribute(
                    "aria-expanded",
                    "true"
                );

            } else {

                dropdown.classList.remove(
                    "is-open"
                );

                toggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );


    /* ============================================================
       5. CLOSE MOBILE NAV WHEN LINK IS CLICKED
    ============================================================ */

    document.addEventListener(
        "click",
        (event) => {

            const link =
                event.target.closest(
                    "#mainNav a"
                );


            if (!link) {
                return;
            }


            const mainNav =
                document.getElementById("mainNav");


            const mobileToggle =
                document.getElementById(
                    "mobileToggle"
                );


            if (
                mainNav &&
                window.innerWidth <= 768
            ) {

                /*
                 * Don't immediately close when
                 * clicking dropdown toggle.
                 */

                if (
                    link.classList.contains(
                        "dropdown-toggle"
                    )
                ) {
                    return;
                }


                mainNav.classList.remove(
                    "nav-open"
                );


                if (mobileToggle) {

                    mobileToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }

        }
    );


    /* ============================================================
       6. SCROLL TO TOP
    ============================================================ */

    const scrollUp =
        document.getElementById("scrollUp");


    if (scrollUp) {

        const updateScrollButton = () => {

            if (window.scrollY > 400) {

                scrollUp.classList.add(
                    "is-visible"
                );

            } else {

                scrollUp.classList.remove(
                    "is-visible"
                );

            }

        };


        window.addEventListener(
            "scroll",
            updateScrollButton,
            {
                passive: true
            }
        );


        updateScrollButton();


        scrollUp.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    /* ============================================================
       7. ESC KEY
       Close mobile navigation/dropdowns
    ============================================================ */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") {
                return;
            }


            const mainNav =
                document.getElementById("mainNav");


            const mobileToggle =
                document.getElementById(
                    "mobileToggle"
                );


            if (mainNav) {

                mainNav.classList.remove(
                    "nav-open"
                );

            }


            if (mobileToggle) {

                mobileToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }


            document
                .querySelectorAll(
                    ".nav-dropdown.is-open"
                )
                .forEach((dropdown) => {

                    dropdown.classList.remove(
                        "is-open"
                    );


                    const toggle =
                        dropdown.querySelector(
                            ".dropdown-toggle"
                        );


                    if (toggle) {

                        toggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                });

        }
    );

});