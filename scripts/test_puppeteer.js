#!/usr/bin/env node
/**
 * Test script for Puppeteer hotel scraper
 */

const BookingHotelScraper = require('./hotel_scraper_puppeteer');

async function testScraper() {
    console.log('Testing Puppeteer hotel scraper...');
    
    const scraper = new BookingHotelScraper({
        headless: true,
        useBrightData: false // Test without Bright Data first
    });
    
    try {
        const hotels = await scraper.scrapeHotels('New York', 3);
        
        console.log(`\nTest completed! Found ${hotels.length} hotels:`);
        hotels.forEach((hotel, i) => {
            console.log(`${i + 1}. ${hotel.name}`);
            console.log(`   Price: $${hotel.price}`);
            console.log(`   Rating: ${hotel.rating}`);
            console.log(`   Source: ${hotel.source}`);
            console.log();
        });
        
        return hotels;
    } catch (error) {
        console.error('Test failed:', error.message);
        return [];
    }
}

// Run test if called directly
if (require.main === module) {
    testScraper();
}

module.exports = testScraper;



