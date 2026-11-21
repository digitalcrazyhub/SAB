/**
 * ==============================================================================
 * SRI AMMA BUILDER PVT LTD — COMPLETE REWRITTEN NAVBAR CONTROLLER
 * Authoritative Controller for Desktop Navigation and Mobile Drawer.
 * Clean State Manager, Strict ARIA Accessibility, Focus Trap & Scroll Locking.
 * ==============================================================================
 */

(() => {
    "use strict";

    function initSaidplNavbar() {
        const header = document.getElementById("saidplNavHeaderElement");
        const hamburger = document.getElementById("saidplNavHamburger");
        const backdrop = document.getElementById("saidplMobileBackdrop");
        const drawer = document.getElementById("saidplMobileDrawer");
        const drawerClose = document.getElementById("saidplDrawerClose");
        const servicesToggle = document.getElementById("saidplDrawerServicesToggle");

        /* Safety guard: verify all critical DOM elements are present */
        if (!header || !hamburger || !backdrop || !drawer) {
            return;
        }

        /* Prevent duplicate initialization if lifecycle triggers multiple times */
        if (header.dataset.saidplNavInit === "true") {
            return;
        }
        header.dataset.saidplNavInit = "true";

        const mobileQuery = window.matchMedia("(max-width: 1024px)");
        let previousActiveElement = null;
        let isScrollTicking = false;

        /* ==========================================================================
           1. UNIFIED STATE MANAGER
           ========================================================================== */
        const state = {
            isOpen: false,

            open() {
                if (this.isOpen) return;
                this.isOpen = true;

                previousActiveElement = document.activeElement;

                /* Visual and animation states */
                drawer.classList.add("saidpl-mobile-drawer--open");
                backdrop.classList.add("saidpl-mobile-backdrop--visible");
                hamburger.classList.add("saidpl-nav-hamburger--active");
                document.body.classList.add("saidpl-nav-locked");

                /* ARIA accessibility state */
                hamburger.setAttribute("aria-expanded", "true");
                hamburger.setAttribute("aria-label", "Close mobile navigation menu");
                drawer.setAttribute("aria-hidden", "false");
                backdrop.setAttribute("aria-hidden", "false");

                /* Focus initial interactive control */
                if (drawerClose) {
                    drawerClose.focus({ preventScroll: true });
                }
            },

            close(returnFocus = false) {
                if (!this.isOpen) return;
                this.isOpen = false;

                /* Visual states */
                drawer.classList.remove("saidpl-mobile-drawer--open");
                backdrop.classList.remove("saidpl-mobile-backdrop--visible");
                hamburger.classList.remove("saidpl-nav-hamburger--active");
                document.body.classList.remove("saidpl-nav-locked");

                /* ARIA accessibility state */
                hamburger.setAttribute("aria-expanded", "false");
                hamburger.setAttribute("aria-label", "Open mobile navigation menu");
                drawer.setAttribute("aria-hidden", "true");
                backdrop.setAttribute("aria-hidden", "true");

                /* Restore keyboard focus */
                if (returnFocus && previousActiveElement && typeof previousActiveElement.focus === "function") {
                    previousActiveElement.focus({ preventScroll: true });
                } else if (returnFocus && hamburger) {
                    hamburger.focus({ preventScroll: true });
                }
            },

            toggle() {
                if (this.isOpen) {
                    this.close(true);
                } else {
                    this.open();
                }
            }
        };

        /* ==========================================================================
           2. EVENT LISTENERS: OPEN, CLOSE, BACKDROP & ESCAPE
           ========================================================================== */

        hamburger.addEventListener("click", (e) => {
            e.preventDefault();
            state.toggle();
        });

        if (drawerClose) {
            drawerClose.addEventListener("click", (e) => {
                e.preventDefault();
                state.close(true);
            });
        }

        backdrop.addEventListener("click", () => {
            state.close(true);
        });

        /* Close drawer when following any navigation link */
        drawer.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                if (mobileQuery.matches) {
                    state.close(false);
                }
            });
        });

        /* ==========================================================================
           3. SERVICES ACCORDION FUNCTIONALITY
           ========================================================================== */
        if (servicesToggle) {
            servicesToggle.addEventListener("click", (e) => {
                e.preventDefault();
                const parentItem = servicesToggle.closest(".saidpl-drawer-item");
                if (!parentItem) return;

                const isExpanded = parentItem.classList.contains("saidpl-drawer-item--open");
                parentItem.classList.toggle("saidpl-drawer-item--open", !isExpanded);
                servicesToggle.setAttribute("aria-expanded", String(!isExpanded));
            });
        }

        /* ==========================================================================
           4. KEYBOARD TRAP & ESCAPE ACCESSIBILITY
           ========================================================================== */
        document.addEventListener("keydown", (e) => {
            if (!state.isOpen) return;

            /* Escape key closes the drawer immediately */
            if (e.key === "Escape") {
                e.preventDefault();
                state.close(true);
                return;
            }

            /* Focus trap within open drawer */
            if (e.key === "Tab") {
                const focusables = drawer.querySelectorAll(
                    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
                );

                if (!focusables.length) return;

                const firstFocusable = focusables[0];
                const lastFocusable = focusables[focusables.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });

        /* ==========================================================================
           5. RESPONSIVE BREAKPOINT RESET
           ========================================================================== */
        function onBreakpointChange(e) {
            if (!e.matches && state.isOpen) {
                state.close(false);
            }
        }

        if (typeof mobileQuery.addEventListener === "function") {
            mobileQuery.addEventListener("change", onBreakpointChange);
        } else {
            mobileQuery.addListener(onBreakpointChange);
        }

        /* ==========================================================================
           6. STICKY HEADER SCROLL SHADOW EFFECT
           ========================================================================== */
        function updateHeaderScrollState() {
            header.classList.toggle("saidpl-nav-header--scrolled", window.scrollY > 10);
            isScrollTicking = false;
        }

        window.addEventListener("scroll", () => {
            if (!isScrollTicking) {
                isScrollTicking = true;
                window.requestAnimationFrame(updateHeaderScrollState);
            }
        }, { passive: true });

        updateHeaderScrollState();

        /* ==========================================================================
           7. ACTIVE PAGE HIGHLIGHTER
           ========================================================================== */
        function getPageFilename(url) {
            const clean = (url || "").split("?")[0].split("#")[0].replace(/\/$/, "");
            const parts = clean.split("/").filter(Boolean);
            const last = parts.length > 0 ? parts[parts.length - 1].toLowerCase() : "";
            if (!last || last === "index.html" || last.indexOf(".") === -1) {
                return "index.html";
            }
            return last;
        }

        function highlightActiveLinks() {
            const currentPage = getPageFilename(window.location.pathname);

            /* 1. Desktop Links */
            header.querySelectorAll(".saidpl-desktop-link, .saidpl-desktop-dropdown-link").forEach((link) => {
                link.classList.remove("saidpl-desktop-link--active", "saidpl-desktop-dropdown-link--active");
                link.removeAttribute("aria-current");

                const href = link.getAttribute("href") || "";
                if (getPageFilename(href) === currentPage) {
                    if (link.classList.contains("saidpl-desktop-dropdown-link")) {
                        link.classList.add("saidpl-desktop-dropdown-link--active");
                        const parentDropdownItem = link.closest(".saidpl-desktop-item--dropdown");
                        if (parentDropdownItem) {
                            const parentLink = parentDropdownItem.querySelector(".saidpl-desktop-link");
                            if (parentLink) parentLink.classList.add("saidpl-desktop-link--active");
                        }
                    } else {
                        link.classList.add("saidpl-desktop-link--active");
                    }
                    link.setAttribute("aria-current", "page");
                }
            });

            /* 2. Mobile Drawer Links */
            drawer.querySelectorAll(".saidpl-drawer-link, .saidpl-drawer-sublink").forEach((link) => {
                link.classList.remove("saidpl-drawer-link--active", "saidpl-drawer-sublink--active");
                link.removeAttribute("aria-current");

                const parentItem = link.closest(".saidpl-drawer-item");
                if (parentItem) parentItem.classList.remove("saidpl-drawer-item--active");

                const href = link.getAttribute("href") || "";
                if (getPageFilename(href) === currentPage) {
                    if (link.classList.contains("saidpl-drawer-sublink")) {
                        link.classList.add("saidpl-drawer-sublink--active");
                        const parentAccordion = link.closest(".saidpl-drawer-item--has-submenu");
                        if (parentAccordion) {
                            parentAccordion.classList.add("saidpl-drawer-item--open", "saidpl-drawer-item--active");
                            if (servicesToggle) servicesToggle.setAttribute("aria-expanded", "true");
                        }
                    } else {
                        link.classList.add("saidpl-drawer-link--active");
                        if (parentItem) parentItem.classList.add("saidpl-drawer-item--active");
                    }
                    link.setAttribute("aria-current", "page");
                }
            });
        }

        highlightActiveLinks();
    }

    /* ==========================================================================
       8. LIFECYCLE DISPATCH INITIALIZATION
       ========================================================================== */
    document.addEventListener("saidpl:components-ready", initSaidplNavbar);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSaidplNavbar, { once: true });
    } else {
        initSaidplNavbar();
    }
})();
