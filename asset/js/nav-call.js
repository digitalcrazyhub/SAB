/**
 * NAV-CALL.JS - Component Loader
 * 
 * Loads navbar and footer components dynamically from includes folder.
 * Ensures proper initialization order:
 * 1. Components are loaded
 * 2. Components are injected into placeholders
 * 3. navbar.js initializes after injection
 */

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Load both components
        await loadComponent("#saidplNavHeader", "/asset/includes/navbar.html");
        await loadComponent("#saidplFooter", "/asset/includes/footer.html");
        
        // After components are loaded, trigger navbar initialization
        // navbar.js will check for elements and initialize
    } catch (error) {
        console.error('Error loading components:', error);
    }
});

async function loadComponent(selector, file) {
    const element = document.querySelector(selector);

    if (!element) {
        console.warn(`Placeholder not found: ${selector}`);
        return;
    }

    try {
        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Failed to load: ${file} (Status: ${response.status})`);
        }

        element.innerHTML = await response.text();

    } catch (error) {
        console.error(`Failed to load navbar/footer: ${error.message}`);
    }
}
