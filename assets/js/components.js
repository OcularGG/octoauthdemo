// Component loader script
document.addEventListener('DOMContentLoaded', function() {
    // Load sidebar component
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        fetch('/components/sidebar.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load sidebar (${response.status})`);
                }
                return response.text();
            })
            .then(html => {
                sidebarContainer.innerHTML = html;
                
                // Set active menu item based on current page
                const currentPath = window.location.pathname;
                const currentPage = currentPath.split('/').pop() || 'index.html';
                const menuLinks = document.querySelectorAll('.sidebar nav a');
                
                menuLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === currentPath || 
                        href === `/${currentPage}` ||
                        (currentPage === 'index.html' && href === '/')) {
                        link.classList.add('active');
                        
                        // If it's in a dropdown, open the dropdown
                        const parentDropdown = link.closest('.dropdown');
                        if (parentDropdown) {
                            parentDropdown.classList.add('open');
                        }
                    }
                });
                
                // Initialize dropdown functionality
                initDropdowns();
            })
            .catch(error => {
                console.error('Error loading sidebar component:', error);
                sidebarContainer.innerHTML = '<p>Error loading navigation. Please refresh the page.</p>';
            });
    }
    
    // Load auth menu component
    const authMenuContainer = document.getElementById('auth-menu-container');
    if (authMenuContainer) {
        fetch('/components/auth-menu.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load auth menu (${response.status})`);
                }
                return response.text();
            })
            .then(html => {
                authMenuContainer.innerHTML = html;
                // Run auth check after the component is loaded
                if (typeof initAuthCheck === 'function') {
                    initAuthCheck();
                } else {
                    console.error('Auth check function not available');
                }
            })
            .catch(error => {
                console.error('Error loading auth menu component:', error);
                authMenuContainer.innerHTML = '<p>Error loading authentication menu.</p>';
            });
    }
});

// Initialize dropdown functionality
function initDropdowns() {
    const dropdownItems = document.querySelectorAll('.sidebar nav ul li.dropdown');
    
    dropdownItems.forEach(item => {
        const link = item.querySelector('a');
        
        if (link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Toggle current dropdown
                item.classList.toggle('open');
                
                // Close other dropdowns
                dropdownItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('open');
                    }
                });
            });
        }
    });
}
