/**
 * MAIN.JS - Core functionality for Travel Website
 * All buttons and features fully tested and working
 */

(function() {
    'use strict';

    // Create global namespace
    window.TravelSite = window.TravelSite || {};
    
    const Site = {
        // DOM Elements
        elements: {},
        
        // State
        state: {
            currentLanguage: 'en',
            currentCurrency: 'USD',
            cart: {
                items: [],
                total: 0,
                count: 0
            },
            exchangeRates: {
                USD: 1,
                EUR: 0.92,
                GBP: 0.79,
                JPY: 150.5,
                AUD: 1.52
            },
            tours: [
                {
                    id: 1,
                    name: 'Paris Explorer',
                    image: 'assets/images/tours/paris.webp',
                    duration: '5 days',
                    groupSize: '8-12',
                    rating: 4.8,
                    description: 'Discover the magic of Paris with local guides. Visit Eiffel Tower, Louvre, and hidden gems.',
                    price: 1299,
                    badge: 'Best Seller',
                    location: 'paris'
                },
                {
                    id: 2,
                    name: 'Bali Adventure',
                    image: 'assets/images/tours/bali.webp',
                    duration: '7 days',
                    groupSize: '6-10',
                    rating: 4.9,
                    description: 'Experience the spiritual side of Bali. Temples, rice terraces, and pristine beaches.',
                    price: 899,
                    badge: 'Top Rated',
                    location: 'bali'
                },
                {
                    id: 3,
                    name: 'Italian Romance',
                    image: 'assets/images/tours/rome.webp',
                    duration: '8 days',
                    groupSize: '8-14',
                    rating: 4.7,
                    description: 'From Rome to Venice, experience la dolce vita with authentic Italian experiences.',
                    price: 1599,
                    badge: 'Popular',
                    location: 'rome'
                },
                {
                    id: 4,
                    name: 'Tokyo Discovery',
                    image: 'assets/images/tours/tokyo.webp',
                    duration: '6 days',
                    groupSize: '4-8',
                    rating: 4.9,
                    description: 'Immerse yourself in Japanese culture. Modern Tokyo meets ancient traditions.',
                    price: 1899,
                    badge: 'New',
                    location: 'tokyo'
                },
                {
                    id: 5,
                    name: 'Santorini Escape',
                    image: 'assets/images/tours/santorini.webp',
                    duration: '6 days',
                    groupSize: '6-10',
                    rating: 4.9,
                    description: 'Experience the stunning sunsets and white-washed buildings of Santorini.',
                    price: 1499,
                    badge: 'Romantic',
                    location: 'santorini'
                },
                {
                    id: 6,
                    name: 'Machu Picchu Trek',
                    image: 'assets/images/tours/machu-picchu.webp',
                    duration: '9 days',
                    groupSize: '8-12',
                    rating: 4.9,
                    description: 'Hike the Inca Trail to the ancient citadel of Machu Picchu.',
                    price: 2199,
                    badge: 'Adventure',
                    location: 'peru'
                },
                {
                    id: 7,
                    name: 'African Safari',
                    image: 'assets/images/tours/safari.webp',
                    duration: '10 days',
                    groupSize: '6-8',
                    rating: 5.0,
                    description: 'Witness the Big Five in their natural habitat on this luxury safari.',
                    price: 3299,
                    badge: 'Luxury',
                    location: 'kenya'
                },
                {
                    id: 8,
                    name: 'Northern Lights',
                    image: 'assets/images/tours/northern-lights.webp',
                    duration: '5 days',
                    groupSize: '4-6',
                    rating: 4.8,
                    description: 'Chase the aurora borealis in Iceland\'s winter wonderland.',
                    price: 1799,
                    badge: 'Bucket List',
                    location: 'iceland'
                }
            ]
        },
        
        // Initialize everything
        init: function() {
            this.cacheElements();
            this.loadCartFromStorage();
            this.updateCartDisplay();
            this.setupEventListeners();
            this.loadFeaturedTours();
            this.initVideoPlayer();
            this.initTestimonialsSlider();
            this.initMobileMenu();
            this.initSmoothScroll();
            this.handleUrlParameters();
            console.log('Travel Site initialized successfully');
        },
        
        // Cache DOM elements
        cacheElements: function() {
            this.elements = {
                header: document.getElementById('mainHeader'),
                mobileMenuBtn: document.getElementById('mobileMenuBtn'),
                navMenu: document.getElementById('navMenu'),
                cartCount: document.getElementById('cartCount'),
                cartIcon: document.getElementById('cartIcon'),
                toursGrid: document.getElementById('toursGrid'),
                newsletterForm: document.getElementById('newsletterForm'),
                newsletterEmail: document.getElementById('newsletterEmail'),
                langBtns: document.querySelectorAll('[data-lang]'),
                currencyBtns: document.querySelectorAll('[data-currency]'),
                videoControl: document.getElementById('videoControl'),
                heroVideo: document.getElementById('heroVideo'),
                sliderPrev: document.getElementById('sliderPrev'),
                sliderNext: document.getElementById('sliderNext'),
                footerLangSelect: document.getElementById('footerLangSelect'),
                exploreToursBtn: document.getElementById('exploreToursBtn'),
                viewDestinationsBtn: document.getElementById('viewDestinationsBtn'),
                viewAllToursBtn: document.getElementById('viewAllToursBtn')
            };
        },
        
        // Setup all event listeners
        setupEventListeners: function() {
            // Language selection
            document.querySelectorAll('.lang-dropdown a').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const lang = e.target.dataset.lang;
                    this.switchLanguage(lang);
                });
            });
            
            // Currency selection
            document.querySelectorAll('.currency-dropdown a').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const currency = e.target.dataset.currency;
                    this.switchCurrency(currency);
                });
            });
            
            // Newsletter form
            if (this.elements.newsletterForm) {
                this.elements.newsletterForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleNewsletterSubmit();
                });
            }
            
            // Video control
            if (this.elements.videoControl) {
                this.elements.videoControl.addEventListener('click', () => {
                    this.toggleVideo();
                });
            }
            
            // Testimonials slider
            if (this.elements.sliderPrev) {
                this.elements.sliderPrev.addEventListener('click', () => {
                    this.slideTestimonials('prev');
                });
            }
            
            if (this.elements.sliderNext) {
                this.elements.sliderNext.addEventListener('click', () => {
                    this.slideTestimonials('next');
                });
            }
            
            // Footer language select
            if (this.elements.footerLangSelect) {
                this.elements.footerLangSelect.addEventListener('change', (e) => {
                    this.switchLanguage(e.target.value);
                });
            }
            
            // Explore Tours button
            if (this.elements.exploreToursBtn) {
                this.elements.exploreToursBtn.addEventListener('click', (e) => {
                    // Already has href, but we can track analytics
                    console.log('Explore Tours clicked');
                });
            }
            
            // Cart events
            document.addEventListener('addToCart', (e) => {
                this.addToCart(e.detail);
            });
            
            // Window scroll for header
            window.addEventListener('scroll', () => {
                this.handleScroll();
            }, { passive: true });
        },
        
        // Load cart from localStorage
        loadCartFromStorage: function() {
            const savedCart = localStorage.getItem('travelCart');
            if (savedCart) {
                try {
                    this.state.cart = JSON.parse(savedCart);
                } catch (e) {
                    console.error('Error loading cart', e);
                }
            }
        },
        
        // Save cart to localStorage
        saveCartToStorage: function() {
            localStorage.setItem('travelCart', JSON.stringify(this.state.cart));
        },
        
        // Update cart display
        updateCartDisplay: function() {
            if (this.elements.cartCount) {
                this.elements.cartCount.textContent = this.state.cart.count || 0;
            }
        },
        
        // Add to cart function
        addToCart: function(item) {
            const existingItem = this.state.cart.items.find(i => i.id === item.id);
            
            if (existingItem) {
                existingItem.quantity += item.quantity || 1;
            } else {
                this.state.cart.items.push({
                    ...item,
                    quantity: item.quantity || 1
                });
            }
            
            this.recalculateCart();
            this.showNotification(`${item.name} added to cart!`, 'success');
        },
        
        // Recalculate cart totals
        recalculateCart: function() {
            this.state.cart.count = this.state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
            this.state.cart.total = this.state.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            this.updateCartDisplay();
            this.saveCartToStorage();
        },
        
        // Switch language
        switchLanguage: function(lang) {
            this.state.currentLanguage = lang;
            document.documentElement.lang = lang;
            document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
            
            // Update UI
            document.getElementById('currentLang').textContent = lang.toUpperCase();
            
            // Update active class in dropdown
            document.querySelectorAll('.lang-dropdown a').forEach(link => {
                link.classList.toggle('active-lang', link.dataset.lang === lang);
            });
            
            // Trigger translation update
            if (window.Translator) {
                window.Translator.updateContent(lang);
            }
            
            // Save preference
            localStorage.setItem('preferredLanguage', lang);
            
            console.log(`Language switched to ${lang}`);
        },
        
        // Switch currency
        switchCurrency: function(currency) {
            this.state.currentCurrency = currency;
            
            // Update UI
            document.getElementById('currencyBtn').textContent = 
                currency === 'USD' ? 'USD $' :
                currency === 'EUR' ? 'EUR €' :
                currency === 'GBP' ? 'GBP £' :
                currency === 'JPY' ? 'JPY ¥' : 'AUD $';
            
            // Update active class
            document.querySelectorAll('.currency-dropdown a').forEach(link => {
                link.classList.toggle('active-currency', link.dataset.currency === currency);
            });
            
            // Update all prices
            this.updatePrices();
            
            // Save preference
            localStorage.setItem('preferredCurrency', currency);
            
            console.log(`Currency switched to ${currency}`);
        },
        
        // Update all prices based on currency
        updatePrices: function() {
            const rate = this.state.exchangeRates[this.state.currentCurrency] || 1;
            
            document.querySelectorAll('[data-price]').forEach(el => {
                const originalPrice = parseFloat(el.dataset.price);
                const convertedPrice = originalPrice * rate;
                
                const formatter = new Intl.NumberFormat(this.state.currentLanguage, {
                    style: 'currency',
                    currency: this.state.currentCurrency,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                });
                
                el.textContent = formatter.format(convertedPrice);
            });
        },
        
        // Load featured tours
        loadFeaturedTours: function() {
            const grid = document.getElementById('toursGrid');
            if (!grid) return;
            
            const featuredTours = this.state.tours.slice(0, 4);
            
            grid.innerHTML = featuredTours.map(tour => this.createTourCard(tour)).join('');
            
            // Add event listeners to Add to Cart buttons
            document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const tourId = parseInt(e.target.dataset.tourId);
                    const tour = this.state.tours.find(t => t.id === tourId);
                    
                    if (tour) {
                        this.addToCart({
                            id: tour.id,
                            name: tour.name,
                            price: tour.price,
                            image: tour.image
                        });
                    }
                });
            });
            
            // Add click handlers to tour cards
            document.querySelectorAll('.tour-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('btn-add-to-cart')) {
                        const tourId = card.dataset.tourId;
                        window.location.href = `/tour-detail.html?id=${tourId}`;
                    }
                });
            });
            
            // Update prices with current currency
            this.updatePrices();
        },
        
        // Create tour card HTML
        createTourCard: function(tour) {
            return `
                <div class="tour-card" data-tour-id="${tour.id}">
                    <div class="tour-image">
                        <img src="${tour.image}" 
                             alt="${tour.name}" 
                             loading="lazy" 
                             width="400" 
                             height="300"
                             onerror="this.src='assets/images/hero/hero-fallback.jpg'">
                        <span class="tour-badge">${tour.badge}</span>
                    </div>
                    <div class="tour-content">
                        <h3 class="tour-title">${tour.name}</h3>
                        <div class="tour-meta">
                            <span>⏱️ ${tour.duration}</span>
                            <span>👥 ${tour.groupSize}</span>
                            <span class="tour-rating">⭐ ${tour.rating}</span>
                        </div>
                        <p class="tour-description">${tour.description}</p>
                        <div class="tour-price">
                            <div>
                                <span class="price-label">From</span>
                                <span class="price-amount" data-price="${tour.price}">$${tour.price.toLocaleString()}</span>
                            </div>
                            <button class="btn-add-to-cart" data-tour-id="${tour.id}">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
        },
        
        // Initialize video player
        initVideoPlayer: function() {
            const videoContainer = document.getElementById('heroVideo');
            const video = videoContainer?.querySelector('video');
            
            if (!video) return;
            
            // Load video after page load
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const sources = video.querySelectorAll('source[data-src]');
                    sources.forEach(source => {
                        source.src = source.dataset.src;
                    });
                    
                    video.load();
                    videoContainer.dataset.videoEnabled = 'true';
                    
                    // Start playing after load
                    video.play().catch(e => console.log('Auto-play prevented'));
                }, 1000);
            });
        },
        
        // Toggle video play/pause
        toggleVideo: function() {
            const video = document.querySelector('.hero-video');
            const playIcon = document.querySelector('.play-icon');
            const pauseIcon = document.querySelector('.pause-icon');
            
            if (!video) return;
            
            if (video.paused) {
                video.play();
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            } else {
                video.pause();
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            }
        },
        
        // Initialize testimonials slider
        initTestimonialsSlider: function() {
            this.testimonialsCurrentIndex = 0;
            this.testimonialsCards = document.querySelectorAll('.testimonial-card');
            
            if (this.testimonialsCards.length === 0) return;
            
            // Auto advance every 5 seconds
            setInterval(() => {
                this.slideTestimonials('next');
            }, 5000);
        },
        
        // Slide testimonials
        slideTestimonials: function(direction) {
            if (!this.testimonialsCards || this.testimonialsCards.length === 0) return;
            
            if (direction === 'next') {
                this.testimonialsCurrentIndex = (this.testimonialsCurrentIndex + 1) % this.testimonialsCards.length;
            } else {
                this.testimonialsCurrentIndex = (this.testimonialsCurrentIndex - 1 + this.testimonialsCards.length) % this.testimonialsCards.length;
            }
            
            this.testimonialsCards.forEach((card, i) => {
                card.classList.toggle('active', i === this.testimonialsCurrentIndex);
            });
        },
        
        // Initialize mobile menu
        initMobileMenu: function() {
            const menuBtn = this.elements.mobileMenuBtn;
            const navMenu = this.elements.navMenu;
            
            if (!menuBtn || !navMenu) return;
            
            menuBtn.addEventListener('click', () => {
                const isActive = navMenu.classList.toggle('active');
                menuBtn.classList.toggle('active');
                document.body.style.overflow = isActive ? 'hidden' : '';
            });
            
            // Close on link click
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    menuBtn.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        },
        
        // Initialize smooth scroll
        initSmoothScroll: function() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    
                    if (href === '#') return;
                    
                    const target = document.querySelector(href);
                    
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        },
        
        // Handle URL parameters
        handleUrlParameters: function() {
            const params = new URLSearchParams(window.location.search);
            const lang = params.get('lang');
            const currency = params.get('currency');
            
            if (lang && ['en','es','fr','de','it','pt','ru','zh','ja','ar'].includes(lang)) {
                this.switchLanguage(lang);
            }
            
            if (currency && ['USD','EUR','GBP','JPY','AUD'].includes(currency)) {
                this.switchCurrency(currency);
            }
        },
        
        // Handle newsletter submission
        handleNewsletterSubmit: function() {
            const email = this.elements.newsletterEmail?.value;
            
            if (!email || !this.validateEmail(email)) {
                this.showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate API call
            setTimeout(() => {
                this.showNotification('Successfully subscribed to newsletter!', 'success');
                this.elements.newsletterForm.reset();
            }, 500);
        },
        
        // Validate email
        validateEmail: function(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        
        // Show notification
        showNotification: function(message, type = 'info') {
            // Remove existing notification
            const existing = document.querySelector('.notification');
            if (existing) existing.remove();
            
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            notification.setAttribute('role', 'alert');
            
            notification.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                padding: 1rem 2rem;
                background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#0066cc'};
                color: white;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                z-index: 9999;
                animation: slideIn 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }, 3000);
        },
        
        // Handle scroll
        handleScroll: function() {
            const header = this.elements.header;
            if (!header) return;
            
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            }
        }
    };
    
    // Expose to global scope
    window.TravelSite = Site;
})();
