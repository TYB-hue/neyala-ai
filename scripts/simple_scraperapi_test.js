#!/usr/bin/env node
/**
 * Simple ScraperAPI test using the provided API key
 */

const https = require('https');

async function testScraperApi() {
    console.log('🧪 Testing ScraperAPI with your API key...\n');
    
    const apiKey = process.env.SCRAPER_API_KEY;
    const testUrl = 'https://httpbin.org/ip'; // Simple test URL
    
    if (!apiKey) {
        console.log('❌ SCRAPER_API_KEY not found in environment variables');
        console.log('Please set your ScraperAPI key in .env.local file');
        return;
    }
    
    console.log(`API Key: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`);
    console.log(`Test URL: ${testUrl}\n`);
    
    const params = new URLSearchParams({
        api_key: apiKey,
        url: testUrl,
        render: 'false'
    });
    
    const options = {
        hostname: 'api.scraperapi.com',
        port: 443,
        path: `/?${params.toString()}`,
        method: 'GET',
        timeout: 30000
    };
    
    console.log('Making request to ScraperAPI...');
    console.log(`URL: https://api.scraperapi.com/?${params.toString()}\n`);
    
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('✅ ScraperAPI request successful!');
                    console.log(`Status: ${res.statusCode}`);
                    console.log(`Response length: ${data.length} characters`);
                    console.log('\nResponse preview:');
                    console.log(data.substring(0, 500) + '...');
                    resolve(data);
                } else {
                    console.error(`❌ ScraperAPI error: ${res.statusCode}`);
                    console.error('Response:', data);
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                }
            });
        });
        
        req.on('error', (error) => {
            console.error('❌ Request failed:', error.message);
            reject(error);
        });
        
        req.on('timeout', () => {
            console.error('❌ Request timed out');
            req.destroy();
            reject(new Error('Request timed out'));
        });
        
        req.end();
    });
}

// Test with Booking.com URL
async function testBookingCom() {
    console.log('\n' + '='.repeat(50));
    console.log('🔍 Testing with Booking.com URL...\n');
    
    const apiKey = process.env.SCRAPER_API_KEY;
    const bookingUrl = 'https://www.booking.com/hotel/index.html?label=gen173bo-10CAQoggI46wdICVgDaIkCiAEBmAEzuAEHyAEN2AED6AEB-AEBiAIBmAICqAIBuAL-hJfFBsACAdICJDRhMTZjYTYxLTkwYjEtNDYyZS05MDA0LTMwMjk0OTMxMzU0YtgCAeACAQ&sid=2f36d9903399dc74e7ef8e02da318126&aid=304142';
    
    if (!apiKey) {
        console.log('❌ SCRAPER_API_KEY not found in environment variables');
        console.log('Please set your ScraperAPI key in .env.local file');
        return;
    }
    
    const params = new URLSearchParams({
        api_key: apiKey,
        url: bookingUrl,
        render: 'true',
        premium: 'true',
        country_code: 'us'
    });
    
    const options = {
        hostname: 'api.scraperapi.com',
        port: 443,
        path: `/?${params.toString()}`,
        method: 'GET',
        timeout: 60000 // 60 seconds for complex pages
    };
    
    console.log('Making request to Booking.com via ScraperAPI...');
    console.log(`URL: ${bookingUrl}\n`);
    
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log('✅ Booking.com request successful!');
                    console.log(`Status: ${res.statusCode}`);
                    console.log(`Response length: ${data.length} characters`);
                    
                    // Check if we got HTML content
                    if (data.includes('<html') || data.includes('<!DOCTYPE')) {
                        console.log('✅ Received HTML content');
                        console.log('\nPage title:');
                        const titleMatch = data.match(/<title[^>]*>([^<]+)<\/title>/i);
                        if (titleMatch) {
                            console.log(titleMatch[1]);
                        }
                        
                        // Check for hotel-related content
                        if (data.includes('hotel') || data.includes('booking') || data.includes('accommodation')) {
                            console.log('✅ Found hotel-related content');
                        }
                    } else {
                        console.log('⚠️ Response might not be HTML');
                    }
                    
                    console.log('\nResponse preview (first 500 chars):');
                    console.log(data.substring(0, 500) + '...');
                    resolve(data);
                } else {
                    console.error(`❌ Booking.com request failed: ${res.statusCode}`);
                    console.error('Response:', data.substring(0, 200));
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                }
            });
        });
        
        req.on('error', (error) => {
            console.error('❌ Request failed:', error.message);
            reject(error);
        });
        
        req.on('timeout', () => {
            console.error('❌ Request timed out');
            req.destroy();
            reject(new Error('Request timed out'));
        });
        
        req.end();
    });
}

// Run tests
async function runTests() {
    try {
        // Test 1: Basic connectivity
        await testScraperApi();
        
        // Test 2: Booking.com
        await testBookingCom();
        
        console.log('\n' + '='.repeat(50));
        console.log('🎉 All tests completed successfully!');
        console.log('✅ ScraperAPI is working correctly');
        console.log('✅ You can now use it for hotel scraping');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    runTests();
}

module.exports = { testScraperApi, testBookingCom };

