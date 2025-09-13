require('dotenv').config({ path: '.env.local' });

async function testGomapsProAirport() {
  console.log('🧪 Testing GOMAPS.PRO API for Airport Photos...\n');
  
  const airportName = 'Narita International Airport';
  const destination = 'Tokyo, Japan';
  
  console.log(`Testing airport: ${airportName}`);
  console.log(`Destination: ${destination}`);
  console.log(`GOMAPS_API_KEY: ${process.env.GOMAPS_API_KEY ? 'SET' : 'NOT SET'}\n`);
  
  try {
    if (!process.env.GOMAPS_API_KEY) {
      console.log('❌ GOMAPS_API_KEY not found in environment variables');
      console.log('Please set your GOMAPS.PRO API key in .env.local file');
      return;
    }
    
    // Test 1: Search for airport using GOMAPS.PRO
    console.log('🔍 Test 1: Searching for airport using GOMAPS.PRO');
    const searchQueries = [
      airportName,
      `${airportName} airport`,
      airportName.replace('International', '').replace('Airport', '').trim() + ' airport'
    ];
    
    for (const query of searchQueries) {
      console.log(`\n   Searching for: "${query}"`);
      
      const apiUrl = `https://maps.gomaps.pro/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${process.env.GOMAPS_API_KEY}`;
      
      const response = await fetch(apiUrl);
      
      console.log(`   Response status: ${response.status}`);
      
      if (!response.ok) {
        console.log(`   ❌ API request failed: ${response.status} ${response.statusText}`);
        continue;
      }
      
      const data = await response.json();
      console.log(`   API status: ${data.status}`);
      
      if (data.status === 'REQUEST_DENIED') {
        console.log(`   ❌ API access denied: ${data.error_message || 'Unknown error'}`);
        continue;
      }
      
      if (data.status === 'ZERO_RESULTS') {
        console.log(`   ⚠️  No results found for this query`);
        continue;
      }
      
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const airport = data.results[0];
        console.log(`   ✅ Found airport: ${airport.name}`);
        console.log(`   📍 Address: ${airport.formatted_address}`);
        console.log(`   ⭐ Rating: ${airport.rating || 'N/A'}`);
        
        if (airport.photos && airport.photos.length > 0) {
          console.log(`   📸 Found ${airport.photos.length} photos`);
          
          // Test photo URLs
          airport.photos.slice(0, 3).forEach((photo, index) => {
            const photoUrl = `https://maps.gomaps.pro/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${process.env.GOMAPS_API_KEY}`;
            console.log(`   Photo ${index + 1}: ${photoUrl}`);
          });
          
          console.log('\n✅ Successfully found airport photos from GOMAPS.PRO!');
          return;
        } else {
          console.log(`   ❌ No photos available for this airport`);
        }
      }
    }
    
    // Test 2: Try with destination
    console.log('\n🔍 Test 2: Searching with destination');
    const destinationQuery = `${airportName} ${destination}`;
    const apiUrl = `https://maps.gomaps.pro/maps/api/place/textsearch/json?query=${encodeURIComponent(destinationQuery)}&key=${process.env.GOMAPS_API_KEY}`;
    
    const response = await fetch(apiUrl);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const airport = data.results[0];
        console.log(`✅ Found airport with destination search: ${airport.name}`);
        
        if (airport.photos && airport.photos.length > 0) {
          console.log(`📸 Found ${airport.photos.length} photos with destination search`);
          airport.photos.slice(0, 3).forEach((photo, index) => {
            const photoUrl = `https://maps.gomaps.pro/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${process.env.GOMAPS_API_KEY}`;
            console.log(`Photo ${index + 1}: ${photoUrl}`);
          });
          return;
        }
      }
    }
    
    console.log('\n❌ No airport photos found from GOMAPS.PRO API');
    
  } catch (error) {
    console.error('❌ Error testing GOMAPS.PRO API:', error.message);
  }
}

// Run the test
testGomapsProAirport().then(() => {
  console.log('\n🏁 Test completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});

