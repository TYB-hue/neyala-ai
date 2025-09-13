const puppeteer = require('puppeteer');

async function discoverStructure() {
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
        console.log('Waiting for content to load...');
        await new Promise(resolve => setTimeout(resolve, 15000));
        
        // Scroll to trigger lazy loading
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight / 2);
        });
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        console.log('\n=== DISCOVERING PAGE STRUCTURE ===');
        
        // Method 1: Look for elements with hotel-related text
        const hotelTextElements = await page.$$eval('*', elements => {
            return elements.filter(el => {
                const text = el.textContent || '';
                return text.toLowerCase().includes('hotel') || 
                       text.toLowerCase().includes('inn') ||
                       text.toLowerCase().includes('resort') ||
                       text.toLowerCase().includes('suite') ||
                       text.toLowerCase().includes('guest') ||
                       text.toLowerCase().includes('hostel') ||
                       text.toLowerCase().includes('€') ||
                       text.toLowerCase().includes('$') ||
                       text.toLowerCase().includes('per night');
            }).map(el => ({
                tagName: el.tagName,
                text: el.textContent?.substring(0, 150) || '',
                className: el.className,
                id: el.id,
                dataTestId: el.getAttribute('data-testid') || '',
                dataComponent: el.getAttribute('data-component') || '',
                dataAutomation: el.getAttribute('data-automation') || '',
                role: el.getAttribute('role') || '',
                ariaLabel: el.getAttribute('aria-label') || ''
            }));
        });
        
        console.log('\n=== ELEMENTS WITH HOTEL-RELATED TEXT ===');
        hotelTextElements.slice(0, 20).forEach((item, index) => {
            console.log(`${index + 1}. ${item.tagName}`);
            console.log(`   Class: ${item.className}`);
            console.log(`   ID: ${item.id}`);
            console.log(`   data-testid: ${item.dataTestId}`);
            console.log(`   data-component: ${item.dataComponent}`);
            console.log(`   data-automation: ${item.dataAutomation}`);
            console.log(`   role: ${item.role}`);
            console.log(`   aria-label: ${item.ariaLabel}`);
            console.log(`   Text: ${item.text}`);
            console.log('');
        });
        
        // Method 2: Look for elements with price information
        const priceElements = await page.$$eval('*', elements => {
            return elements.filter(el => {
                const text = el.textContent || '';
                return text.includes('€') || text.includes('$') || text.includes('USD') || text.includes('EUR');
            }).map(el => ({
                tagName: el.tagName,
                text: el.textContent?.substring(0, 100) || '',
                className: el.className,
                dataTestId: el.getAttribute('data-testid') || '',
                parentClass: el.parentElement?.className || '',
                parentDataTestId: el.parentElement?.getAttribute('data-testid') || ''
            }));
        });
        
        console.log('\n=== ELEMENTS WITH PRICE INFORMATION ===');
        priceElements.slice(0, 15).forEach((item, index) => {
            console.log(`${index + 1}. ${item.tagName}`);
            console.log(`   Class: ${item.className}`);
            console.log(`   data-testid: ${item.dataTestId}`);
            console.log(`   Parent Class: ${item.parentClass}`);
            console.log(`   Parent data-testid: ${item.parentDataTestId}`);
            console.log(`   Text: ${item.text}`);
            console.log('');
        });
        
        // Method 3: Look for card-like containers
        const cardElements = await page.$$eval('div', divs => {
            return divs.filter(div => {
                const className = div.className || '';
                const style = div.style.cssText || '';
                const children = div.children.length;
                
                // Look for elements that might be hotel cards
                return className.includes('card') ||
                       className.includes('item') ||
                       className.includes('listing') ||
                       className.includes('property') ||
                       className.includes('hotel') ||
                       className.includes('accommodation') ||
                       className.includes('sr_') ||
                       style.includes('border') ||
                       style.includes('shadow') ||
                       children > 3; // Cards usually have multiple children
            }).map(div => ({
                className: div.className,
                id: div.id,
                dataTestId: div.getAttribute('data-testid') || '',
                children: div.children.length,
                text: div.textContent?.substring(0, 200) || '',
                style: div.style.cssText
            }));
        });
        
        console.log('\n=== POTENTIAL CARD CONTAINERS ===');
        cardElements.slice(0, 15).forEach((item, index) => {
            console.log(`${index + 1}. div`);
            console.log(`   Class: ${item.className}`);
            console.log(`   ID: ${item.id}`);
            console.log(`   data-testid: ${item.dataTestId}`);
            console.log(`   Children: ${item.children}`);
            console.log(`   Style: ${item.style}`);
            console.log(`   Text: ${item.text}`);
            console.log('');
        });
        
        // Method 4: Get all unique data-testid values
        const allDataTestIds = await page.$$eval('[data-testid]', elements => {
            const ids = elements.map(el => el.getAttribute('data-testid')).filter(id => id);
            return [...new Set(ids)]; // Remove duplicates
        });
        
        console.log('\n=== ALL UNIQUE DATA-TESTID VALUES ===');
        allDataTestIds.forEach((id, index) => {
            console.log(`${index + 1}. ${id}`);
        });
        
        // Method 5: Look for elements with specific patterns
        const patterns = [
            'div[class*="sr_"]',
            'div[class*="property"]',
            'div[class*="hotel"]',
            'div[class*="card"]',
            'div[class*="item"]',
            'div[class*="listing"]',
            'div[class*="accommodation"]',
            'div[data-testid*="property"]',
            'div[data-testid*="hotel"]',
            'div[data-testid*="card"]',
            'div[data-testid*="item"]',
            'div[data-testid*="listing"]'
        ];
        
        console.log('\n=== TESTING COMMON PATTERNS ===');
        for (const pattern of patterns) {
            try {
                const elements = await page.$$(pattern);
                console.log(`${pattern}: ${elements.length} elements`);
            } catch (error) {
                console.log(`${pattern}: ERROR - ${error.message}`);
            }
        }
        
        // Take a screenshot
        await page.screenshot({ path: 'discover_structure.png', fullPage: true });
        console.log('\nScreenshot saved as discover_structure.png');
        
        console.log('\n=== NEXT STEPS ===');
        console.log('1. Look at the elements with hotel-related text above');
        console.log('2. Check the price elements to find hotel containers');
        console.log('3. Examine the card containers for hotel listings');
        console.log('4. Use the data-testid values to create new selectors');
        console.log('5. Share the results with me so I can update the scraper');
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await browser.close();
    }
}

discoverStructure().catch(console.error);



