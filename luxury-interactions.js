// Top Brands scroll functionality
const brandsList = document.querySelector('.brands-list');
const leftChevron = document.querySelector('.chevron.left');
const rightChevron = document.querySelector('.chevron.right');

if (leftChevron && brandsList) {
    leftChevron.addEventListener('click', () => {
        brandsList.scrollBy({ left: -200, behavior: 'smooth' });
    });
}

if (rightChevron && brandsList) {
    rightChevron.addEventListener('click', () => {
        brandsList.scrollBy({ left: 200, behavior: 'smooth' });
    });
}

// Set active class on Home link
document.querySelector('.nav-list a[href="#home"]').classList.add('active');

// Hamburger menu toggle
const menuToggle = document.getElementById('menu-toggle');
const menuOverlay = document.querySelector('.menu-overlay');
const body = document.body;

if (menuToggle && menuOverlay) {
    menuToggle.addEventListener('change', () => {
        if (menuToggle.checked) {
            menuOverlay.classList.add('show');
            body.classList.add('no-scroll');
        } else {
            menuOverlay.classList.remove('show');
            body.classList.remove('no-scroll');
        }
    });
}

