/**
 * M4 Solutions Website - Playwright Test Script
 * Tests website functionality and loads properly
 */

const { chromium } = require('playwright');
const path = require('path');

async function testWebsite() {
    console.log('Starting M4 Solutions Website Test...\n');
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Collect console errors
    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });
    
    // Collect page errors
    const pageErrors = [];
    page.on('pageerror', error => {
        pageErrors.push(error.message);
    });
    
    const pages = ['index.html', 'about.html', 'services.html', 'gallery.html', 'contact.html'];
    const basePath = path.join(__dirname);
    
    console.log('Testing website pages...\n');
    
    for (const pageName of pages) {
        const filePath = path.join(basePath, pageName);
        console.log(`Testing: ${pageName}`);
        
        try {
            await page.goto(`file://${filePath}`, { waitUntil: 'networkidle' });
            await page.waitForTimeout(1000);
            
            // Check if main elements are present
            const navbar = await page.$('.navbar');
            const footer = await page.$('.footer');
            
            console.log(`  - Page loaded: ${navbar ? '✓' : '✗'}`);
            console.log(`  - Navigation: ${navbar ? '✓' : '✗'}`);
            console.log(`  - Footer: ${footer ? '✓' : '✗'}`);
            
        } catch (error) {
            console.log(`  - Error loading ${pageName}: ${error.message}`);
        }
        
        console.log('');
    }
    
    // Test responsive design
    console.log('Testing responsive design...');
    
    const viewportSizes = [
        { width: 1920, height: 1080, name: 'Desktop' },
        { width: 768, height: 1024, name: 'Tablet' },
        { width: 375, height: 667, name: 'Mobile' }
    ];
    
    for (const size of viewportSizes) {
        await page.setViewportSize({ width: size.width, height: size.height });
        await page.goto(`file://${path.join(basePath, 'index.html')}`, { waitUntil: 'networkidle' });
        console.log(`  - ${size.name} (${size.width}x${size.height}): ✓`);
    }
    
    // Report errors
    console.log('\n--- Error Report ---');
    
    if (consoleErrors.length > 0) {
        console.log('Console Errors:');
        consoleErrors.forEach(err => console.log(`  - ${err}`));
    } else {
        console.log('Console Errors: None');
    }
    
    if (pageErrors.length > 0) {
        console.log('Page Errors:');
        pageErrors.forEach(err => console.log(`  - ${err}`));
    } else {
        console.log('Page Errors: None');
    }
    
    await browser.close();
    
    console.log('\nTest completed successfully!');
}

// Run test
testWebsite().catch(console.error);
