/**
 * OCULAR Website JavaScript
 * 
 * This script controls:
 * 1. Image slideshow functionality with automatic advancement
 * 2. Dynamic text changing with color effects
 * 3. Navigation controls for the slideshow
 * 4. Mobile responsiveness features
 * 5. Collapsible sidebar functionality
 */

// Variables to keep track of the slideshow
let slideIndex = 1;

// Phrases to cycle through in the changing text component
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

/**
 * Initialize the page when DOM content is fully loaded
 * - Sets up the slideshow
 * - Configures automatic slide advancement
 * - Starts the text changing animation
 * - Sets up mobile menu functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    // Display the initial slide
    showSlides(slideIndex);
    
    // Auto advance slides every 5 seconds
    setInterval(function() {
        plusSlides(1);
    }, 5000);
    
    // Initialize the changing text effect
    startChangingText();
    
    // Set up mobile menu toggle
    setupMobileMenu();
    
    // Setup collapsible sidebar
    setupCollapsibleSidebar();
});

/**
 * Advance the slideshow by n slides
 * @param {number} n - Number of slides to advance (positive or negative)
 */
function plusSlides(n) {
    showSlides(slideIndex += n);
}

/**
 * Jump to a specific slide
 * @param {number} n - Slide number to display
 */
function currentSlide(n) {
    showSlides(slideIndex = n);
}

/**
 * Display the current slide and update navigation dots
 * @param {number} n - Current slide index
 */
function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    
    // Handle wrapping around at the ends of the slideshow
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
    
    // Show the current slide and activate corresponding dot
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}

/**
 * Generate a random color from a predefined palette
 * @returns {string} A hex color code
 */
function getRandomColor() {
    const colors = [
        '#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FF33A6', 
        '#33FFF6', '#F6FF33', '#FF8333', '#8333FF', '#33FF83'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Animate the changing text with smooth crossfade effects and color changes
 * - Updates text every 3 seconds using a crossfade between two elements
 * - Prevents layout shifts by using absolute positioning
 * - Avoids flickering by alternating between active and next elements
 */
function startChangingText() {
    const slides = document.querySelectorAll('.slide');
    let currentPhraseIndex = 0;
    
    // Initialize all slides with the first phrase
    slides.forEach(slide => {
        const activeText = slide.querySelector('.changing-text.active');
        const nextText = slide.querySelector('.changing-text.next');
        
        if (activeText && nextText) {
            activeText.textContent = phrases[0];
            activeText.style.color = getRandomColor();
            nextText.textContent = phrases[0];
            nextText.style.color = getRandomColor();
        }
    });
    
    // Change text and color every 3 seconds with crossfade
    setInterval(function() {
        // Get the next phrase index
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        const newPhrase = phrases[currentPhraseIndex];
        const newColor = getRandomColor();
        
        // Update all slides
        slides.forEach(slide => {
            // Get the active and next text elements
            const activeText = slide.querySelector('.changing-text.active');
            const nextText = slide.querySelector('.changing-text.next');
            
            if (activeText && nextText) {
                // Set up the next text before fading
                nextText.textContent = newPhrase;
                nextText.style.color = newColor;
                
                // Start crossfade
                activeText.classList.remove('active');
                activeText.classList.add('next');
                nextText.classList.remove('next');
                nextText.classList.add('active');
            }
        });
    }, 3000);
}

/**
 * Set up the mobile menu toggle functionality
 * - Controls the sidebar visibility on mobile devices
 * - Handles click events for the hamburger button
 */
function setupMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close menu when clicking on the main content area
        content.addEventListener('click', function() {
            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
        
        // Close menu when clicking a menu link (for mobile)
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            });
        });
    }
    
    // Add check for any potential gap between sidebar and content
    if (window.innerWidth <= 650) {
        // For mobile views
        document.documentElement.style.setProperty('--sidebar-gap', '0px');
    } else {
        // Ensure no gap for desktop/tablet views
        document.documentElement.style.setProperty('--sidebar-gap', '0px');
    }
    
    // Listen for window resize to adjust gaps
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 650) {
            document.documentElement.style.setProperty('--sidebar-gap', '0px');
        } else {
            document.documentElement.style.setProperty('--sidebar-gap', '0px');
        }
    });
}

/**
 * Set up the collapsible sidebar functionality
 */
function setupCollapsibleSidebar() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const container = document.querySelector('.container');
    
    // Check if toggle button exists
    if (sidebarToggle && container) {
        // Check for saved state
        const sidebarState = localStorage.getItem('sidebarCollapsed');
        if (sidebarState === 'true') {
            container.classList.add('sidebar-collapsed');
        }
        
        // Add click handler
        sidebarToggle.addEventListener('click', function() {
            container.classList.toggle('sidebar-collapsed');
            
            // Save state
            const isCollapsed = container.classList.contains('sidebar-collapsed');
            localStorage.setItem('sidebarCollapsed', isCollapsed);
        });
    }
}
