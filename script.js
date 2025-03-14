document.addEventListener('DOMContentLoaded', function() {
    // Initialize slideshow
    let slideIndex = 0;
    showSlides();
    
    // Global function for navigation controls
    window.changeSlide = function(n) {
        showSlides(slideIndex += n);
    };
    
    function showSlides() {
        let i;
        let slides = document.getElementsByClassName("slideshow-slide");
        
        // Hide all slides
        for (i = 0; i < slides.length; i++) {
            slides[i].classList.remove("active");
        }
        
        // Move to the next slide
        slideIndex++;
        
        // Reset if at the end
        if (slideIndex > slides.length) {
            slideIndex = 1;
        }
        
        // If at the beginning when going backwards
        if (slideIndex < 1) {
            slideIndex = slides.length;
        }
        
        // Show the current slide
        slides[slideIndex-1].classList.add("active");
        
        // Auto advance slides every 5 seconds
        setTimeout(showSlides, 5000);
    }
    
    // Modern sidebar menu functionality
    const dropdownItems = document.querySelectorAll('.sidebar nav ul li.dropdown');
    
    dropdownItems.forEach(item => {
        const link = item.querySelector('a');
        
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
    });
    
    // Set active menu item based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const menuLinks = document.querySelectorAll('.sidebar nav a');
    
    menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
            
            // If it's in a dropdown, open the dropdown
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                parentDropdown.classList.add('open');
            }
        }
    });
    
    // Add event listeners for buttons
    const applyButtons = document.querySelectorAll('.get-fuel');
    applyButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('Application form will be available soon!');
        });
    });
});
