/* ============================================================
   SAIDPL FLOATING ACTION BUTTONS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    const toTopButton =
        document.getElementById('saidplToTop');


    if (!toTopButton) {
        return;
    }


    /* ========================================================
       SCROLL TO TOP VISIBILITY
       ======================================================== */

    const updateToTopButton = () => {

        if (window.scrollY > 400) {

            toTopButton.classList.add(
                'saidpl-show'
            );

        } else {

            toTopButton.classList.remove(
                'saidpl-show'
            );

        }

    };


    /* ========================================================
       SCROLL EVENT
       ======================================================== */

    window.addEventListener(
        'scroll',
        updateToTopButton,
        {
            passive: true
        }
    );


    /* Run once when page loads */

    updateToTopButton();


    /* ========================================================
       SCROLL TO TOP
       ======================================================== */

    toTopButton.addEventListener(
        'click',
        () => {

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        }
    );

});