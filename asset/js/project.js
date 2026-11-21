/**
 * SRI AMMA BUILDER PVT LTD — PROJECTS PORTFOLIO & ACCESSIBLE LIGHTBOX MODULE
 * Supports Category Filtering, Keyboard Navigation, Focus Trapping & Mobile Gestures.
 */

document.addEventListener('DOMContentLoaded', () => {
    "use strict";

    /* ==========================================================================
       1. CATEGORY FILTERING ENGINE
       ========================================================================== */
    const filterBtns = Array.from(document.querySelectorAll('.project-filter-btn'));
    const allCards = Array.from(document.querySelectorAll('.project-card'));

    function getVisibleCards() {
        return allCards.filter(card => !card.classList.contains('is-hidden') && card.style.display !== 'none');
    }

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter || 'all';

                filterBtns.forEach(b => {
                    b.classList.toggle('is-active', b === btn);
                    b.setAttribute('aria-selected', String(b === btn));
                });

                allCards.forEach(card => {
                    const cardCategory = (card.dataset.category || '').toLowerCase();
                    const matches = filter === 'all' || cardCategory === filter.toLowerCase();

                    if (matches) {
                        card.classList.remove('is-hidden');
                        card.style.display = '';
                        setTimeout(() => card.classList.add('is-visible'), 20);
                    } else {
                        card.classList.add('is-hidden');
                        card.style.display = 'none';
                        card.classList.remove('is-visible');
                    }
                });
            });
        });
    }

    /* ==========================================================================
       3. ACCESSIBLE LIGHTBOX MODAL
       ========================================================================== */
    const modal = document.getElementById('lightboxModal');
    const dialog = modal?.querySelector('[role="dialog"]');
    const image = document.getElementById('lightboxImg');
    const title = document.getElementById('lightboxTitle');
    const description = document.getElementById('lightboxDesc');
    const closeButton = document.getElementById('lightboxClose');
    const previousButton = document.getElementById('lightboxPrev');
    const nextButton = document.getElementById('lightboxNext');
    let activeIndex = 0;
    let opener = null;

    if (!modal || !dialog || !image) return;

    const getProjectData = (card) => {
        const projectImage = card.querySelector('.project-img-box img') || card.querySelector('img');
        return {
            src: projectImage?.currentSrc || projectImage?.src || '',
            title: card.dataset.title || card.querySelector('.project-title')?.textContent.trim() || 'Project',
            description: card.dataset.desc || card.querySelector('.project-desc')?.textContent.trim() || ''
        };
    };

    const updateLightbox = (index) => {
        const visibleCards = getVisibleCards();
        if (!visibleCards.length) return;

        activeIndex = (index + visibleCards.length) % visibleCards.length;
        const project = getProjectData(visibleCards[activeIndex]);

        image.src = project.src;
        image.alt = project.title;
        if (title) title.textContent = project.title;
        if (description) description.textContent = project.description;

        const hideNavigation = visibleCards.length <= 1;
        previousButton?.classList.toggle('is-hidden', hideNavigation);
        nextButton?.classList.toggle('is-hidden', hideNavigation);
    };

    const closeLightbox = () => {
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightbox-open');
        opener?.focus();
    };

    const openLightbox = (card, trigger) => {
        const visibleCards = getVisibleCards();
        const cardIndex = visibleCards.indexOf(card);
        if (cardIndex === -1) return;

        opener = trigger || document.activeElement;
        updateLightbox(cardIndex);
        modal.classList.add('is-active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightbox-open');
        closeButton?.focus();
    };

    allCards.forEach((card) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        const projTitle = card.querySelector('.project-title')?.textContent.trim() || 'Project';
        card.setAttribute('aria-label', `View details for ${projTitle}`);

        card.addEventListener('click', () => openLightbox(card, card));
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openLightbox(card, card);
            }
        });
    });

    closeButton?.addEventListener('click', closeLightbox);
    modal.querySelector('#lightboxOverlay')?.addEventListener('click', closeLightbox);
    previousButton?.addEventListener('click', () => updateLightbox(activeIndex - 1));
    nextButton?.addEventListener('click', () => updateLightbox(activeIndex + 1));

    // Keyboard navigation & accessibility focus trap
    document.addEventListener('keydown', (event) => {
        if (!modal.classList.contains('is-active')) return;

        if (event.key === 'Escape') closeLightbox();
        if (event.key === 'ArrowLeft') updateLightbox(activeIndex - 1);
        if (event.key === 'ArrowRight') updateLightbox(activeIndex + 1);

        if (event.key === 'Tab') {
            const focusable = Array.from(dialog.querySelectorAll('button:not(.is-hidden), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
                .filter((el) => !el.hasAttribute('disabled'));
            const first = focusable[0];
            const last = focusable.at(-1);

            if (!first || !last) return;
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });
});
