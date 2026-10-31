(() => {
    'use strict';

    function getBaseUrl() {
        const scriptEl = document.querySelector('script[src*="nav-call.js"]');
        if (scriptEl && scriptEl.src) {
            try {
                // nav-call.js is located at <base>/asset/js/nav-call.js -> parent of parent is <base>/
                return new URL('../..', scriptEl.src).href.replace(/\/$/, '') + '/';
            } catch (e) {
                // fallback if URL constructor fails
            }
        }
        return './';
    }

    async function loadComponent(selector, relUrl) {
        const host = document.querySelector(selector);
        if (!host) return;

        host.setAttribute('aria-busy', 'true');

        const baseUrl = getBaseUrl();
        const fullUrl = new URL(relUrl.replace(/^\.?\//, ''), baseUrl).href;

        try {
            const response = await fetch(fullUrl, {
                credentials: 'same-origin'
            });

            if (!response.ok) {
                throw new Error(`${fullUrl} returned HTTP ${response.status}`);
            }

            host.innerHTML = await response.text();
        } finally {
            host.removeAttribute('aria-busy');
        }
    }

    function finishSharedComponents() {
        const year = document.getElementById('saidplCurrentYear');

        if (year) {
            year.textContent = String(new Date().getFullYear());
        }

        if (window.lucide) {
            window.lucide.createIcons();
        }

        document.dispatchEvent(
            new CustomEvent('saidpl:components-ready')
        );
    }

    document.addEventListener('DOMContentLoaded', async () => {
        const components = [
            ['#saidplNavHeader', './asset/includes/navbar.html'],
            ['#saidplFooter', './asset/includes/footer.html'],
            ['#saidplFloatingActions', './asset/includes/floating-actions.html']
        ];

        const results = await Promise.allSettled(
            components.map(([selector, url]) =>
                loadComponent(selector, url)
            )
        );

        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.error(
                    `Unable to load ${components[index][1]}:`,
                    result.reason
                );
            }
        });

        finishSharedComponents();
    }, { once: true });
})();