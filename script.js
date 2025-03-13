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
    
    // Add event listeners for buttons if needed
    const applyButtons = document.querySelectorAll('.get-fuel');
    applyButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('Application form will be available soon!');
        });
    });
});
