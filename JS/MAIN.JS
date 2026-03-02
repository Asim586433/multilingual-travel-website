/**
 * Main JavaScript File
 * Handles core functionality, DOM manipulation, and performance optimizations
 */

(function() {
    'use strict';

    // ========================================
    // DOM Elements
    // ========================================
    
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const cartCount = document.querySelector('.cart-count');
    const newsletterForm = document.getElementById('newsletter-form');
    
    // ========================================
    // State Management
    // ========================================
    
    const state = {
        cart: {
            items: [],
            total: 0,
            count: 0
        },
        currentLanguage: 'en',
        currentCurrency: 'USD',
        exchangeRates: {
            USD: 1,
            EUR: 0.92,
            GBP: 0.79,
            JPY: 150.5,
            AUD: 1.52,
            CAD: 1.36,
            CHF: 0.88,
            CNY: 7.25,
            RUB: 92.5,
            BRL: 5.05
        },
        user: null,
        pageLoadTime: 0
    };

    // ========================================
    // Performance Monitoring
    // ========================================
    
    function initPerformanceMonitoring() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        state.pageLoadTime = perfData.loadEventEnd - perfData.fetchStart;
                        
                        // Report to analytics (if needed)
                        console.log(`Page load time: ${state.pageLoadTime}ms`);
                        
                        // Check Core Web Vitals
                        checkCoreWebVitals();
                    }
                }, 0);
            });
        }
    }

    function checkCoreWebVitals() {
        // LCP (Largest Contentful Paint)
        if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log(`LCP: ${lastEntry.startTime}ms`);
            });
            
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
            
            // CLS (Cumulative Layout Shift)
            const clsObserver = new PerformanceObserver((entryList) => {
                let clsValue = 0;
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                console.log(`CLS: ${clsValue}`);
            });
            
            clsObserver.observe({ type: 'layout-shift', buffered: true });
            
            // FID (First Input Delay)
            const fidObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                console.log(`FID: ${entries[0].processingStart - entries[0].startTime}ms`);
            });
            
            fidObserver.observe({ type: 'first-input', buffered: true });
        }
    }

    // ========================================
    // Header Scroll Behavior
    // ========================================
    
    let lastScroll = 0;
    
    function initHeaderScroll() {
        if (!header) return;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                header.classList.remove('hidden');
                return;
            }
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down
                header.classList.add('hidden');
            } else {
                // Scrolling up
                header.classList.remove('hidden');
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // ========================================
    // Mobile Menu
    // ========================================
    
    function initMobileMenu() {
        if (!mobileMenuBtn || !navMenu) return;
        
        mobileMenuBtn.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', isActive);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isActive ? 'hidden' : '';
        });
        
        // Close menu on link click
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close on resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ========================================
    // Load Tours Data
    // ========================================
    
    async function loadFeaturedTours() {
        const toursGrid = document.getElementById('featured-tours');
        if (!toursGrid) return;
        
        try {
            // Simulate API call
            const tours = await fetchTours();
            
            toursGrid.innerHTML = tours.map(tour => createTourCard(tour)).join('');
            
            // Add event listeners to Add to Cart buttons
            document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
                btn.addEventListener('click', handleAddToCart);
            });
            
        } catch (error) {
            console.error('Error loading tours:', error);
            toursGrid.innerHTML = '<p class="text-center">Failed to load tours. Please refresh the page.</p>';
        }
    }

    function fetchTours() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        name: 'Paris Explorer',
                        image: 'assets/images/tours/paris.webp',
                        duration: '5 days',
                        groupSize: '8-12',
                        rating: 4.8,
                        description: 'Discover the magic of Paris with local guides. Visit Eiffel Tower, Louvre, and hidden gems.',
                        price: 1299,
                        badge: 'Best Seller'
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
                        badge: 'Top Rated'
                    },
                    {
                        id: 3,
                        name: 'Italian Romance',
                        image: 'assets/images/tours/italy.webp',
                        duration: '8 days',
                        groupSize: '8-14',
                        rating: 4.7,
                        description: 'From Rome to Venice, experience la dolce vita with authentic Italian experiences.',
                        price: 1599,
                        badge: 'Popular'
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
                        badge: 'New'
                    }
                ]);
            }, 100);
        });
    }

    function createTourCard(tour) {
        return `
            <div class="tour-card" data-tour-id="${tour.id}">
                <div class="tour-image">
                    <img src="${tour.image}" alt="${tour.name}" loading="lazy" width="400" height="300">
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
    }

    // ========================================
    // Testimonials Slider
    // ========================================
    
    function initTestimonialsSlider() {
        const slides = document.querySelectorAll('.testimonial-card');
        const prevBtn = document.querySelector('.slider-prev');
        const nextBtn = document.querySelector('.slider-next');
        
        if (!slides.length || !prevBtn || !nextBtn) return;
        
        let currentSlide = 0;
        
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
        }
        
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        });
        
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        });
        
        // Auto-advance every 5 seconds
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000);
    }

    // ========================================
    // Newsletter Form
    // ========================================
    
    function initNewsletterForm() {
        if (!newsletterForm) return;
        
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            if (!validateEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            try {
                // Simulate API call
                await subscribeNewsletter(email);
                
                showNotification('Successfully subscribed to newsletter!', 'success');
                newsletterForm.reset();
                
            } catch (error) {
                showNotification('Failed to subscribe. Please try again.', 'error');
            }
        });
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function subscribeNewsletter(email) {
        return new Promise(resolve => {
            setTimeout(resolve, 500);
        });
    }

    // ========================================
    // Notifications
    // ========================================
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        
        document.body.appendChild(notification);
        
        // Add styles dynamically
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#0066cc'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // ========================================
    // Add to Cart Handler
    // ========================================
    
    function handleAddToCart(e) {
        const tourId = e.currentTarget.dataset.tourId;
        const tourCard = e.currentTarget.closest('.tour-card');
        const tourName = tourCard.querySelector('.tour-title').textContent;
        const tourPrice = parseFloat(tourCard.querySelector('.price-amount').dataset.price);
        
        // Dispatch custom event for cart module
        const event = new CustomEvent('addToCart', {
            detail: {
                id: tourId,
                name: tourName,
                price: tourPrice,
                quantity: 1
            }
        });
        
        document.dispatchEvent(event);
        
        showNotification(`${tourName} added to cart!`, 'success');
    }

    // ========================================
    // Lazy Loading Images
    // ========================================
    
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    // ========================================
    // Smooth Scroll
    // ========================================
    
    function initSmoothScroll() {
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
    }

    // ========================================
    // DOM Element Counter (to stay under 1500)
    // ========================================
    
    function checkDOMSize() {
        const elementCount = document.getElementsByTagName('*').length;
        
        if (elementCount > 1500) {
            console.warn(`DOM size exceeds 1500 elements (current: ${elementCount})`);
            // Could implement cleanup strategies here
        } else {
            console.log(`DOM size: ${elementCount} elements`);
        }
        
        return elementCount;
    }

    // ========================================
    // Initialize All
    // ========================================
    
    function init() {
        initPerformanceMonitoring();
        initHeaderScroll();
        initMobileMenu();
        loadFeaturedTours();
        initTestimonialsSlider();
        initNewsletterForm();
        initLazyLoading();
        initSmoothScroll();
        
        // Check DOM size
        setTimeout(checkDOMSize, 1000);
        
        // Log performance metrics
        console.log('Site initialized', {
            language: state.currentLanguage,
            currency: state.currentCurrency
        });
        
        // Add CSS animations keyframes if not present
        addAnimationKeyframes();
    }

    function addAnimationKeyframes() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
