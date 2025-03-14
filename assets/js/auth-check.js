// Make the authentication check function globally available
function initAuthCheck() {
    // Check if user menu elements exist on the page
    const loadingStatus = document.getElementById('loading-status');
    const loginButton = document.getElementById('login-button');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (!loadingStatus || !loginButton || !userDropdown) {
        return; // Skip if elements don't exist
    }
    
    // Check authentication status
    fetch('/api/user')
        .then(response => {
            loadingStatus.style.display = 'none';
            
            if (!response.ok) {
                // User not authenticated, show login button
                loginButton.style.display = 'block';
                throw new Error('Not authenticated');
            }
            return response.json();
        })
        .then(user => {
            // User authenticated, show user dropdown
            userDropdown.style.display = 'block';
            document.getElementById('username').textContent = user.username;
            document.getElementById('user-avatar').src = user.avatar;
            
            // Set up dropdown toggle
            const userButton = document.querySelector('.user-button');
            const dropdownContent = document.querySelector('.user-dropdown-content');
            
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
