document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       1. SCROLL REVEAL ANIMATION
    ========================================================== */

    const slideElements = document.querySelectorAll(".slide-on-scroll");

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            (entries, obs) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-visible");

                    obs.unobserve(entry.target);
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

        /* Fallback for older browsers */

        slideElements.forEach((element) => {
            element.classList.add("is-visible");
        });

    }


    /* =========================================================
       2. HERO SLIDER
    ========================================================== */

    const track = document.getElementById("teamHeroTrack");
    const slides = document.querySelectorAll(
        ".team-hero .hero-slide"
    );
    const dots = document.querySelectorAll(
        ".team-hero .dot"
    );

    let currentIndex = 0;
    let sliderInterval = null;

    if (track && slides.length > 0) {

        function goToSlide(index) {

            currentIndex =
                (index + slides.length) % slides.length;

            track.style.transform =
                `translate3d(-${currentIndex * 100}%, 0, 0)`;


            /* Update slide accessibility state */

            slides.forEach((slide, slideIndex) => {

                slide.classList.toggle(
                    "is-active",
                    slideIndex === currentIndex
                );

                slide.setAttribute(
                    "aria-hidden",
                    slideIndex === currentIndex
                        ? "false"
                        : "true"
                );

            });


            /* Update dots */

            dots.forEach((dot, dotIndex) => {

                const isActive =
                    dotIndex === currentIndex;

                dot.classList.toggle(
                    "is-active",
                    isActive
                );

                dot.setAttribute(
                    "aria-current",
                    isActive
                        ? "true"
                        : "false"
                );

            });

        }


        function startSlider() {

            stopSlider();

            if (slides.length <= 1) {
                return;
            }

            sliderInterval = setInterval(() => {

                goToSlide(currentIndex + 1);

            }, 5000);

        }


        function stopSlider() {

            if (sliderInterval !== null) {

                clearInterval(sliderInterval);

                sliderInterval = null;
            }

        }


        /* Dot controls */

        dots.forEach((dot, index) => {

            dot.addEventListener("click", () => {

                goToSlide(index);

                startSlider();

            });

        });


        /* Pause while mouse is over slider */

        const hero = document.querySelector(".team-hero");

        if (hero) {

            hero.addEventListener(
                "mouseenter",
                stopSlider
            );

            hero.addEventListener(
                "mouseleave",
                startSlider
            );

            hero.addEventListener(
                "focusin",
                stopSlider
            );

            hero.addEventListener(
                "focusout",
                startSlider
            );

        }


        /* Initialize */

        goToSlide(0);
        startSlider();

    }


    /* =========================================================
       3. SCROLL TO TOP
    ========================================================== */

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
            { passive: true }
        );


        scrollUp.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );


        updateScrollButton();

    }


    /* =========================================================
       4. MOBILE NAVIGATION
       
       Navbar is loaded dynamically.
       Therefore we use event delegation instead of
       querying the navbar only once at DOMContentLoaded.
    ========================================================== */

    document.addEventListener("click", (event) => {

        const toggle =
            event.target.closest("#mobileToggle");

        if (!toggle) {
            return;
        }

        const mainNav =
            document.getElementById("mainNav");

        if (!mainNav) {
            return;
        }

        const isOpen =
            mainNav.classList.toggle("nav-open");

        toggle.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

    });


    /* =========================================================
       5. CLOSE MOBILE MENU AFTER NAVIGATION
    ========================================================== */

    document.addEventListener("click", (event) => {

        const navLink =
            event.target.closest("#mainNav a");

        if (!navLink) {
            return;
        }

        const mainNav =
            document.getElementById("mainNav");

        const mobileToggle =
            document.getElementById("mobileToggle");

        if (mainNav) {
            mainNav.classList.remove("nav-open");
        }

        if (mobileToggle) {

            mobileToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    });


    /* =========================================================
       6. ESCAPE KEY
    ========================================================== */

    document.addEventListener("keydown", (event) => {

        if (event.key !== "Escape") {
            return;
        }

        const mainNav =
            document.getElementById("mainNav");

        const mobileToggle =
            document.getElementById("mobileToggle");

        if (mainNav) {
            mainNav.classList.remove("nav-open");
        }

        if (mobileToggle) {

            mobileToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    });

});