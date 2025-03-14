document.addEventListener('DOMContentLoaded', function() {
    // Remove loading class once page is loaded
    document.body.classList.remove('page-loading');
    
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
    
    // Add smooth page transitions
    document.addEventListener('click', function(e) {
        // Only process link clicks
        const link = e.target.closest('a');
        if (!link) return;
        
        // Skip external links, hash links, or links with modifiers
        if (link.hostname !== window.location.hostname || 
            link.getAttribute('href').startsWith('#') ||
            e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
            return;
        }
        
        // Prevent default navigation
        e.preventDefault();
        
        // Fade out
        document.body.classList.add('page-loading');
        
        // Navigate after transition
        setTimeout(function() {
            window.location.href = link.href;
        }, 300);
    });
    
    // Cache pages for faster loading
    function prefetchPages() {
        // Find all internal links
        const links = document.querySelectorAll('a');
        const internalLinks = Array.from(links)
            .filter(link => link.hostname === window.location.hostname)
            .map(link => link.getAttribute('href'));
        
        // Prefetch unique links
        const uniqueLinks = [...new Set(internalLinks)];
        uniqueLinks.forEach(url => {
            if (!url.startsWith('#') && url !== window.location.pathname) {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = url;
                document.head.appendChild(link);
            }
        });
    }
    
    // Run prefetch after page loads
    window.addEventListener('load', prefetchPages);
    
    // Add page loading class before unloading
    window.addEventListener('beforeunload', function() {
        document.body.classList.add('page-loading');
    });
    
    // Add event listeners for buttons
    const applyButtons = document.querySelectorAll('.get-fuel');
    applyButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('Application form will be available soon!');
        });
    });
});
