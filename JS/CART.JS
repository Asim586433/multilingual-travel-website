/**
 * CART.JS - Complete shopping cart functionality
 * All buttons and features working
 */

(function() {
    'use strict';
    
    const Cart = {
        // Initialize cart page
        init: function() {
            this.loadCart();
            this.setupEventListeners();
            this.renderCart();
        },
        
        // Load cart from storage
        loadCart: function() {
            const savedCart = localStorage.getItem('travelCart');
            if (savedCart) {
                try {
                    this.cart = JSON.parse(savedCart);
                } catch (e) {
                    this.cart = { items: [], total: 0, count: 0 };
                }
            } else {
                this.cart = { items: [], total: 0, count: 0 };
            }
        },
        
        // Setup event listeners
        setupEventListeners: function() {
            // Checkout button
            const checkoutBtn = document.getElementById('checkoutBtn');
            if (checkoutBtn) {
                checkoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.proceedToCheckout();
                });
            }
            
            // Continue shopping button
            const continueBtn = document.getElementById('continueShoppingBtn');
            if (continueBtn) {
                continueBtn.addEventListener('click', () => {
                    window.location.href = '/tours.html';
                });
            }
            
            // Clear cart button
            const clearCartBtn = document.getElementById('clearCartBtn');
            if (clearCartBtn) {
                clearCartBtn.addEventListener('click', () => {
                    this.clearCart();
                });
            }
        },
        
        // Render cart items
        renderCart: function() {
            const cartContainer = document.getElementById('cartItems');
            const emptyCart = document.getElementById('emptyCart');
            const cartSummary = document.getElementById('cartSummary');
            
            if (!cartContainer) return;
            
            if (!this.cart.items || this.cart.items.length === 0) {
                // Show empty cart
                if (emptyCart) emptyCart.style.display = 'block';
                if (cartContainer) cartContainer.style.display = 'none';
                if (cartSummary) cartSummary.style.display = 'none';
                return;
            }
            
            // Hide empty cart, show items
            if (emptyCart) emptyCart.style.display = 'none';
            if (cartContainer) cartContainer.style.display = 'block';
            if (cartSummary) cartSummary.style.display = 'block';
            
            // Render each item
            cartContainer.innerHTML = this.cart.items.map(item => this.renderCartItem(item)).join('');
            
            // Update summary
            this.updateSummary();
            
            // Add event listeners to cart items
            this.addCartItemListeners();
        },
        
        // Render single cart item
        renderCartItem: function(item) {
            return `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-product">
                        <img src="${item.image || 'assets/images/hero/hero-fallback.jpg'}" 
                             alt="${item.name}"
                             onerror="this.src='assets/images/hero/hero-fallback.jpg'">
                        <div class="cart-product-info">
                            <h3>${item.name}</h3>
                            <p>Tour ID: #${item.id}</p>
                        </div>
                    </div>
                    
                    <div class="cart-price" data-price="${item.price}">
                        $${item.price.toLocaleString()}
                    </div>
                    
                    <div class="cart-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">−</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" readonly>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    
                    <div class="cart-subtotal" data-subtotal="${item.price * item.quantity}">
                        $${(item.price * item.quantity).toLocaleString()}
                    </div>
                    
                    <div class="cart-actions">
                        <button class="cart-remove" data-id="${item.id}" aria-label="Remove item">🗑️</button>
                    </div>
                </div>
            `;
        },
        
        // Add event listeners to cart items
        addCartItemListeners: function() {
            // Quantity minus buttons
            document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const id = parseInt(e.target.dataset.id);
                    this.updateQuantity(id, -1);
                });
            });
            
            // Quantity plus buttons
            document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const id = parseInt(e.target.dataset.id);
                    this.updateQuantity(id, 1);
                });
            });
            
            // Remove buttons
            document.querySelectorAll('.cart-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const id = parseInt(e.target.dataset.id);
                    this.removeItem(id);
                });
            });
        },
        
        // Update item quantity
        updateQuantity: function(id, change) {
            const item = this.cart.items.find(i => i.id === id);
            if (!item) return;
            
            const newQuantity = item.quantity + change;
            
            if (newQuantity < 1) {
                this.removeItem(id);
                return;
            }
            
            if (newQuantity > 10) {
                alert('Maximum quantity is 10');
                return;
            }
            
            item.quantity = newQuantity;
            this.recalculateCart();
            this.renderCart();
            
            // Update header cart count
            this.updateHeaderCart();
        },
        
        // Remove item from cart
        removeItem: function(id) {
            this.cart.items = this.cart.items.filter(i => i.id !== id);
            this.recalculateCart();
            this.renderCart();
            this.updateHeaderCart();
            
            // Show notification
            this.showNotification('Item removed from cart', 'info');
        },
        
        // Clear entire cart
        clearCart: function() {
            if (confirm('Are you sure you want to clear your cart?')) {
                this.cart.items = [];
                this.recalculateCart();
                this.renderCart();
                this.updateHeaderCart();
                this.showNotification('Cart cleared', 'info');
            }
        },
        
        // Recalculate cart totals
        recalculateCart: function() {
            this.cart.count = this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
            this.cart.total = this.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            // Save to storage
            localStorage.setItem('travelCart', JSON.stringify(this.cart));
        },
        
        // Update summary section
        updateSummary: function() {
            const subtotalEl = document.getElementById('cartSubtotal');
            const totalEl = document.getElementById('cartTotal');
            
            if (subtotalEl) {
                subtotalEl.textContent = `$${this.cart.total.toLocaleString()}`;
            }
            
            if (totalEl) {
                totalEl.textContent = `$${this.cart.total.toLocaleString()}`;
            }
        },
        
        // Update header cart count
        updateHeaderCart: function() {
            const cartCount = document.getElementById('cartCount');
            if (cartCount) {
                cartCount.textContent = this.cart.count || 0;
            }
        },
        
        // Proceed to checkout
        proceedToCheckout: function() {
            if (!this.cart.items || this.cart.items.length === 0) {
                alert('Your cart is empty');
                return;
            }
            
            // Save cart before checkout
            localStorage.setItem('travelCart', JSON.stringify(this.cart));
            
            // Redirect to checkout
            window.location.href = '/checkout.html';
        },
        
        // Show notification
        showNotification: function(message, type) {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                padding: 1rem 2rem;
                background: ${type === 'success' ? '#28a745' : '#0066cc'};
                color: white;
                border-radius: 8px;
                z-index: 9999;
                animation: slideIn 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    };
    
    // Initialize on cart page
    if (window.location.pathname.includes('cart.html')) {
        document.addEventListener('DOMContentLoaded', () => {
            Cart.init();
        });
    }
    
    // Expose to global
    window.Cart = Cart;
})();
