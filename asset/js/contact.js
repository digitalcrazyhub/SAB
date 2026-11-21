/**
 * SRI AMMA BUILDER PVT LTD — CONTACT PAGE & LEAD INTAKE MODULE
 * Handles Hero Slider, Field Validation, CSRF Token Management,
 * Google reCAPTCHA v3 Execution, AJAX Form Submission & UI Feedback.
 */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* ==========================================================================
       1. HERO SLIDER CONTROLS (IF PRESENT ON PAGE)
       ========================================================================== */
    const heroTrack = document.getElementById("contactHeroTrack");
    const heroSlides = Array.from(document.querySelectorAll(".contact-hero-slide"));
    const heroDots = Array.from(document.querySelectorAll(".contact-dot"));
    const heroNext = document.getElementById("contactHeroNext");
    const heroPrev = document.getElementById("contactHeroPrev");

    if (heroTrack && heroSlides.length > 0) {
        let currentSlide = 0;
        let heroTimer = null;
        const totalSlides = heroSlides.length;

        function updateHero(index) {
            currentSlide = (index + totalSlides) % totalSlides;
            heroTrack.style.transform = `translate3d(-${currentSlide * 100}%, 0, 0)`;

            heroDots.forEach((dot, dotIndex) => {
                dot.classList.toggle("is-active", dotIndex === currentSlide);
                dot.setAttribute("aria-current", String(dotIndex === currentSlide));
            });

            heroSlides.forEach((slide, slideIndex) => {
                slide.classList.toggle("is-active", slideIndex === currentSlide);
                slide.setAttribute("aria-hidden", String(slideIndex !== currentSlide));
            });
        }

        function startHeroTimer() {
            stopHeroTimer();
            if (totalSlides > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                heroTimer = setInterval(() => updateHero(currentSlide + 1), 6000);
            }
        }

        function stopHeroTimer() {
            if (heroTimer) {
                clearInterval(heroTimer);
                heroTimer = null;
            }
        }

        if (heroNext) {
            heroNext.addEventListener("click", () => {
                updateHero(currentSlide + 1);
                startHeroTimer();
            });
        }

        if (heroPrev) {
            heroPrev.addEventListener("click", () => {
                updateHero(currentSlide - 1);
                startHeroTimer();
            });
        }

        heroDots.forEach((dot, i) => {
            dot.addEventListener("click", () => {
                updateHero(i);
                startHeroTimer();
            });
        });

        heroTrack.parentElement.addEventListener("mouseenter", stopHeroTimer);
        heroTrack.parentElement.addEventListener("mouseleave", startHeroTimer);

        updateHero(0);
        startHeroTimer();
    }

    /* ==========================================================================
       2. SCROLL REVEAL (INTERSECTION OBSERVER)
       ========================================================================== */
    const slideElements = document.querySelectorAll(".slide-on-scroll:not(.is-visible)");
    if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

        slideElements.forEach((el) => revealObserver.observe(el));
    } else {
        slideElements.forEach((el) => el.classList.add("is-visible"));
    }

    /* ==========================================================================
       3. CONTACT FORM VALIDATION & ENQUIRY ENGINE
       ========================================================================== */
    const form = document.getElementById("contactForm");
    if (!form) return;

    const firstNameInput = document.getElementById("firstName");
    const lastNameInput = document.getElementById("lastName");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const serviceInput = document.getElementById("service");
    const messageInput = document.getElementById("message");
    const messageCount = document.getElementById("messageCount");
    const honeypotInput = document.getElementById("website");
    const csrfTokenInput = document.getElementById("csrfToken");
    const recaptchaTokenInput = document.getElementById("recaptchaToken");
    const submitBtn = document.getElementById("contactSubmit");
    const formStatus = document.getElementById("formStatus");

    const formAction = form.getAttribute("action") || "./backend/api/contact.php";
    const RECAPTCHA_SITE_KEY = "";
    const RECAPTCHA_ACTION = "contact_form";

    // Live message character counter
    if (messageInput && messageCount) {
        const maxLen = messageInput.getAttribute("maxlength") || 3000;
        const updateCounter = () => {
            const curLen = messageInput.value.length;
            messageCount.textContent = `${curLen} / ${maxLen}`;
            messageCount.classList.toggle("text-warning", curLen > maxLen * 0.9);
        };
        messageInput.addEventListener("input", updateCounter);
        updateCounter();
    }

    // Helper: Display field error
    function setFieldError(fieldId, errorMsg) {
        const errorEl = document.getElementById(`${fieldId}Error`);
        const inputEl = document.getElementById(fieldId);
        if (errorEl) {
            errorEl.textContent = errorMsg;
            errorEl.style.display = errorMsg ? "block" : "none";
        }
        if (inputEl) {
            inputEl.classList.toggle("is-invalid", Boolean(errorMsg));
            inputEl.setAttribute("aria-invalid", String(Boolean(errorMsg)));
        }
    }

    // Clear all errors
    function clearAllErrors() {
        ["firstName", "lastName", "email", "phone", "service", "message"].forEach((id) => {
            setFieldError(id, "");
        });
        if (formStatus) {
            formStatus.innerHTML = "";
            formStatus.className = "form-status";
        }
    }

    // Clear error on input
    [firstNameInput, lastNameInput, emailInput, phoneInput, serviceInput, messageInput].forEach((input) => {
        if (!input) return;
        input.addEventListener("input", () => {
            setFieldError(input.id, "");
        });
    });

    // Client-side validation
    function validateForm() {
        let isValid = true;
        clearAllErrors();

        // First Name
        const firstName = firstNameInput ? firstNameInput.value.trim() : "";
        if (!firstName) {
            setFieldError("firstName", "Please enter your first name.");
            isValid = false;
        } else if (firstName.length < 2) {
            setFieldError("firstName", "First name must be at least 2 characters.");
            isValid = false;
        }

        // Last Name
        const lastName = lastNameInput ? lastNameInput.value.trim() : "";
        if (!lastName) {
            setFieldError("lastName", "Please enter your last name.");
            isValid = false;
        }

        // Email
        const email = emailInput ? emailInput.value.trim() : "";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!email) {
            setFieldError("email", "Please enter your email address.");
            isValid = false;
        } else if (!emailRegex.test(email)) {
            setFieldError("email", "Please enter a valid email address.");
            isValid = false;
        }

        // Phone (10 digits or +91 standard)
        const phone = phoneInput ? phoneInput.value.trim().replace(/[\s\-()]/g, "") : "";
        const phonePattern = /^(\+91|91)?[6-9]\d{9}$/;
        if (!phone) {
            setFieldError("phone", "Please enter your 10-digit mobile number.");
            isValid = false;
        } else if (!phonePattern.test(phone)) {
            setFieldError("phone", "Enter a valid 10-digit Indian mobile number.");
            isValid = false;
        }

        // Message
        const message = messageInput ? messageInput.value.trim() : "";
        if (!message) {
            setFieldError("message", "Please describe your project requirements.");
            isValid = false;
        } else if (message.length < 10) {
            setFieldError("message", "Message must be at least 10 characters.");
            isValid = false;
        }

        return isValid;
    }

    // Fetch fresh CSRF Token from Backend
    async function fetchCsrfToken() {
        if (!csrfTokenInput) return;
        try {
            const res = await fetch(formAction, {
                method: "GET",
                credentials: "same-origin",
                headers: { "Accept": "application/json" }
            });
            if (res.ok) {
                const data = await res.json();
                const token = data.data?.csrf_token || (typeof data.data === "string" ? data.data : "");
                if (token) {
                    csrfTokenInput.value = token;
                }
            }
        } catch (e) {
            console.warn("CSRF token fetch postponed:", e);
        }
    }
    fetchCsrfToken();

    // Generate reCAPTCHA v3 Token with fallback
    async function getRecaptchaToken() {
        if (!recaptchaTokenInput) return "";
        if (!window.grecaptcha || typeof window.grecaptcha.ready !== "function") {
            return "";
        }

        return new Promise((resolve) => {
            const timer = setTimeout(() => resolve(""), 3000);
            window.grecaptcha.ready(async () => {
                try {
                    if (typeof window.grecaptcha.execute !== "function") {
                        clearTimeout(timer);
                        resolve("");
                        return;
                    }
                    const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: RECAPTCHA_ACTION });
                    clearTimeout(timer);
                    resolve(token || "");
                } catch (err) {
                    clearTimeout(timer);
                    console.warn("reCAPTCHA generation fallback:", err);
                    resolve("");
                }
            });
        });
    }

    // Submit handler
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Honeypot check
        if (honeypotInput && honeypotInput.value.trim() !== "") {
            form.reset();
            if (formStatus) {
                formStatus.className = "form-status form-status--success";
                formStatus.innerHTML = "<i class='fa-solid fa-circle-check'></i> Thank you! Your enquiry has been submitted.";
            }
            return;
        }

        if (!validateForm()) {
            const firstInvalid = form.querySelector(".is-invalid");
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        // Set Loading State
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.classList.add("is-loading");
            submitBtn.dataset.originalHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = "<i class='fa-solid fa-circle-notch fa-spin'></i> <span>Sending Enquiry...</span>";
        }

        if (formStatus) {
            formStatus.className = "form-status form-status--loading";
            formStatus.textContent = "Submitting your project enquiry securely...";
        }

        try {
            // Retrieve reCAPTCHA Token
            const rToken = await getRecaptchaToken();
            if (recaptchaTokenInput) recaptchaTokenInput.value = rToken;

            const formData = new FormData(form);

            const response = await fetch(formAction, {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },
                body: formData
            });

            const result = await response.json().catch(() => null);

            if (response.ok && result && result.success) {
                // Success
                form.reset();
                if (messageCount) messageCount.textContent = "0 / 3000";
                if (formStatus) {
                    const leadId = result.data?.lead_id ? `<br><small class="lead-ref">Reference ID: ${result.data.lead_id}</small>` : "";
                    formStatus.className = "form-status form-status--success";
                    formStatus.innerHTML = `
                        <div class="status-box-inner">
                            <i class="fa-solid fa-circle-check"></i>
                            <div>
                                <h4>Enquiry Submitted Successfully!</h4>
                                <p>Thank you for reaching out to Sri Amma Builder Pvt Ltd. Our engineering team will review your specifications and contact you shortly.</p>
                                ${leadId}
                            </div>
                        </div>
                    `;
                    formStatus.scrollIntoView({ behavior: "smooth", block: "center" });
                }
                // Refresh CSRF Token for any subsequent submission
                fetchCsrfToken();
            } else {
                // Handle Server Validation / Error
                const errorMsg = result?.message || "We could not process your submission. Please check your entries or call +91 94444 05505.";
                if (result?.data?.errors) {
                    Object.entries(result.data.errors).forEach(([field, msg]) => {
                        setFieldError(field, msg);
                    });
                }
                if (formStatus) {
                    formStatus.className = "form-status form-status--error";
                    formStatus.innerHTML = `
                        <div class="status-box-inner">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                            <div>
                                <h4>Submission Notice</h4>
                                <p>${errorMsg}</p>
                            </div>
                        </div>
                    `;
                }
            }
        } catch (err) {
            console.error("Submission failed:", err);
            if (formStatus) {
                formStatus.className = "form-status form-status--error";
                formStatus.innerHTML = `
                    <div class="status-box-inner">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <div>
                            <h4>Connection Notice</h4>
                            <p>Unable to connect to the server. Please check your internet connection or call our office directly at <strong>+91 94444 05505</strong>.</p>
                        </div>
                    </div>
                `;
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove("is-loading");
                submitBtn.innerHTML = submitBtn.dataset.originalHtml || "<span>Send Enquiry</span> <i class='fa-solid fa-arrow-right'></i>";
            }
        }
    });

    /* ==========================================================================
       4. SMOOTH SCROLL TO FORM
       ========================================================================== */
    document.querySelectorAll('a[href="#contactForm"]').forEach((btn) => {
        btn.addEventListener("click", (evt) => {
            evt.preventDefault();
            form.scrollIntoView({ behavior: "smooth", block: "center" });
            setTimeout(() => {
                if (firstNameInput) firstNameInput.focus();
            }, 600);
        });
    });
});
