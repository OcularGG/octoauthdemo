// Variables to keep track of the slideshow
let slideIndex = 1;

// Phrases to cycle through
const phrases = [
    "the fun is!",
    "strategy meets chaos.",
    "teamwork defines victory.",
    "champions of the Mists rise.",
    "the Octopus sees all.",
    "movie night is every week.",
    "overcharge is a way of life.",
    "risk meets reward.",
    "every fight matters.",
    "your choices define you.",
    "music fills our islands.",
    "risk-takers thrive.",
    "fame is earned daily."
];

// Initialize the slideshow when the page loads
document.addEventListener('DOMContentLoaded', function() {
    showSlides(slideIndex);
    
    // Auto advance slides every 5 seconds
    setInterval(function() {
        plusSlides(1);
    }, 5000);
    
    // Initialize the changing text
    startChangingText();
});

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    
    // Loop back to first slide if at the end
    if (n > slides.length) {
        slideIndex = 1;
    }
    
    // Go to last slide if going back from first slide
    if (n < 1) {
        slideIndex = slides.length;
    }
    
    // Hide all slides
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    // Remove active class from all dots
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    // Show current slide and activate corresponding dot
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}

// Function to generate random color
function getRandomColor() {
    const colors = [
        '#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FF33A6', 
        '#33FFF6', '#F6FF33', '#FF8333', '#8333FF', '#33FF83'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Function to change the text and its color
function startChangingText() {
    const changingTextElements = document.querySelectorAll('.changing-text');
    let currentPhraseIndex = 0;
    
    // Initial text
    changingTextElements.forEach(element => {
        element.textContent = phrases[0];
        element.style.color = getRandomColor();
    });
    
    // Change text every 3 seconds
    setInterval(function() {
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        
        changingTextElements.forEach(element => {
            // Apply fade-out effect
            element.style.opacity = 0;
            
            // Change text and color after slight delay
            setTimeout(function() {
                element.textContent = phrases[currentPhraseIndex];
                element.style.color = getRandomColor();
                element.style.opacity = 1;
            }, 300);
        });
    }, 3000);
}
