const fs = require('fs');
const path = require('path');

// Check if directories exist
const dirs = ['assets', 'assets/css', 'assets/js', 'pages', 'components', 'api', 'api/functions', 'config'];
console.log('Checking directory structure:');
dirs.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    const exists = fs.existsSync(fullPath);
    console.log(`${dir}: ${exists ? 'EXISTS' : 'MISSING'}`);
});

// Check critical files
const files = [
    'pages/index.html', 
    'assets/css/styles.css', 
    'assets/js/script.js',
    'components/sidebar.html',
    'components/auth-menu.html',
    'server.js',
    'config/.env'
];
console.log('\nChecking critical files:');
files.forEach(file => {
    const fullPath = path.join(__dirname, file);
    const exists = fs.existsSync(fullPath);
    console.log(`${file}: ${exists ? 'EXISTS' : 'MISSING'}`);
});

// Check server configuration
console.log('\nServer configuration:');
try {
    require('dotenv').config({ path: './config/.env' });
    console.log('Environment variables loaded from config/.env');
} catch (error) {
    console.log('Failed to load environment variables:', error.message);
}

console.log('\nDebug information:');
console.log('Node.js version:', process.version);
console.log('Current directory:', __dirname);
console.log('PORT environment variable:', process.env.PORT || 'not set (default: 5500)');
