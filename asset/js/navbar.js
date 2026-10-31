
/* =========================================================
   SRI AMMA INDUSTRIAL DEVELOPERS
   COMPLETE RESPONSIVE NAVBAR JAVASCRIPT
   Prefix: saidpl-nav-
   ========================================================= */

(() => {
    "use strict";

    function initSaidplNavbar() {
        const header = document.getElementById("saidplNavHeaderElement");
        const menu = document.getElementById("saidplNavMenu");
        const hamburger = document.getElementById("saidplNavHamburger");
        const backdrop = document.getElementById("saidplNavBackdrop");

        /* Stop safely if navbar markup is unavailable */
        if (!header || !menu || !hamburger || !backdrop) {
            return;
        }

        /* Prevent duplicate initialization */
        if (header.dataset.saidplNavInitialized === "true") {
            return;
        }

        header.dataset.saidplNavInitialized = "true";

        const mobileQuery = window.matchMedia("(max-width: 1024px)");

        const dropdownItems = Array.from(
            menu.querySelectorAll(".saidpl-nav-item--has-dropdown")
        );

        /*
         * Dropdown timing configuration
         *
         * HOVER_OPEN_DELAY:
         * Wait before opening a desktop dropdown on hover.
         *
         * HOVER_CLOSE_DELAY:
         * Wait before closing when the pointer leaves.
         *
         * Set either value to 0 to disable its delay.
         */
        const HOVER_OPEN_DELAY = 180;
        const HOVER_CLOSE_DELAY = 250;

        const timers = new Map();

        let previousFocusedElement = null;
        let scrollTicking = false;

        /* =================================================
           1. HEADER SCROLL EFFECT
           ================================================= */

        function updateHeaderScrollState() {
            header.classList.toggle(
                "saidpl-nav-header--scrolled",
                window.scrollY > 10
            );

            scrollTicking = false;
        }

        function onScroll() {
            if (scrollTicking) return;

            scrollTicking = true;

            window.requestAnimationFrame(updateHeaderScrollState);
        }

        window.addEventListener("scroll", onScroll, {
            passive: true
        });

        updateHeaderScrollState();

        /* =================================================
           2. DROPDOWN HELPERS
           ================================================= */

        function clearDropdownTimer(item) {
            const timer = timers.get(item);

            if (timer !== undefined) {
                window.clearTimeout(timer);
                timers.delete(item);
            }
        }

        function setDropdownState(item, open) {
            const toggle = item.querySelector(
                ".saidpl-nav-dropdown-toggle"
            );

            item.classList.toggle("saidpl-nav-item--open", open);

            if (toggle) {
                toggle.setAttribute("aria-expanded", String(open));
            }
        }

        function closeDropdown(item) {
            clearDropdownTimer(item);
            setDropdownState(item, false);
        }

        function closeAllDropdowns(exceptItem = null) {
            dropdownItems.forEach((item) => {
                if (item !== exceptItem) {
                    closeDropdown(item);
                }
            });
        }

        function openDropdown(item) {
            clearDropdownTimer(item);
            closeAllDropdowns(item);
            setDropdownState(item, true);
        }

        function toggleDropdown(item) {
            const isOpen = item.classList.contains(
                "saidpl-nav-item--open"
            );

            clearDropdownTimer(item);

            if (isOpen) {
                closeDropdown(item);
            } else {
                openDropdown(item);
            }
        }

        /* =================================================
           3. DESKTOP HOVER DELAYS
           ================================================= */

        function scheduleDropdownOpen(item) {
            clearDropdownTimer(item);

            const timer = window.setTimeout(() => {
                if (
                    !mobileQuery.matches &&
                    item.matches(":hover")
                ) {
                    openDropdown(item);
                }

                timers.delete(item);
            }, HOVER_OPEN_DELAY);

            timers.set(item, timer);
        }

        function scheduleDropdownClose(item) {
            clearDropdownTimer(item);

            const timer = window.setTimeout(() => {
                const pointerInside = item.matches(":hover");
                const focusInside = item.contains(
                    document.activeElement
                );

                if (!pointerInside && !focusInside) {
                    closeDropdown(item);
                }

                timers.delete(item);
            }, HOVER_CLOSE_DELAY);

            timers.set(item, timer);
        }

        dropdownItems.forEach((item) => {
            const toggle = item.querySelector(
                ".saidpl-nav-dropdown-toggle"
            );

            if (!toggle) return;

            /* Mouse hover: desktop only */
            item.addEventListener("mouseenter", () => {
                if (!mobileQuery.matches) {
                    scheduleDropdownOpen(item);
                }
            });

            item.addEventListener("mouseleave", () => {
                if (!mobileQuery.matches) {
                    scheduleDropdownClose(item);
                }
            });

            /* Keyboard focus */
            item.addEventListener("focusin", () => {
                if (!mobileQuery.matches) {
                    clearDropdownTimer(item);
                    openDropdown(item);
                }
            });

            item.addEventListener("focusout", () => {
                if (!mobileQuery.matches) {
                    scheduleDropdownClose(item);
                }
            });

            /*
             * Click/tap toggle:
             * Works on both desktop and mobile.
             */
            toggle.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();

                toggleDropdown(item);
            });
        });

        /* =================================================
           4. MOBILE DRAWER OPEN/CLOSE
           ================================================= */

        function isMobileMenuOpen() {
            return menu.classList.contains(
                "saidpl-nav-menu--open"
            );
        }

        function openMobileMenu() {
            if (!mobileQuery.matches || isMobileMenuOpen()) {
                return;
            }

            previousFocusedElement = document.activeElement;

            menu.classList.add("saidpl-nav-menu--open");

            hamburger.classList.add(
                "saidpl-nav-hamburger--active"
            );

            backdrop.classList.add(
                "saidpl-nav-backdrop--visible"
            );

            document.body.classList.add("saidpl-nav-menu-open");

            hamburger.setAttribute("aria-expanded", "true");
            hamburger.setAttribute(
                "aria-label",
                "Close navigation menu"
            );

            backdrop.setAttribute("aria-hidden", "false");

            /*
             * Move keyboard focus into the drawer.
             * Use the first link as the initial focus target.
             */
            const firstLink = menu.querySelector(
                ".saidpl-nav-link"
            );

            if (firstLink) {
                firstLink.focus({ preventScroll: true });
            }
        }

        function closeMobileMenu(options = {}) {
            const { returnFocus = false } = options;

            menu.classList.remove("saidpl-nav-menu--open");

            hamburger.classList.remove(
                "saidpl-nav-hamburger--active"
            );

            backdrop.classList.remove(
                "saidpl-nav-backdrop--visible"
            );

            document.body.classList.remove("saidpl-nav-menu-open");

            hamburger.setAttribute("aria-expanded", "false");
            hamburger.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

            backdrop.setAttribute("aria-hidden", "true");

            closeAllDropdowns();

            if (returnFocus && mobileQuery.matches) {
                hamburger.focus({ preventScroll: true });
            }
        }

        function toggleMobileMenu() {
            if (isMobileMenuOpen()) {
                closeMobileMenu({ returnFocus: true });
            } else {
                openMobileMenu();
            }
        }

        hamburger.addEventListener("click", toggleMobileMenu);

        /* Dedicated drawer close button */
        const drawerClose = document.getElementById("saidplNavDrawerClose");
        if (drawerClose) {
            drawerClose.addEventListener("click", () => {
                closeMobileMenu({ returnFocus: true });
            });
        }

        /* Backdrop closes the drawer */
        backdrop.addEventListener("click", () => {
            closeMobileMenu({ returnFocus: true });
        });

        /* Close drawer after following a navigation link */
        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                if (mobileQuery.matches) {
                    closeMobileMenu();
                }
            });
        });

        function getPageFilename(path) {
            const clean = (path || "").split("?")[0].split("#")[0].replace(/\/$/, "");
            const parts = clean.split("/").filter(Boolean);
            const last = parts.length > 0 ? parts[parts.length - 1].toLowerCase() : "";
            if (!last || last === "index.html" || last.indexOf(".") === -1) {
                return "index.html";
            }
            return last;
        }

        /* Mark active menu item based on current location */
        const currentPage = getPageFilename(window.location.pathname);
        menu.querySelectorAll(".saidpl-nav-item").forEach((item) => {
            const mainLink = item.querySelector(".saidpl-nav-link");
            if (mainLink) {
                const href = mainLink.getAttribute("href") || "";
                const linkPage = getPageFilename(href);
                if (currentPage === linkPage) {
                    item.classList.add("saidpl-nav-item--active");
                }
            }
        });

        /* =================================================
           5. OUTSIDE CLICK
           ================================================= */

        document.addEventListener("click", (event) => {
            if (!header.contains(event.target)) {
                closeAllDropdowns();
            }
        });

        /* =================================================
           6. ESCAPE KEY
           ================================================= */

        document.addEventListener("keydown", (event) => {
            if (event.key !== "Escape") return;

            if (isMobileMenuOpen()) {
                closeMobileMenu({ returnFocus: true });
                return;
            }

            const openItem = dropdownItems.find((item) =>
                item.classList.contains("saidpl-nav-item--open")
            );

            if (openItem) {
                const toggle = openItem.querySelector(
                    ".saidpl-nav-dropdown-toggle"
                );

                closeDropdown(openItem);

                if (toggle) {
                    toggle.focus();
                }
            }
        });

        /* =================================================
           7. RESPONSIVE BREAKPOINT CHANGES
           ================================================= */

        function handleBreakpointChange() {
            dropdownItems.forEach(clearDropdownTimer);
            closeAllDropdowns();

            /*
             * Reset mobile-only classes when switching layouts.
             */
            menu.classList.remove("saidpl-nav-menu--open");

            hamburger.classList.remove(
                "saidpl-nav-hamburger--active"
            );

            backdrop.classList.remove(
                "saidpl-nav-backdrop--visible"
            );

            document.body.classList.remove("saidpl-nav-menu-open");

            hamburger.setAttribute("aria-expanded", "false");
            hamburger.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

            backdrop.setAttribute("aria-hidden", "true");
        }

        if (typeof mobileQuery.addEventListener === "function") {
            mobileQuery.addEventListener(
                "change",
                handleBreakpointChange
            );
        } else {
            /* Legacy Safari support */
            mobileQuery.addListener(handleBreakpointChange);
        }

        /* =================================================
           8. CLEAN INITIAL STATE & ACTIVE LINK
           ================================================= */

        closeAllDropdowns();

        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute(
            "aria-label",
            "Open navigation menu"
        );

        backdrop.setAttribute("aria-hidden", "true");

        function highlightActiveNavLinks() {
            const currentPage = getPageFilename(window.location.pathname);
            const links = menu.querySelectorAll(".saidpl-nav-link, .saidpl-nav-dropdown-link");
            links.forEach((link) => {
                link.classList.remove("saidpl-nav-link--active", "saidpl-nav-dropdown-link--active");
                const href = link.getAttribute("href");
                if (!href) return;
                const linkPage = getPageFilename(href);
                if (currentPage === linkPage) {
                    if (link.classList.contains("saidpl-nav-dropdown-link")) {
                        link.classList.add("saidpl-nav-dropdown-link--active");
                        const parentItem = link.closest(".saidpl-nav-item--has-dropdown");
                        if (parentItem) {
                            const parentLink = parentItem.querySelector(".saidpl-nav-link");
                            if (parentLink) parentLink.classList.add("saidpl-nav-link--active");
                        }
                    } else {
                        link.classList.add("saidpl-nav-link--active");
                    }
                }
            });
        }

        highlightActiveNavLinks();
    }

    /* =====================================================
       INITIALIZE AFTER DOM IS READY & COMPONENTS ARE LOADED
       ===================================================== */

    document.addEventListener("saidpl:components-ready", initSaidplNavbar);

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initSaidplNavbar,
            { once: true }
        );
    } else {
        initSaidplNavbar();
    }
})();
