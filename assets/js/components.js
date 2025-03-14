// Component loader script
document.addEventListener('DOMContentLoaded', function() {
    // Load sidebar component
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        fetch('/components/sidebar.html')
            .then(response => response.text())
            .then(html => {
                sidebarContainer.innerHTML = html;
                
                // Set active menu item based on current page
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                const menuLinks = document.querySelectorAll('.sidebar nav a');
                
                menuLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === currentPage || 
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
            });
    }
    
    // Load auth menu component
    const authMenuContainer = document.getElementById('auth-menu-container');
    if (authMenuContainer) {
        fetch('/components/auth-menu.html')
            .then(response => response.text())
            .then(html => {
                authMenuContainer.innerHTML = html;
                initAuthCheck();
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
