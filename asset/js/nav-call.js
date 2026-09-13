document.addEventListener("DOMContentLoaded", () => {
    loadComponent("#saidplNavHeader", "asset/includes/navbar.html");
    loadComponent("#saidplFooter", "asset/includes/footer.html");
});

async function loadComponent(selector, file) {
    const element = document.querySelector(selector);

    if (!element) return;

    try {
        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Failed to load: ${file}`);
        }

        element.innerHTML = await response.text();

    } catch (error) {
        console.error(error);
    }
}