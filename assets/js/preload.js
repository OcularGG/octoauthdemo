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
