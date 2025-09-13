const puppeteer = require('puppeteer');

async function debugPageStructure() {
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
        
        // Use the exact URL format that works
        const searchUrl = 'https://www.booking.com/searchresults.en-us.html?checkin=2025-08-27&checkout=2025-08-30&selected_currency=USD&ss=Paris&ssne=Paris&ssne_untouched=Paris&lang=en-us&sb=1&src_elem=sb&src=searchresults&dest_type=city&group_adults=2&no_rooms=1&group_children=0&sb_travel_purpose=leisure';
        
        await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });
        
        console.log('Page title:', await page.title());
        console.log('Page URL:', page.url());
        
        // Wait for content to load
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        // Scroll to load more content
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight / 2);
        });
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Get all elements with data-testid
        const dataTestIds = await page.$$eval('[data-testid]', elements => {
            return elements.map(el => ({
                testId: el.getAttribute('data-testid'),
                tagName: el.tagName,
                className: el.className,
                text: el.textContent?.substring(0, 100) || ''
            }));
        });
        
        console.log('\n=== DATA-TESTID ELEMENTS ===');
        dataTestIds.forEach((item, index) => {
            console.log(`${index + 1}. data-testid="${item.testId}" (${item.tagName})`);
            console.log(`   Class: ${item.className}`);
            console.log(`   Text: ${item.text}`);
            console.log('');
        });
        
        // Get all elements with aria-label
        const ariaLabels = await page.$$eval('[aria-label]', elements => {
            return elements.map(el => ({
                ariaLabel: el.getAttribute('aria-label'),
                tagName: el.tagName,
                className: el.className,
                text: el.textContent?.substring(0, 100) || ''
            }));
        });
        
        console.log('\n=== ARIA-LABEL ELEMENTS ===');
        ariaLabels.forEach((item, index) => {
            console.log(`${index + 1}. aria-label="${item.ariaLabel}" (${item.tagName})`);
            console.log(`   Class: ${item.className}`);
            console.log(`   Text: ${item.text}`);
            console.log('');
        });
        
        // Look for elements that might contain hotel information
        const potentialHotels = await page.$$eval('div', divs => {
            return divs.filter(div => {
                const text = div.textContent || '';
                const className = div.className || '';
                const dataTestId = div.getAttribute('data-testid') || '';
                const ariaLabel = div.getAttribute('aria-label') || '';
                
                // Look for elements that might contain hotel names, prices, or ratings
                return text.includes('€') || 
                       text.includes('$') || 
                       text.includes('Hotel') ||
                       text.includes('hotel') ||
                       text.includes('Inn') ||
                       text.includes('Resort') ||
                       text.includes('Suite') ||
                       text.includes('Guest') ||
                       text.includes('Hostel') ||
                       className.includes('hotel') ||
                       className.includes('property') ||
                       className.includes('accommodation') ||
                       className.includes('listing') ||
                       className.includes('item') ||
                       className.includes('card') ||
                       dataTestId.includes('hotel') ||
                       dataTestId.includes('property') ||
                       dataTestId.includes('accommodation') ||
                       dataTestId.includes('listing') ||
                       dataTestId.includes('item') ||
                       dataTestId.includes('card') ||
                       ariaLabel.includes('hotel') ||
                       ariaLabel.includes('property') ||
                       ariaLabel.includes('accommodation') ||
                       ariaLabel.includes('listing');
            }).map(div => ({
                text: div.textContent?.substring(0, 200) || '',
                className: div.className,
                dataTestId: div.getAttribute('data-testid') || '',
                ariaLabel: div.getAttribute('aria-label') || '',
                tagName: div.tagName
            }));
        });
        
        console.log('\n=== POTENTIAL HOTEL ELEMENTS ===');
        potentialHotels.forEach((item, index) => {
            console.log(`${index + 1}. ${item.tagName}`);
            console.log(`   Class: ${item.className}`);
            console.log(`   data-testid: ${item.dataTestId}`);
            console.log(`   aria-label: ${item.ariaLabel}`);
            console.log(`   Text: ${item.text}`);
            console.log('');
        });
        
        // Look for price elements
        const priceElements = await page.$$eval('*', elements => {
            return elements.filter(el => {
                const text = el.textContent || '';
                return text.includes('€') || text.includes('$') || text.includes('USD') || text.includes('EUR');
            }).map(el => ({
                text: el.textContent?.substring(0, 100) || '',
                tagName: el.tagName,
                className: el.className,
                dataTestId: el.getAttribute('data-testid') || ''
            }));
        });
        
        console.log('\n=== PRICE ELEMENTS ===');
        priceElements.forEach((item, index) => {
            console.log(`${index + 1}. ${item.tagName}`);
            console.log(`   Class: ${item.className}`);
            console.log(`   data-testid: ${item.dataTestId}`);
            console.log(`   Text: ${item.text}`);
            console.log('');
        });
        
        // Take a screenshot for visual inspection
        await page.screenshot({ path: 'debug_page.png', fullPage: true });
        console.log('\nScreenshot saved as debug_page.png');
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await browser.close();
    }
}

debugPageStructure().catch(console.error);



