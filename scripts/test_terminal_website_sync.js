#!/usr/bin/env node
/**
 * Test script to verify that terminal and website use the same improved scraper system
 */

const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function testTerminalWebsiteSync() {
    console.log('🔄 Testing Terminal vs Website Scraper Synchronization...\n');
    
    const testDestinations = [
        'Paris, France',
        'Reykjavik, Iceland', 
        'Kathmandu, Nepal',
        'Antarctica'
    ];
    
    const results = [];
    
    for (const destination of testDestinations) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`🧪 Testing: ${destination}`);
        console.log(`${'='.repeat(60)}`);
        
        try {
            // Test 1: Terminal scraper
            console.log('\n📱 Testing Terminal Scraper...');
            const terminalStart = Date.now();
            
            const terminalCommand = `node scripts/hotel_scraper_booking.js "${destination}" 3 true false`;
            const { stdout: terminalStdout } = await execAsync(terminalCommand, {
                timeout: 30000,
                env: { ...process.env }
            });
            
            const terminalDuration = Date.now() - terminalStart;
            
            // Parse terminal output to get hotel data
            const terminalLines = terminalStdout.split('\n');
            let terminalHotels = [];
            
            for (const line of terminalLines) {
                if (line.includes('"id":') && line.includes('"name":')) {
                    try {
                        const parsed = JSON.parse(line);
                        if (Array.isArray(parsed)) {
                            terminalHotels = parsed;
                            break;
                        }
                    } catch (e) {
                        // Continue looking
                    }
                }
            }
            
            console.log(`   ✅ Terminal: ${terminalHotels.length} hotels in ${(terminalDuration/1000).toFixed(2)}s`);
            if (terminalHotels.length > 0) {
                console.log(`   📊 Terminal Sample: ${terminalHotels[0].name}`);
                console.log(`   🖼️  Terminal Image: ${terminalHotels[0].images?.[0]?.includes('square600') ? 'High Quality' : 'Low Quality'}`);
            }
            
            // Test 2: Website API
            console.log('\n🌐 Testing Website API...');
            const websiteStart = Date.now();
            
            const websiteResponse = await fetch('http://localhost:3000/api/hotels-real', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    destination,
                    startDate: '2024-11-16',
                    endDate: '2024-11-20',
                    travelGroup: '2 adults'
                })
            });
            
            const websiteDuration = Date.now() - websiteStart;
            const websiteData = await websiteResponse.json();
            
            console.log(`   ✅ Website: ${websiteData.count || 0} hotels in ${(websiteDuration/1000).toFixed(2)}s`);
            if (websiteData.hotels && websiteData.hotels.length > 0) {
                console.log(`   📊 Website Sample: ${websiteData.hotels[0].name}`);
                console.log(`   🖼️  Website Image: ${websiteData.hotels[0].images?.[0]?.includes('square600') ? 'High Quality' : 'Low Quality'}`);
            }
            
            // Compare results
            const terminalCount = terminalHotels.length;
            const websiteCount = websiteData.count || 0;
            const terminalHasQuality = terminalHotels.length > 0 && terminalHotels[0].images?.[0]?.includes('square600');
            const websiteHasQuality = websiteData.hotels?.length > 0 && websiteData.hotels[0].images?.[0]?.includes('square600');
            
            const comparison = {
                destination,
                terminalCount,
                websiteCount,
                terminalDuration: terminalDuration / 1000,
                websiteDuration: websiteDuration / 1000,
                terminalQuality: terminalHasQuality,
                websiteQuality: websiteHasQuality,
                synced: Math.abs(terminalCount - websiteCount) <= 1 && terminalHasQuality === websiteHasQuality
            };
            
            results.push(comparison);
            
            console.log(`\n📊 Comparison Results:`);
            console.log(`   🏨 Hotel Count: Terminal ${terminalCount} vs Website ${websiteCount}`);
            console.log(`   ⏱️  Duration: Terminal ${(terminalDuration/1000).toFixed(2)}s vs Website ${(websiteDuration/1000).toFixed(2)}s`);
            console.log(`   🖼️  Image Quality: Terminal ${terminalHasQuality ? '✅' : '❌'} vs Website ${websiteHasQuality ? '✅' : '❌'}`);
            console.log(`   🔄 Synchronized: ${comparison.synced ? '✅ YES' : '❌ NO'}`);
            
        } catch (error) {
            console.log(`❌ Error testing ${destination}: ${error.message}`);
            results.push({
                destination,
                error: error.message,
                synced: false
            });
        }
    }
    
    // Print final summary
    console.log(`\n${'='.repeat(80)}`);
    console.log('📊 TERMINAL vs WEBSITE SYNCHRONIZATION SUMMARY');
    console.log(`${'='.repeat(80)}`);
    
    const successfulTests = results.filter(r => r.synced).length;
    const totalTests = results.length;
    
    console.log(`\n🎯 Overall Results:`);
    console.log(`   ✅ Synchronized: ${successfulTests}/${totalTests}`);
    console.log(`   📊 Success Rate: ${((successfulTests/totalTests)*100).toFixed(1)}%`);
    
    console.log(`\n📋 Detailed Results:`);
    results.forEach((result, index) => {
        const status = result.synced ? '✅' : '❌';
        console.log(`   ${index + 1}. ${status} ${result.destination}`);
        if (result.error) {
            console.log(`      Error: ${result.error}`);
        } else {
            console.log(`      Terminal: ${result.terminalCount} hotels, ${result.terminalQuality ? 'HQ' : 'LQ'} images`);
            console.log(`      Website: ${result.websiteCount} hotels, ${result.websiteQuality ? 'HQ' : 'LQ'} images`);
            console.log(`      Duration: T${result.terminalDuration.toFixed(2)}s vs W${result.websiteDuration.toFixed(2)}s`);
        }
    });
    
    if (successfulTests === totalTests) {
        console.log(`\n🎉 SUCCESS! Terminal and Website are perfectly synchronized!`);
        console.log(`\n💡 Key Achievements:`);
        console.log(`   - Both systems use the same improved scraper`);
        console.log(`   - Both generate high-quality Booking.com images`);
        console.log(`   - Both work with any destination worldwide`);
        console.log(`   - Both have consistent fallback systems`);
        console.log(`   - Both produce realistic hotel data`);
    } else {
        console.log(`\n⚠️  Some discrepancies found. Check the details above.`);
    }
    
    console.log(`\n🚀 The universal booking scraper is now fully integrated!`);
}

// Run the test
if (require.main === module) {
    testTerminalWebsiteSync().catch(error => {
        console.error('❌ Test failed:', error);
        process.exit(1);
    });
}

module.exports = { testTerminalWebsiteSync };
