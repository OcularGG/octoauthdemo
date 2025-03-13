/**
 * OCULAR Shop JavaScript
 * Handles product display and interactions
 */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log("Shop page loaded");
  
  // Initialize shop
  setupShopPage();
});

function setupShopPage() {
  // Ensure mobile menu works on shop page
  if (window.setupMobileMenu) {
    window.setupMobileMenu();
  } else {
    console.warn("Mobile menu setup function not available");
    // Fallback implementation
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuToggle && sidebar) {
      mobileMenuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        this.classList.toggle('active');
      });
    }
  }
  
  // Highlight active nav item
  highlightShopNav();
  
  // Fetch products
  fetchProducts();
}

// Highlight the shop nav item
function highlightShopNav() {
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' || 
        link.getAttribute('href').includes('/shop')) {
      link.classList.add('active');
    }
  });
}

async function fetchProducts() {
  const loadingContainer = document.querySelector('.loading-container');
  const productsGrid = document.getElementById('products-grid');
  
  if (!productsGrid) {
    console.error("Products grid element not found");
    return;
  }
  
  try {
    console.log("Fetching products...");
    
    // Try loading with timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch('/.netlify/functions/get-products', {
      signal: controller.signal
    }).catch(err => {
      console.error("Fetch error:", err);
      throw new Error("Network error when connecting to API");
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const products = await response.json();
    console.log(`Received ${products.length} products`);
    
    // Hide loader
    if (loadingContainer) loadingContainer.style.display = 'none';
    
    if (!products || products.length === 0) {
      productsGrid.innerHTML = `
        <div class="no-products">
          <i class="fas fa-box-open"></i>
          <p>No products available at this time.</p>
        </div>
      `;
      return;
    }
    
    // Clear previous content
    productsGrid.innerHTML = '';
    
    // Display products
    products.forEach(product => {
      const card = createProductCard(product);
      productsGrid.appendChild(card);
    });
    
  } catch (error) {
    console.error("Error:", error);
    
    // Hide loader
    if (loadingContainer) loadingContainer.style.display = 'none';
    
    // Show error with retry button
    productsGrid.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Unable to load products. Please try again.</p>
        <button onclick="fetchProducts()" class="retry-button">Retry</button>
      </div>
    `;
  }
}

// Create a product card from product data
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  
  // Get image URL with fallback
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0].url 
    : 'https://via.placeholder.com/300x300?text=Product';
  
  // Format price with fallback
  const price = product.price 
    ? formatPrice(product.price) 
    : 'Price not available';
  
  // Product URL with fallback
  const productUrl = product.url || '#';
  
  // Build card HTML
  card.innerHTML = `
    <img src="${imageUrl}" alt="${product.name}" class="product-image">
    <div class="product-details">
      <h3 class="product-title">${product.name}</h3>
      <div class="product-price">${price}</div>
      <p class="product-description">${truncateText(product.description || 'No description available', 100)}</p>
      <a href="${productUrl}" target="_blank" class="buy-button">View Product</a>
    </div>
  `;
  
  return card;
}

// Format price
function formatPrice(price) {
  if (!price || typeof price.amount === 'undefined') return 'Price not available';
  
  const amount = price.amount / 100; // Convert cents to dollars
  const currency = price.currency || 'USD';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

// Truncate text to specified length
function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
