'use strict';
{
    if (window.addEventListener) { window.addEventListener('load', init, false); }
    else { document.addEventListener('load', init, false); }

    function init() {
        const toggleMenu = function () {
            const elCheckBox = document.querySelector('.main-header nav input');
            elCheckBox.checked = !(elCheckBox.checked);
        }

        const elItems = document.querySelectorAll('.main-header nav ul li');
        elItems.forEach(item => {
            const elAnchor = item.querySelector('a');
            elAnchor.addEventListener('click', toggleMenu, false);
            const submenu = item.querySelector('ul');
            if (submenu) item.querySelector('ul').classList.add('submenu');
        });

    }
}

