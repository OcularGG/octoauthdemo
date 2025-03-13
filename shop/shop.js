/**
 * OCULAR Shop JavaScript
 * Handles Fourthwall API integration and product display
 */

// Config for Fourthwall API
const FOURTHWALL_CONFIG = {
    apiUrl: 'https://api.fourthwall.com',
    shopApiPath: '/api/shops/products',
    productDetailPath: '/api/shops/products'
};

// Initialize shop functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    fetchProducts();
});

/**
 * Fetch products from Fourthwall API
 * Uses Netlify functions to securely make the API call
 */
async function fetchProducts() {
    try {
        const response = await fetch('/.netlify/functions/get-products');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        showError('Failed to load products. Please try again later.');
    }
}

/**
 * Display products in the grid
 * @param {Array} products - Array of product objects from API
 */
function displayProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    const loadingContainer = document.querySelector('.loading-container');
    
    // Hide loading indicator
    if (loadingContainer) {
        loadingContainer.style.display = 'none';
    }
    
    // Check if we have products
    if (!products || products.length === 0) {
        showError('No products found');
        return;
    }
    
    // Build product cards
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

/**
 * Create a product card element
 * @param {Object} product - Product data
 * @returns {HTMLElement} - The product card element
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const imageUrl = product.images && product.images.length > 0 
        ? product.images[0].url 
        : 'https://via.placeholder.com/300x300?text=Product+Image';
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${product.name}" class="product-image">
        <div class="product-details">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">${formatPrice(product.price)}</div>
            <p class="product-description">${truncateText(product.description || 'No description available', 100)}</p>
            <a href="${product.url}" target="_blank" class="buy-button">View Product</a>
        </div>
    `;
    
    card.addEventListener('click', (e) => {
        // Prevent navigation if clicking the button (let button handle its own click)
        if (e.target.classList.contains('buy-button')) {
            return;
        }
        window.open(product.url, '_blank');
    });
    
    return card;
}

/**
 * Format price based on currency
 * @param {Object} price - Price object with amount and currency
 * @returns {String} Formatted price
 */
function formatPrice(price) {
    if (!price || !price.amount) return 'Price not available';
    
    const amount = price.amount / 100; // Convert cents to dollars
    const currency = price.currency || 'USD';
    
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

/**
 * Truncate text to specified length
 * @param {String} text - Text to truncate
 * @param {Number} maxLength - Maximum length
 * @returns {String} Truncated text
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

/**
 * Show error message to user
 * @param {String} message - Error message to display
 */
function showError(message) {
    const productsGrid = document.getElementById('products-grid');
    const loadingContainer = document.querySelector('.loading-container');
    
    // Hide loading indicator
    if (loadingContainer) {
        loadingContainer.style.display = 'none';
    }
    
    productsGrid.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>
    `;
}
