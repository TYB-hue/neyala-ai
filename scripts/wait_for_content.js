const puppeteer = require('puppeteer');

async function waitForContent() {
    const browser = await puppeteer.launch({ 
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--disable-blink-features=AutomationControlled'
        ]
    });

    const page = await browser.newPage();
    
    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Remove webdriver property
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined,
        });
    });

    try {
        console.log('Navigating to Booking.com search page...');
        
        const searchUrl = 'https://www.booking.com/searchresults.en-us.html?checkin=2025-08-27&checkout=2025-08-30&selected_currency=USD&ss=Paris&ssne=Paris&ssne_untouched=Paris&lang=en-us&sb=1&src_elem=sb&src=searchresults&dest_type=city&group_adults=2&no_rooms=1&group_children=0&sb_travel_purpose=leisure';
        
        await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });
        
        console.log('Page title:', await page.title());
        console.log('Page URL:', page.url());
        
        // Wait and check for content multiple times
        for (let i = 1; i <= 10; i++) {
            console.log(`\n=== CHECK ${i} (after ${i * 5} seconds) ===`);
            
            // Wait 5 seconds
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // Check for loading indicators
            const loadingElements = await page.$$eval('*', elements => {
                return elements.filter(el => {
                    const text = el.textContent || '';
                    const className = el.className || '';
                    return text.toLowerCase().includes('loading') ||
                           text.toLowerCase().includes('searching') ||
                           text.toLowerCase().includes('please wait') ||
                           className.toLowerCase().includes('loading') ||
                           className.toLowerCase().includes('spinner');
                }).length;
            });
            console.log(`Loading elements found: ${loadingElements}`);
            
            // Check for hotel cards
            const hotelCards = await page.$$('div[data-testid="property-card"]');
            console.log(`Hotel cards found: ${hotelCards.length}`);
            
            // Check for any property-related elements
            const propertyElements = await page.$$('div[data-testid*="property"]');
            console.log(`Property elements found: ${propertyElements.length}`);
            
            // Check for any cards
            const allCards = await page.$$('div[class*="card"]');
            console.log(`All cards found: ${allCards.length}`);
            
            // Check page content length
            const contentLength = await page.evaluate(() => document.body.textContent.length);
            console.log(`Page content length: ${contentLength} characters`);
            
            // If we find hotel cards, break
            if (hotelCards.length > 0) {
                console.log('Found hotel cards!');
                break;
            }
            
            // Try scrolling to trigger lazy loading
            if (i % 2 === 0) {
                await page.evaluate(() => {
                    window.scrollTo(0, document.body.scrollHeight / 2);
                });
                console.log('Scrolled down to trigger lazy loading');
            }
        }
        
        // Final check - get all text content to see what's actually on the page
        const pageText = await page.evaluate(() => document.body.textContent);
        console.log('\n=== PAGE TEXT (first 1000 characters) ===');
        console.log(pageText.substring(0, 1000));
        
        // Take a screenshot
        await page.screenshot({ path: 'wait_for_content.png', fullPage: true });
        console.log('\nScreenshot saved as wait_for_content.png');
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await browser.close();
    }
}

waitForContent().catch(console.error);



