// Luxury Interactions JavaScript
// Handles all interactive features for Authentic Only website

class LuxuryInteractions {
    constructor() {
        this.init();
    }

    init() {
        this.setupSideMenu();
        this.setupShoppingCart();
        this.setupProductInteractions();
        this.setupNewsletterValidation();
        this.setupScrollAnimations();
        this.setupAuthSteps();
        this.loadCartFromStorage();
    }

    // 1. Unique Side Menu Functionality
    setupSideMenu() {
        // Create side menu HTML if it doesn't exist
        if (!document.querySelector('.side-menu')) {
            const sideMenuHTML = `
                <div class="side-menu-overlay"></div>
                <div class="side-menu">
                    <div class="side-menu-header">
                        <h3>More Options</h3>
                        <button class="close-menu">&times;</button>
                    </div>
                    <nav class="side-menu-nav">
                        <a href="#about" class="menu-item">About Us</a>
                        <a href="#contact" class="menu-item">Contact</a>
                        <a href="#support" class="menu-item">Support</a>
                        <a href="#faq" class="menu-item">FAQ</a>
                        <a href="#careers" class="menu-item">Careers</a>
                        <a href="#press" class="menu-item">Press</a>
                    </nav>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', sideMenuHTML);
        }

        // Event listeners
        const closeBtn = document.querySelector('.close-menu');
        const overlay = document.querySelector('.side-menu-overlay');
        const sideMenu = document.querySelector('.side-menu');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeSideMenu());
        }

        if (overlay) {
            overlay.addEventListener('click', () => this.closeSideMenu());
        }
    }

    openSideMenu() {
        const overlay = document.querySelector('.side-menu-overlay');
        const sideMenu = document.querySelector('.side-menu');
        const menuItems = document.querySelectorAll('.menu-item');

        if (overlay && sideMenu) {
            overlay.style.display = 'block';
            sideMenu.style.display = 'block';

            // Trigger animations
            setTimeout(() => {
                overlay.classList.add('active');
                sideMenu.classList.add('active');

                // Stagger menu items
                menuItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate-in');
                    }, index * 100);
                });
            }, 10);
        }
    }

    closeSideMenu() {
        const overlay = document.querySelector('.side-menu-overlay');
        const sideMenu = document.querySelector('.side-menu');
        const menuItems = document.querySelectorAll('.menu-item');

        if (overlay && sideMenu) {
            overlay.classList.remove('active');
            sideMenu.classList.remove('active');

            // Remove animations
            menuItems.forEach(item => item.classList.remove('animate-in'));

            setTimeout(() => {
                overlay.style.display = 'none';
                sideMenu.style.display = 'none';
            }, 300);
        }
    }

    // 2. Shopping Cart Management
    setupShoppingCart() {
        this.cart = [];
        this.updateCartCounter();

        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    const product = {
                        id: Date.now(),
                        name: productCard.querySelector('.product-name').textContent,
                        price: parseFloat(productCard.querySelector('.product-price').textContent.replace('$', '')),
                        image: productCard.querySelector('img').src
                    };
                    this.addToCart(product);
                }
            }

            if (e.target.classList.contains('remove-from-cart')) {
                const itemId = parseInt(e.target.dataset.id);
                this.removeFromCart(itemId);
            }
        });
    }

    addToCart(product) {
        this.cart.push(product);
        this.saveCartToStorage();
        this.updateCartCounter();
        this.showNotification(`${product.name} added to cart!`);
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCartToStorage();
        this.updateCartCounter();
    }

    updateCartCounter() {
        const counter = document.querySelector('.cart-counter');
        if (counter) {
            counter.textContent = this.cart.length;
            counter.style.display = this.cart.length > 0 ? 'flex' : 'none';
        }
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + item.price, 0);
    }

    saveCartToStorage() {
        localStorage.setItem('luxuryCart', JSON.stringify(this.cart));
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('luxuryCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.updateCartCounter();
        }
    }

    // 3. Product Interactions
    setupProductInteractions() {
        // Quick view modal
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-view-btn')) {
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    this.showQuickView(productCard);
                }
            }
        });

        // Add to wishlist
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('wishlist-btn')) {
                e.target.classList.toggle('active');
                const productName = e.target.closest('.product-card').querySelector('.product-name').textContent;
                this.showNotification(`${productName} ${e.target.classList.contains('active') ? 'added to' : 'removed from'} wishlist!`);
            }
        });

        // Smooth scroll to sections
        document.addEventListener('click', (e) => {
            if (e.target.matches('nav a[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    showQuickView(productCard) {
        const product = {
            name: productCard.querySelector('.product-name').textContent,
            price: productCard.querySelector('.product-price').textContent,
            image: productCard.querySelector('img').src,
            description: 'Experience unparalleled luxury with this meticulously crafted piece.'
        };

        const modalHTML = `
            <div class="quick-view-overlay">
                <div class="quick-view-modal">
                    <button class="close-modal">&times;</button>
                    <div class="modal-content">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="modal-details">
                            <h2>${product.name}</h2>
                            <p class="price">${product.price}</p>
                            <p class="description">${product.description}</p>
                            <button class="add-to-cart-btn">Add to Cart</button>
                            <button class="wishlist-btn">Add to Wishlist</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Close modal
        setTimeout(() => {
            const overlay = document.querySelector('.quick-view-overlay');
            const closeBtn = document.querySelector('.close-modal');

            const closeModal = () => {
                overlay.remove();
            };

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeModal();
            });

            closeBtn.addEventListener('click', closeModal);
        }, 100);
    }

    // 4. Newsletter Form Validation
    setupNewsletterValidation() {
        const newsletterForm = document.querySelector('.newsletter form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const emailInput = newsletterForm.querySelector('input[type="email"]');
                const submitBtn = newsletterForm.querySelector('button');

                // Prevent multiple submissions
                if (submitBtn.disabled) return;

                const email = emailInput.value.trim();

                if (!this.validateEmail(email)) {
                    this.showError(emailInput, 'Please enter a valid email address');
                    return;
                }

                // Simulate submission
                submitBtn.disabled = true;
                submitBtn.textContent = 'Subscribing...';

                setTimeout(() => {
                    this.showSuccess('Thank you for subscribing to our luxury newsletter!');
                    emailInput.value = '';
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Subscribe';
                }, 1500);
            });
        }
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showError(input, message) {
        // Remove existing error
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();

        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #D4AF37;
            font-size: 0.8rem;
            margin-top: 0.5rem;
            animation: fadeInUp 0.3s ease;
        `;

        input.parentNode.appendChild(errorDiv);
        input.style.borderColor = '#D4AF37';

        // Remove error after 3 seconds
        setTimeout(() => {
            errorDiv.remove();
            input.style.borderColor = '';
        }, 3000);
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
            color: #0A0E17;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
            z-index: 10000;
            animation: slideInRight 0.5s ease;
        `;

        document.body.appendChild(successDiv);

        setTimeout(() => {
            successDiv.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => successDiv.remove(), 500);
        }, 3000);
    }

    // 5. Scroll Animations
    setupScrollAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements that should animate on scroll
        document.querySelectorAll('.product-card, .step, .trust-item').forEach(el => {
            observer.observe(el);
        });

        // Parallax effect on hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroSection = document.querySelector('.hero-section');
            if (heroSection) {
                heroSection.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
            }
        });

        // Active navigation highlighting
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        const sections = document.querySelectorAll('section[id]');

        window.addEventListener('scroll', () => {
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop - sectionHeight / 3) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }

    // 6. Authentication Steps Animation
    setupAuthSteps() {
        const steps = document.querySelectorAll('.step');
        let currentStep = 0;

        steps.forEach((step, index) => {
            step.addEventListener('click', () => {
                this.activateStep(index);
            });
        });

        // Auto-progress through steps
        setInterval(() => {
            currentStep = (currentStep + 1) % steps.length;
            this.activateStep(currentStep);
        }, 4000);
    }

    activateStep(stepIndex) {
        const steps = document.querySelectorAll('.step');

        steps.forEach((step, index) => {
            if (index === stepIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    // Utility function for notifications
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(26, 29, 36, 0.95);
            color: #D4AF37;
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid #D4AF37;
            z-index: 10000;
            animation: slideInRight 0.5s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}

// Additional CSS for animations and modals
const additionalCSS = `
    .side-menu-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(10, 14, 23, 0.8);
        backdrop-filter: blur(5px);
        z-index: 999;
        opacity: 0;
        transition: opacity 0.3s ease;
        display: none;
    }

    .side-menu-overlay.active {
        opacity: 1;
    }

    .side-menu {
        position: fixed;
        top: 0;
        right: -350px;
        width: 350px;
        height: 100%;
        background: rgba(26, 29, 36, 0.98);
        backdrop-filter: blur(15px);
        border-left: 1px solid #2A2D34;
        z-index: 1000;
        transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: none;
        padding: 2rem;
    }

    .side-menu.active {
        right: 0;
    }

    .side-menu-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #2A2D34;
    }

    .side-menu-header h3 {
        color: #D4AF37;
        margin: 0;
    }

    .close-menu {
        background: none;
        border: none;
        color: #E5E4E2;
        font-size: 2rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: all 0.3s ease;
    }

    .close-menu:hover {
        background-color: rgba(212, 175, 55, 0.1);
        color: #D4AF37;
    }

    .side-menu-nav {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .menu-item {
        color: #E5E4E2;
        text-decoration: none;
        padding: 1rem;
        border-radius: 8px;
        transition: all 0.3s ease;
        transform: translateX(20px);
        opacity: 0;
    }

    .menu-item.animate-in {
        transform: translateX(0);
        opacity: 1;
    }

    .menu-item:hover {
        background-color: rgba(212, 175, 55, 0.1);
        color: #D4AF37;
        transform: translateX(10px);
    }

    .quick-view-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(10, 14, 23, 0.8);
        backdrop-filter: blur(10px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    }

    .quick-view-modal {
        background: rgba(26, 29, 36, 0.98);
        border: 1px solid #2A2D34;
        border-radius: 12px;
        padding: 2rem;
        max-width: 600px;
        width: 90%;
        position: relative;
        animation: scaleIn 0.3s ease;
    }

    .close-modal {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        color: #E5E4E2;
        font-size: 2rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: all 0.3s ease;
    }

    .close-modal:hover {
        background-color: rgba(212, 175, 55, 0.1);
        color: #D4AF37;
    }

    .modal-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        align-items: start;
    }

    .modal-content img {
        width: 100%;
        border-radius: 8px;
    }

    .modal-details h2 {
        color: #E5E4E2;
        margin-bottom: 0.5rem;
    }

    .modal-details .price {
        color: #D4AF37;
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
    }

    .modal-details .description {
        color: #CCCCCC;
        margin-bottom: 2rem;
        line-height: 1.6;
    }

    .modal-details button {
        margin-right: 1rem;
        margin-bottom: 0.5rem;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes scaleIn {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }

    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }

    .animate-in {
        animation: fadeInUp 0.8s ease-out forwards;
    }

    .step.active {
        transform: scale(1.05);
        box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
    }

    nav a.active::after {
        width: 100%;
    }

    @media (max-width: 768px) {
        .modal-content {
            grid-template-columns: 1fr;
        }

        .side-menu {
            width: 280px;
            right: -280px;
        }
    }
`;

// Add additional CSS to head
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LuxuryInteractions();
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Luxury Interactions Error:', e.error);
});

// Graceful degradation for older browsers
if (!window.IntersectionObserver) {
    console.warn('IntersectionObserver not supported. Scroll animations disabled.');
}
