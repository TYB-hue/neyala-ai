const puppeteer = require('puppeteer');

async function simpleTest() {
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
        
        // Wait for content to load
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        // Check for various selectors
        const selectors = [
            'div[data-testid="property-card"]',
            'div[data-testid*="property"]',
            'div[data-testid*="hotel"]',
            'div[data-testid*="card"]',
            'div[data-testid*="item"]',
            'div[data-testid*="listing"]',
            'div[class*="property"]',
            'div[class*="hotel"]',
            'div[class*="card"]',
            'div[class*="item"]',
            'div[class*="listing"]',
            'div[class*="sr_"]',
            'div[class*="accommodation"]'
        ];
        
        console.log('\n=== TESTING SELECTORS ===');
        for (const selector of selectors) {
            try {
                const elements = await page.$$(selector);
                console.log(`${selector}: ${elements.length} elements`);
            } catch (error) {
                console.log(`${selector}: ERROR - ${error.message}`);
            }
        }
        
        // Get all data-testid attributes
        const dataTestIds = await page.$$eval('[data-testid]', elements => {
            return elements.map(el => el.getAttribute('data-testid')).filter(id => id);
        });
        
        console.log('\n=== ALL DATA-TESTID ATTRIBUTES ===');
        dataTestIds.forEach((id, index) => {
            console.log(`${index + 1}. ${id}`);
        });
        
        // Look for elements containing "hotel" or "property" in their text
        const hotelTextElements = await page.$$eval('*', elements => {
            return elements.filter(el => {
                const text = el.textContent || '';
                return text.toLowerCase().includes('hotel') || 
                       text.toLowerCase().includes('property') ||
                       text.toLowerCase().includes('inn') ||
                       text.toLowerCase().includes('resort');
            }).map(el => ({
                tagName: el.tagName,
                text: el.textContent?.substring(0, 100) || '',
                className: el.className,
                dataTestId: el.getAttribute('data-testid') || ''
            }));
        });
        
        console.log('\n=== ELEMENTS WITH HOTEL-RELATED TEXT ===');
        hotelTextElements.slice(0, 10).forEach((item, index) => {
            console.log(`${index + 1}. ${item.tagName}`);
            console.log(`   Class: ${item.className}`);
            console.log(`   data-testid: ${item.dataTestId}`);
            console.log(`   Text: ${item.text}`);
            console.log('');
        });
        
        // Take a screenshot
        await page.screenshot({ path: 'simple_test.png', fullPage: true });
        console.log('\nScreenshot saved as simple_test.png');
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await browser.close();
    }
}

simpleTest().catch(console.error);



