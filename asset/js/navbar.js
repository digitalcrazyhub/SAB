document.addEventListener('DOMContentLoaded', () => {
    const siteHeader = document.getElementById('saidplNavHeader');
    const menuToggle = document.getElementById('saidplNavHamburger');
    const navMenu = document.getElementById('saidplNavMenu');
    const navBackdrop = document.getElementById('saidplNavBackdrop');
    const dropdownItems = document.querySelectorAll('.saidpl-nav-item--has-dropdown');

    // 1. Header scroll blur & border shadow on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            siteHeader.classList.add('saidpl-nav-header--scrolled');
        } else {
            siteHeader.classList.remove('saidpl-nav-header--scrolled');
        }
    });

    // 2. Mobile Off-Canvas Drawer Toggle
    function toggleMobileMenu() {
        const isOpen = navMenu.classList.toggle('saidpl-nav-menu--open');
        menuToggle.classList.toggle('saidpl-nav-hamburger--active');
        navBackdrop.classList.toggle('saidpl-nav-backdrop--visible');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMobileMenu() {
        navMenu.classList.remove('saidpl-nav-menu--open');
        menuToggle.classList.remove('saidpl-nav-hamburger--active');
        navBackdrop.classList.remove('saidpl-nav-backdrop--visible');
        document.body.style.overflow = '';
        dropdownItems.forEach(item => item.classList.remove('saidpl-nav-item--open'));
    }

    menuToggle.addEventListener('click', toggleMobileMenu);
    navBackdrop.addEventListener('click', closeMobileMenu);

    // 3. Mobile Accordion Submenu Trigger
    dropdownItems.forEach(item => {
        const trigger = item.querySelector('.saidpl-nav-dropdown-toggle');
        if (trigger) {
            trigger.addEventListener('click', (e) => {
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    e.stopPropagation();

                    dropdownItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('saidpl-nav-item--open');
                        }
                    });

                    item.classList.toggle('saidpl-nav-item--open');
                }
            });
        }
    });

    // 4. Close drawer on window resize above mobile breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            closeMobileMenu();
        }
    });

    // 5. Close drawer when Escape key is pressed
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('saidpl-nav-menu--open')) {
            closeMobileMenu();
        }
    });
});