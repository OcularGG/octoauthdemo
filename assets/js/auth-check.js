// Make the authentication check function globally available
function initAuthCheck() {
    // Check if user menu elements exist on the page
    const loadingStatus = document.getElementById('loading-status');
    const loginButton = document.getElementById('login-button');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (!loadingStatus || !loginButton || !userDropdown) {
        console.warn('Auth check elements not found on page');
        return; // Skip if elements don't exist
    }
    
    // Check authentication status
    fetch('/api/user')
        .then(response => {
            if (loadingStatus) loadingStatus.style.display = 'none';
            
            if (!response.ok) {
                // User not authenticated, show login button
                if (loginButton) loginButton.style.display = 'block';
                throw new Error('Not authenticated');
            }
            return response.json();
        })
        .then(user => {
            // User authenticated, show user dropdown
            if (userDropdown) userDropdown.style.display = 'block';
            
            const username = document.getElementById('username');
            const userAvatar = document.getElementById('user-avatar');
            
            if (username) username.textContent = user.username || 'User';
            if (userAvatar) userAvatar.src = user.avatar || 'https://i.imgur.com/2vsdAdd.png';
            
            // Set up dropdown toggle
            const userButton = document.querySelector('.user-button');
            const dropdownContent = document.querySelector('.user-dropdown-content');
            
            if (userButton && dropdownContent) {
                userButton.addEventListener('click', function() {
                    dropdownContent.classList.toggle('show');
                });
                
                // Close dropdown when clicking outside
                window.addEventListener('click', function(event) {
                    if (!event.target.matches('.user-button') && 
                        !event.target.matches('.user-avatar') && 
                        !event.target.matches('.dropdown-arrow') &&
                        !event.target.matches('#username')) {
                        if (dropdownContent.classList.contains('show')) {
                            dropdownContent.classList.remove('show');
                        }
                    }
                });
            }
        })
        .catch(error => {
            console.log('User not authenticated', error);
        });
}

// Expose function globally
window.initAuthCheck = initAuthCheck;

// Execute on DOM content loaded if not using components system
document.addEventListener('DOMContentLoaded', function() {
    // Only auto-run if not using component system
    if (!document.getElementById('auth-menu-container')) {
        initAuthCheck();
    }
});
