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
        console.log("Fetching products from Netlify function...");
        const response = await fetch('/.netlify/functions/get-products');
        console.log(`Function response status: ${response.status}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API error: ${errorText}`);
            throw new Error(`Failed to fetch products: ${response.status}`);
        }
        
        const products = await response.json();
        console.log(`Products received: ${products.length}`);
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        showError(`Unable to load products. Please try again later. (${error.message})`);
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
            <button class="retry-button" onclick="fetchProducts()">Retry</button>
        </div>
    `;
}

// Add styles for the error message
document.addEventListener('DOMContentLoaded', function() {
    // Add styles for error message
    const style = document.createElement('style');
    style.textContent = `
        .error-message {
            text-align: center;
            padding: 30px;
            background-color: #f8f8f8;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .error-message i {
            font-size: 3rem;
            color: #ff5252;
            margin-bottom: 15px;
        }
        .error-message p {
            margin-bottom: 20px;
            color: #333;
        }
        .retry-button {
            background-color: #00bcd4;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }
        .retry-button:hover {
            background-color: #008ba3;
        }
    `;
    document.head.appendChild(style);
    
    fetchProducts();
});
