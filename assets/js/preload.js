// This script runs before the body content loads
document.documentElement.classList.add('page-loading');

// Preload critical images
function preloadImages(array) {
    if (!preloadImages.list) {
        preloadImages.list = [];
    }
    for (let i = 0; i < array.length; i++) {
        const img = new Image();
        img.src = array[i];
        preloadImages.list.push(img);
    }
}

// Add images to preload (logo and first slideshow image)
preloadImages([
    'https://i.imgur.com/2vsdAdd.png',
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564'
]);

// Optimize font loading
if ('fonts' in document) {
    Promise.all([
        document.fonts.load('1em Montserrat'),
        document.fonts.load('1em Roboto')
    ]).then(function() {
        // Fonts loaded
        console.log('Fonts loaded');
    });
}

// Preload script to handle page transitions
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, removing loading class');
    // Remove loading class after a small delay to ensure components are loaded
    setTimeout(() => {
        document.body.classList.remove('page-loading');
    }, 500);
});

// Add a console log to indicate the script is loaded
console.log('Preload script loaded');
