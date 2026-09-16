document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =========================================================
       1. SCROLL REVEAL
    ========================================================== */

    const slideElements =
        document.querySelectorAll(".slide-on-scroll");


    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "is-visible"
                            );

                            observer.unobserve(
                                entry.target
                            );
                        }

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -50px 0px"
                }
            );


        slideElements.forEach((element) => {

            revealObserver.observe(element);

        });

    } else {

        slideElements.forEach((element) => {

            element.classList.add("is-visible");

        });

    }


    /* =========================================================
       2. HERO SLIDER
    ========================================================== */

    const heroTrack =
        document.getElementById("contactHeroTrack");

    const heroSlides =
        document.querySelectorAll(
            ".contact-hero-slide"
        );

    const heroDots =
        document.querySelectorAll(
            ".contact-dot"
        );

    const heroNext =
        document.getElementById(
            "contactHeroNext"
        );

    const heroPrev =
        document.getElementById(
            "contactHeroPrev"
        );


    let currentSlide = 0;

    let heroTimer = null;


    function updateHero(index) {

        if (!heroSlides.length) {
            return;
        }


        currentSlide =
            (index + heroSlides.length) %
            heroSlides.length;


        if (heroTrack) {

            heroTrack.style.transform =
                `translate3d(-${currentSlide * 100}%, 0, 0)`;

        }


        heroDots.forEach((dot, dotIndex) => {

            dot.classList.toggle(
                "is-active",
                dotIndex === currentSlide
            );

        });


        heroSlides.forEach((slide, slideIndex) => {

            slide.classList.toggle(
                "is-active",
                slideIndex === currentSlide
            );

        });

    }


    function nextHero() {

        updateHero(currentSlide + 1);

    }


    function previousHero() {

        updateHero(currentSlide - 1);

    }


    function startHeroTimer() {

        stopHeroTimer();


        if (heroSlides.length <= 1) {
            return;
        }


        heroTimer =
            setInterval(
                nextHero,
                6000
            );

    }


    function stopHeroTimer() {

        if (heroTimer) {

            clearInterval(heroTimer);

            heroTimer = null;

        }

    }


    heroDots.forEach((dot, index) => {

        dot.addEventListener("click", () => {

            updateHero(index);

            startHeroTimer();

        });

    });


    if (heroNext) {

        heroNext.addEventListener(
            "click",
            () => {

                nextHero();

                startHeroTimer();

            }
        );

    }


    if (heroPrev) {

        heroPrev.addEventListener(
            "click",
            () => {

                previousHero();

                startHeroTimer();

            }
        );

    }


    const heroSection =
        document.querySelector(".contact-hero");


    if (heroSection) {

        heroSection.addEventListener(
            "mouseenter",
            stopHeroTimer
        );


        heroSection.addEventListener(
            "mouseleave",
            startHeroTimer
        );

    }


    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "ArrowRight") {

                nextHero();

                startHeroTimer();

            }


            if (event.key === "ArrowLeft") {

                previousHero();

                startHeroTimer();

            }

        }
    );


    updateHero(0);

    startHeroTimer();


    /* =========================================================
       3. MOBILE NAVIGATION
    ========================================================== */

    const mobileToggle =
        document.getElementById(
            "mobileToggle"
        );

    const mainNav =
        document.getElementById(
            "mainNav"
        );


    if (mobileToggle && mainNav) {

        mobileToggle.addEventListener(
            "click",
            () => {

                const isOpen =
                    mainNav.classList.toggle(
                        "nav-open"
                    );


                mobileToggle.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );


                document.body.classList.toggle(
                    "no-scroll",
                    isOpen
                );

            }
        );

    }


    /* =========================================================
       4. NAV DROPDOWNS
    ========================================================== */

    const dropdownToggles =
        document.querySelectorAll(
            ".dropdown-toggle"
        );


    dropdownToggles.forEach((toggle) => {

        toggle.addEventListener(
            "click",
            (event) => {

                const dropdown =
                    toggle.closest(
                        ".nav-dropdown"
                    );


                if (!dropdown) {
                    return;
                }


                if (window.innerWidth <= 768) {

                    event.preventDefault();

                    const isOpen =
                        dropdown.classList.toggle(
                            "is-open"
                        );


                    toggle.setAttribute(
                        "aria-expanded",
                        String(isOpen)
                    );

                }

            }
        );

    });


    /* =========================================================
       5. CONTACT FORM
    ========================================================== */

    const form =
        document.getElementById(
            "contactForm"
        );


    const firstName =
        document.getElementById(
            "firstName"
        );

    const lastName =
        document.getElementById(
            "lastName"
        );

    const phone =
        document.getElementById(
            "phone"
        );

    const email =
        document.getElementById(
            "email"
        );

    const message =
        document.getElementById(
            "message"
        );

    const company =
        document.getElementById(
            "company"
        );

    const service =
        document.getElementById(
            "service"
        );


    const submitButton =
        document.getElementById(
            "contactSubmit"
        );


    const formStatus =
        document.getElementById(
            "formStatus"
        );


    const messageCount =
        document.getElementById(
            "messageCount"
        );


    /* =========================================================
       FORM HELPERS
    ========================================================== */

    function getErrorElement(fieldId) {

        return document.getElementById(
            `${fieldId}Error`
        );

    }


    function clearFieldError(field) {

        if (!field) {
            return;
        }


        const group =
            field.closest(
                ".form-group"
            );


        if (group) {

            group.classList.remove(
                "has-error"
            );

        }


        const error =
            getErrorElement(field.id);


        if (error) {

            error.textContent = "";

        }

    }


    function setFieldError(
        field,
        messageText
    ) {

        if (!field) {
            return;
        }


        const group =
            field.closest(
                ".form-group"
            );


        if (group) {

            group.classList.add(
                "has-error"
            );

            group.classList.remove(
                "has-success"
            );

        }


        const error =
            getErrorElement(field.id);


        if (error) {

            error.textContent =
                messageText;

        }

    }


    function setFieldSuccess(field) {

        if (!field) {
            return;
        }


        const group =
            field.closest(
                ".form-group"
            );


        if (group) {

            group.classList.remove(
                "has-error"
            );

            group.classList.add(
                "has-success"
            );

        }

    }


    function clearFormStatus() {

        if (!formStatus) {
            return;
        }


        formStatus.textContent = "";

        formStatus.className =
            "form-status";

    }


    /* =========================================================
       NAME VALIDATION
    ========================================================== */

    function validateName(field, label) {

        if (!field) {
            return false;
        }


        const value =
            field.value.trim();


        if (!value) {

            setFieldError(
                field,
                `${label} is required`
            );

            return false;

        }


        if (value.length < 2) {

            setFieldError(
                field,
                `${label} must contain at least 2 characters`
            );

            return false;

        }


        if (!/^[A-Za-zÀ-ÿ\s.'-]+$/.test(value)) {

            setFieldError(
                field,
                `${label} contains invalid characters`
            );

            return false;

        }


        setFieldSuccess(field);

        return true;

    }


    /* =========================================================
       PHONE VALIDATION
    ========================================================== */

    function validatePhone() {

        if (!phone) {
            return false;
        }


        const normalized =
            phone.value.trim().replace(/[\s()-]/g, "");

        const digits =
            normalized.startsWith("+91") && normalized.length === 13
                ? normalized.slice(3)
                : normalized.length === 12 && normalized.startsWith("91")
                    ? normalized.slice(2)
                    : normalized;

        if (!/^[6-9][0-9]{9}$/.test(digits)) {

            setFieldError(
                phone,
                "Enter a valid 10-digit mobile number"
            );

            return false;

        }


        setFieldSuccess(phone);

        return true;

    }


    /* =========================================================
       EMAIL VALIDATION
    ========================================================== */

    function validateEmail() {

        if (!email) {
            return false;
        }


        const value =
            email.value.trim();


        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;


        if (!emailRegex.test(value)) {

            setFieldError(
                email,
                "Enter a valid email address"
            );

            return false;

        }


        setFieldSuccess(email);

        return true;

    }


    /* =========================================================
       MESSAGE VALIDATION
    ========================================================== */

    function validateMessage() {

        if (!message) {
            return false;
        }


        const value =
            message.value.trim();


        if (value.length < 10) {

            setFieldError(
                message,
                "Message must be at least 10 characters"
            );

            return false;

        }


        setFieldSuccess(message);

        return true;

    }


    /* =========================================================
       LIVE MESSAGE COUNTER
    ========================================================== */

    function updateMessageCount() {

        if (!message || !messageCount) {
            return;
        }


        messageCount.textContent =
            `${message.value.length} / 1000`;

    }


    if (message) {

        message.addEventListener(
            "input",
            updateMessageCount
        );

        updateMessageCount();

    }


    /* =========================================================
       PHONE INPUT
    ========================================================== */

    if (phone) {

        phone.addEventListener(
            "input",
            () => {

                const raw = phone.value.trim();
                if (raw.startsWith("+91")) {
                    phone.value = "+91" + raw.slice(3).replace(/\D/g, "").slice(0, 10);
                } else {
                    phone.value = raw.replace(/\D/g, "").slice(0, 10);
                }

                clearFieldError(phone);

            }
        );

    }


    /* =========================================================
       LIVE FIELD CLEANUP
    ========================================================== */

    [
        firstName,
        lastName,
        email,
        message,
        company,
        service
    ].forEach((field) => {

        if (!field) {
            return;
        }


        field.addEventListener(
            "input",
            () => {

                clearFieldError(field);

            }
        );

    });


    /* =========================================================
       FORM SUBMISSION
    ========================================================== */

    const csrfTokenInput = document.getElementById("csrfToken");
    const formAction = form ? form.getAttribute("action") : "/backend/contact-submit.php";

    async function loadCsrfToken() {
        if (!csrfTokenInput || !formAction) return;

        try {
            const response = await fetch(formAction, {
                method: "GET",
                credentials: "same-origin",
                headers: { "Accept": "application/json" }
            });
            const data = await response.json();
            if (response.ok && data.success && data.message) {
                csrfTokenInput.value = data.message;
            }
        } catch (error) {
            // Submission will fail safely if a CSRF token cannot be obtained.
        }
    }

    function setSubmitLoading(isLoading) {
        if (!submitButton) return;

        submitButton.disabled = isLoading;
        submitButton.setAttribute("aria-busy", String(isLoading));
        submitButton.classList.toggle("loading", isLoading);

        const buttonText = submitButton.querySelector("span");
        if (buttonText) {
            buttonText.textContent = isLoading ? "Sending..." : "Send Enquiry";
        }
    }

    function showFormStatus(messageText, type) {
        if (!formStatus) return;

        formStatus.textContent = messageText;
        formStatus.className = `form-status ${type}`;
    }

    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            clearFormStatus();

            const website = document.getElementById("website");
            if (website && website.value.trim() !== "") {
                showFormStatus("Invalid submission.", "error");
                return;
            }

            const validFirstName = validateName(firstName, "First name");
            const validLastName = validateName(lastName, "Last name");
            const validPhone = validatePhone();
            const validEmail = validateEmail();
            const validMessage = validateMessage();

            if (!(validFirstName && validLastName && validPhone && validEmail && validMessage)) {
                const firstInvalid = form.querySelector(".has-error input, .has-error textarea, .has-error select");
                if (firstInvalid) {
                    firstInvalid.focus({ preventScroll: true });
                    firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
                }
                return;
            }

            if (!csrfTokenInput || !csrfTokenInput.value) {
                showFormStatus("Unable to securely submit the form. Please refresh the page and try again.", "error");
                await loadCsrfToken();
                return;
            }

            const captchaResponse = window.grecaptcha
                ? window.grecaptcha.getResponse()
                : "";

            if (!captchaResponse) {
                showFormStatus("Please complete the reCAPTCHA verification.", "error");
                return;
            }

            setSubmitLoading(true);

            try {
                const response = await fetch(formAction || "/backend/contact-submit.php", {
                    method: "POST",
                    credentials: "same-origin",
                    headers: {
                        "Accept": "application/json",
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    body: new FormData(form)
                });

                let data;
                try {
                    data = await response.json();
                } catch (parseError) {
                    throw new Error("Invalid server response.");
                }

                if (!response.ok || !data.success) {
                    showFormStatus(
                        data.message || "Something went wrong. Please try again later.",
                        "error"
                    );

                    if (window.grecaptcha) {
                        window.grecaptcha.reset();
                    }

                    if (response.status === 403) {
                        await loadCsrfToken();
                    }

                    return;
                }

                showFormStatus(
                    data.message || "Thank you! Your enquiry has been submitted successfully.",
                    "success"
                );

                form.reset();
                updateMessageCount();

                form.querySelectorAll(".has-error, .has-success").forEach((group) => {
                    group.classList.remove("has-error", "has-success");
                });

                if (window.grecaptcha) {
                    window.grecaptcha.reset();
                }

                await loadCsrfToken();
            } catch (error) {
                showFormStatus(
                    "Something went wrong. Please try again later.",
                    "error"
                );

                if (window.grecaptcha) {
                    window.grecaptcha.reset();
                }
            } finally {
                setSubmitLoading(false);
            }
        });

        loadCsrfToken();
    }

    /* =========================================================
       6. SCROLL TO TOP
    ========================================================== */

    const scrollUp =
        document.getElementById(
            "scrollUp"
        );


    function updateScrollButton() {

        if (!scrollUp) {
            return;
        }


        if (window.scrollY > 400) {

            scrollUp.classList.add(
                "is-visible"
            );

        } else {

            scrollUp.classList.remove(
                "is-visible"
            );

        }

    }


    window.addEventListener(
        "scroll",
        updateScrollButton,
        {
            passive: true
        }
    );


    updateScrollButton();


    if (scrollUp) {

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


    /* =========================================================
       7. CLOSE MOBILE NAV ON LINK CLICK
    ========================================================== */

    if (mainNav) {

        mainNav
            .querySelectorAll("a")
            .forEach((link) => {

                link.addEventListener(
                    "click",
                    () => {

                        if (
                            window.innerWidth <= 768
                        ) {

                            mainNav.classList.remove(
                                "nav-open"
                            );


                            if (mobileToggle) {

                                mobileToggle.setAttribute(
                                    "aria-expanded",
                                    "false"
                                );

                            }


                            document.body.classList.remove(
                                "no-scroll"
                            );

                        }

                    }
                );

            });

    }


    /* =========================================================
       8. SMOOTH CTA SCROLL
    ========================================================== */

    document
        .querySelectorAll(
            'a[href="#contactForm"]'
        )
        .forEach((link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const target =
                        document.getElementById(
                            "contactForm"
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });


                    setTimeout(() => {

                        const firstField =
                            document.getElementById(
                                "firstName"
                            );


                        if (firstField) {
                            firstField.focus();
                        }

                    }, 700);

                }
            );

        });


});