/**
 * SRI AMMA INDUSTRIAL DEVELOPERS PVT LTD — LEGAL PAGES MODULE
 * Handles Table of Contents Scrollspy, Smooth Anchor Navigation,
 * Mobile TOC Toggle, and Document Print Trigger.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. Mobile TOC Toggle
    const mobileToggle = document.getElementById('legalTocMobileToggle');
    const tocCard = document.getElementById('legalTocCard');

    if (mobileToggle && tocCard) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = tocCard.classList.toggle('is-open');
            mobileToggle.classList.toggle('is-open', isOpen);
            mobileToggle.setAttribute('aria-expanded', String(isOpen));
        });
    }

    // 2. Smooth Scrolling for TOC Links with Navbar Offset
    const tocLinks = Array.from(document.querySelectorAll('.legal-toc-link'));
    const scrollArea = document.querySelector('.legal-toc-scroll-area');

    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();

                    // Close mobile TOC if open
                    if (tocCard && tocCard.classList.contains('is-open')) {
                        tocCard.classList.remove('is-open');
                        if (mobileToggle) {
                            mobileToggle.classList.remove('is-open');
                            mobileToggle.setAttribute('aria-expanded', 'false');
                        }
                    }

                    // Calculate target offset considering fixed navbar
                    const navbar = document.querySelector('.saidpl-nav-header');
                    const navHeight = navbar ? navbar.offsetHeight : 80;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = Math.max(0, elementPosition - navHeight - 20);

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Update active TOC item manually on click
                    tocLinks.forEach(l => l.classList.remove('is-active'));
                    link.classList.add('is-active');

                    // Update URL hash safely without triggering jump
                    if (history.replaceState) {
                        history.replaceState(null, null, targetId);
                    }
                }
            }
        });
    });

    // 3. Table of Contents Scrollspy (Safe Window Scroll Listener)
    const sections = Array.from(document.querySelectorAll('.legal-section[id]'));
    if (sections.length && tocLinks.length) {
        let isTicking = false;

        function updateActiveSection() {
            const navbar = document.querySelector('.saidpl-nav-header');
            const navHeight = navbar ? navbar.offsetHeight : 80;
            const scrollThreshold = window.scrollY + navHeight + 60;

            let currentActiveId = null;

            // Find section currently in view
            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section.offsetTop <= scrollThreshold) {
                    currentActiveId = section.getAttribute('id');
                    break;
                }
            }

            if (!currentActiveId && sections.length > 0) {
                currentActiveId = sections[0].getAttribute('id');
            }

            if (currentActiveId) {
                tocLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    const isActive = href === `#${currentActiveId}`;
                    link.classList.toggle('is-active', isActive);

                    // Safely scroll internal TOC container if link is out of view
                    // (NEVER calls link.scrollIntoView which causes whole page to jump to top!)
                    if (isActive && scrollArea) {
                        const linkTop = link.offsetTop;
                        const linkHeight = link.offsetHeight;
                        const containerScroll = scrollArea.scrollTop;
                        const containerHeight = scrollArea.clientHeight;

                        if (linkTop < containerScroll) {
                            scrollArea.scrollTop = Math.max(0, linkTop - 10);
                        } else if (linkTop + linkHeight > containerScroll + containerHeight) {
                            scrollArea.scrollTop = linkTop + linkHeight - containerHeight + 10;
                        }
                    }
                });
            }

            isTicking = false;
        }

        window.addEventListener('scroll', () => {
            if (!isTicking) {
                window.requestAnimationFrame(updateActiveSection);
                isTicking = true;
            }
        }, { passive: true });

        // Initial check
        updateActiveSection();
    }

    // 4. Print Document Action
    const printBtn = document.getElementById('legalPrintBtn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
});
