// script.js

// Shopping Cart Functionality
class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.init();
    }

    init() {
        this.loadCart();
        this.bindEvents();
        this.updateCartDisplay();
    }

    bindEvents() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-add-cart') || 
                e.target.closest('.btn-add-cart')) {
                const button = e.target.classList.contains('btn-add-cart') ? 
                    e.target : e.target.closest('.btn-add-cart');
                this.addToCart(button);
            }
        });

        // Cart icon click
        document.querySelectorAll('.cart-icon').forEach(icon => {
            icon.addEventListener('click', () => this.toggleCart());
        });

        // Close cart
        document.querySelector('.close-cart').addEventListener('click', () => this.toggleCart());
        document.querySelector('.cart-overlay').addEventListener('click', () => this.toggleCart());

        // Remove items from cart
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item') || 
                e.target.closest('.remove-item')) {
                const button = e.target.classList.contains('remove-item') ? 
                    e.target : e.target.closest('.remove-item');
                const productName = button.dataset.product;
                this.removeFromCart(productName);
            }
        });

        // WhatsApp checkout
        document.querySelector('.whatsapp-checkout').addEventListener('click', () => {
            this.checkoutViaWhatsApp();
        });

        // Mobile menu
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const nav = document.querySelector('.nav');
        const mobileOverlay = document.createElement('div');
        mobileOverlay.className = 'mobile-overlay';
        document.body.appendChild(mobileOverlay);

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                nav.classList.toggle('active');
                mobileOverlay.classList.toggle('active');
                document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
            });

            mobileOverlay.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Dropdown menus for mobile
        document.querySelectorAll('.dropdown > a').forEach(dropdown => {
            dropdown.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const parent = dropdown.parentElement;
                    parent.classList.toggle('active');
                }
            });
        });

        // Search functionality
        const searchInput = document.getElementById('simpleSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterProducts(e.target.value);
            });
        }
    }

    addToCart(button) {
        const productName = button.dataset.product;
        const productPrice = parseInt(button.dataset.price);
        
        // Find product card for additional info
        const productCard = button.closest('.product-card');
        const productImage = productCard ? productCard.querySelector('img') : null;
        const imageSrc = productImage ? productImage.src : '';

        // Check if product already exists in cart
        const existingItem = this.items.find(item => item.name === productName);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                name: productName,
                price: productPrice,
                quantity: 1,
                image: imageSrc
            });
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showAddToCartAnimation(button);
    }

    removeFromCart(productName) {
        this.items = this.items.filter(item => item.name !== productName);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateCartDisplay() {
        // Update cart count
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(count => {
            count.textContent = totalItems;
        });

        // Update cart items
        const cartItems = document.querySelector('.cart-items');
        const totalAmount = document.querySelector('.total-amount');

        if (this.items.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; color: var(--gray); padding: 20px;">Your cart is empty</p>';
            totalAmount.textContent = '0';
            return;
        }

        // Calculate total
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalAmount.textContent = this.formatPrice(this.total);

        // Update cart items list
        cartItems.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <div style="display: flex; align-items: center; flex: 1;">
                    ${item.image ? 
                        `<div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'">
                        </div>` : 
                        '<div class="image-placeholder-small">No Image</div>'
                    }
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">₦${this.formatPrice(item.price)} × ${item.quantity}</div>
                    </div>
                </div>
                <button class="remove-item" data-product="${item.name}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }

    toggleCart() {
        const cartSidebar = document.querySelector('.cart-sidebar');
        const cartOverlay = document.querySelector('.cart-overlay');
        
        cartSidebar.classList.toggle('active');
        cartOverlay.classList.toggle('active');
        document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
    }

    showAddToCartAnimation(button) {
        // Create animation element
        const animation = document.createElement('div');
        animation.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
        animation.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary);
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 10000;
            box-shadow: var(--shadow);
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
        `;

        document.body.appendChild(animation);

        // Remove animation after 2 seconds
        setTimeout(() => {
            animation.style.opacity = '0';
            animation.style.transform = 'translateX(100px)';
            setTimeout(() => {
                document.body.removeChild(animation);
            }, 300);
        }, 2000);
    }

    checkoutViaWhatsApp() {
        if (this.items.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Format message for WhatsApp
        const message = this.formatWhatsAppMessage();
        const phoneNumber = '2348144277047'; // Replace with your WhatsApp business number
        
        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);
        
        // Create WhatsApp URL
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp in new tab
        window.open(whatsappURL, '_blank');
    }

    formatWhatsAppMessage() {
        let message = `ORDER FROM PETROSINI GLOBAL LIMITED\n\n`;
        message += `Hello! I would like to place an order:\n\n`;
        
        this.items.forEach((item, index) => {
            message += `*${index + 1}. ${item.name}*\n`;
            message += `   Quantity: ${item.quantity}\n`;
            message += `   Price: ₦${this.formatPrice(item.price)} each\n`;
            message += `   Subtotal: ₦${this.formatPrice(item.price * item.quantity)}\n\n`;
        });
        
        message += `TOTAL: ₦${this.formatPrice(this.total)}\n\n`;
        message += `Please process my order. Thank you!`;
        
        return message;
    }

    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    saveCart() {
        localStorage.setItem('petrosiniCart', JSON.stringify({
            items: this.items,
            total: this.total
        }));
    }

    loadCart() {
        const savedCart = localStorage.getItem('petrosiniCart');
        if (savedCart) {
            const cartData = JSON.parse(savedCart);
            this.items = cartData.items || [];
            this.total = cartData.total || 0;
        }
    }

    filterProducts(searchTerm) {
        const productCards = document.querySelectorAll('.product-card');
        const searchLower = searchTerm.toLowerCase();

        productCards.forEach(card => {
            const title = card.querySelector('.product-title').textContent.toLowerCase();
            const description = card.querySelector('.product-description').textContent.toLowerCase();
            
            if (title.includes(searchLower) || description.includes(searchLower)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// WhatsApp Button Functionality
class WhatsAppIntegration {
    constructor() {
        this.init();
    }

    init() {
        this.bindWhatsAppButtons();
    }

    bindWhatsAppButtons() {
    // General WhatsApp buttons
    document.addEventListener('click', (e) => {
        const target = e.target;
        const isWhatsAppButton = 
            target.classList.contains('whatsapp-btn') || 
            target.closest('.whatsapp-btn') ||
            target.classList.contains('whatsapp-only') ||
            target.closest('.whatsapp-only') ||
            target.classList.contains('whatsapp-contact') ||
            target.closest('.whatsapp-contact') ||
            target.classList.contains('whatsapp-btn-large') ||
            target.closest('.whatsapp-btn-large') ||
            target.classList.contains('mall-whatsapp') ||
            target.closest('.mall-whatsapp');
        
        // Only prevent default if it's actually a WhatsApp button, not a navigation link
        if (isWhatsAppButton && !target.closest('nav') && !target.closest('.nav')) {
            e.preventDefault();
            this.openWhatsApp();
        }
    });
}

    openWhatsApp(message = '') {
        const defaultMessage = 'Hello! I am interested in your products and services. Could you please provide more information?';
        const finalMessage = message || defaultMessage;
        const phoneNumber = '2348144277047'; // Replace with your WhatsApp business number
        
        const encodedMessage = encodeURIComponent(finalMessage);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappURL, '_blank');
    }
}

// Form Handling
class FormHandler {
    constructor() {
        this.init();
    }

    init() {
        this.bindForms();
    }

    bindForms() {
        // Contact form
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(contactForm);
            });
        }

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterForm(newsletterForm);
            });
        }
    }

    handleContactForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.name || !data.email || !data.subject || !data.message) {
            this.showNotification('Please fill in all required fields.', 'error');
            return;
        }

        // Format WhatsApp message for contact form
        const message = `CONTACT FORM SUBMISSION - PETROSINI GLOBAL\n\n` +
                       `Name: ${data.name}\n` +
                       `Email: ${data.email}\n` +
                       `Phone: ${data.phone || 'Not provided'}\n` +
                       `Subject: ${data.subject}\n` +
                       `Message: ${data.message}\n\n` +
                       `Please respond to this inquiry.`;

        // Open WhatsApp with the message
        const phoneNumber = '2348144277047';
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappURL, '_blank');
        
        // Show success message
        this.showNotification('Thank you! Your message has been prepared for WhatsApp.', 'success');
        form.reset();
    }

    handleNewsletterForm(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        if (!this.isValidEmail(email)) {
            this.showNotification('Please enter a valid email address.', 'error');
            return;
        }

        this.showNotification('Thank you for subscribing to our newsletter!', 'success');
        form.reset();
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const bgColor = type === 'success' ? 'var(--primary)' : 
                       type === 'error' ? 'var(--secondary)' : 'var(--dark)';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 15px 25px;
            border-radius: 4px;
            z-index: 10000;
            box-shadow: var(--shadow);
            font-weight: 600;
            transform: translateX(100px);
            opacity: 0;
            transition: all 0.3s ease;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 100);

        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize shopping cart
    window.shoppingCart = new ShoppingCart();
    
    // Initialize WhatsApp integration
    window.whatsappIntegration = new WhatsAppIntegration();
    
    // Initialize form handler
    window.formHandler = new FormHandler();

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Handle page transitions
window.addEventListener('beforeunload', function() {
    document.body.style.opacity = '0';
});

// Error handling for images
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
        });
    });
})
// Update Real Estate buttons on both pages
function updateRealEstateButtons() {
    console.log('Updating real estate buttons...');
    
    // Update Real Estate section on categories page
    const realEstateSection = document.getElementById('real-estate');
    if (realEstateSection) {
        const viewDetailsButtons = realEstateSection.querySelectorAll('a.btn-view-details');
        console.log(`Found ${viewDetailsButtons.length} real estate buttons on categories page`);
        
        viewDetailsButtons.forEach((button, index) => {
            updateButtonToWhatsApp(button, index);
        });
    }
    
    // Update residential plot on homepage
    updateHomepageRealEstate();
}

// Update residential plot on homepage
function updateHomepageRealEstate() {
    // Find the residential plot product card on homepage
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productTitle = card.querySelector('.product-title');
        if (productTitle && productTitle.textContent.includes('Residential Plot')) {
            console.log('Found residential plot on homepage');
            
            const viewDetailsButton = card.querySelector('a.btn-view-details');
            if (viewDetailsButton) {
                console.log('Updating homepage residential plot button');
                updateButtonToWhatsApp(viewDetailsButton, 'homepage');
            }
        }
    });
}

// Common function to update any button to WhatsApp
function updateButtonToWhatsApp(button, identifier) {
    console.log(`Updating button ${identifier}`);
    
    // Change button text to Contact for Details
    button.innerHTML = '<i class="fab fa-whatsapp"></i> Contact for Details';
    button.removeAttribute('href');
    button.style.cursor = 'pointer';
    
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const productCard = this.closest('.product-card');
        const productTitle = productCard.querySelector('.product-title').textContent;
        const productPrice = productCard.querySelector('.current-price').textContent;
        
        // Simple WhatsApp message for land inquiry
        let message = `Hello Petrosini Global Limited,\n\n`;
        message += `I'm interested in this property:\n`;
        message += `• ${productTitle}\n`;
        message += `• ${productPrice}\n\n`;
        message += `Please contact me with more details.`;
        
        const encodedMessage = encodeURIComponent(message);
        const phoneNumber = "2348144277047"; // Your WhatsApp number
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        console.log('Opening WhatsApp for:', productTitle);
        window.open(whatsappURL, '_blank');
    });
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing real estate buttons');
    updateRealEstateButtons();
});

// Also try after a short delay in case of dynamic content
setTimeout(updateRealEstateButtons, 1000)
// Close mobile menu when ANY menu link is clicked EXCEPT dropdown triggers
function closeMobileMenuOnLinkClick() {
    const navLinks = document.querySelectorAll('.nav-list a');
    const nav = document.querySelector('.nav');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // DON'T close menu if it's the Departments dropdown link
            if (this.parentElement.classList.contains('dropdown')) {
                return; // Exit without closing menu
            }
            
            // Close the mobile menu for all other links
            nav.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}
// Add this to your DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing code ...
    closeMobileMenuOnLinkClick(); // Add this line
});
// Add to your existing DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // Product request button
    const productRequestBtn = document.querySelector('.product-request-btn');
    if (productRequestBtn) {
        productRequestBtn.addEventListener('click', function() {
            const message = "Hello Petrosini Global! I couldn't find the product I'm looking for. I need: [Please describe your product here]";
            const encodedMessage = encodeURIComponent(message);
            const phoneNumber = "2348144277047";
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            window.open(whatsappURL, '_blank');
        });
    }

    // Mall booking button
    const mallBookingBtn = document.querySelector('.mall-booking-btn');
    if (mallBookingBtn) {
        mallBookingBtn.addEventListener('click', function() {
            const message = "Hello Petrosini Global! I want to book a spot at Asaba Modern Mall. Please contact me with more information.";
            const encodedMessage = encodeURIComponent(message);
            const phoneNumber = "2348144277047";
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            window.open(whatsappURL, '_blank');
        });
    }

    // Lands search functionality
    const landsSearch = document.getElementById('landsSearch');
    if (landsSearch) {
        landsSearch.addEventListener('input', function(e) {
            filterProductsInSection(e.target.value, 'real-estate');
        });
    }

    // Generators search functionality
    const generatorsSearch = document.getElementById('generatorsSearch');
    if (generatorsSearch) {
        generatorsSearch.addEventListener('input', function(e) {
            filterProductsInSection(e.target.value, 'generators');
        });
    }
});

// Helper function to filter products in specific sections
function filterProductsInSection(searchTerm, sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const productCards = section.querySelectorAll('.product-card');
    const searchLower = searchTerm.toLowerCase();

    productCards.forEach(card => {
        const title = card.querySelector('.product-title').textContent.toLowerCase();
        const description = card.querySelector('.product-description').textContent.toLowerCase();
        
        if (title.includes(searchLower) || description.includes(searchLower)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}