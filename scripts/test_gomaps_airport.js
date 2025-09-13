require('dotenv').config({ path: '.env.local' });

async function testGomapsAirportPhotos() {
  console.log('🧪 Testing GOMAPS.PRO API for Airport Photos...\n');
  
  const airportName = 'Narita International Airport';
  const destination = 'Tokyo, Japan';
  
  console.log(`Testing airport: ${airportName}`);
  console.log(`Destination: ${destination}`);
  console.log(`GOMAPS_API_KEY: ${process.env.GOMAPS_API_KEY ? 'SET' : 'NOT SET'}\n`);
  
  try {
    // Test the GOMAPS.PRO API directly
    if (!process.env.GOMAPS_API_KEY) {
      console.log('❌ GOMAPS_API_KEY not found in environment variables');
      console.log('Please set your GOMAPS.PRO API key in .env.local file');
      return;
    }
    
    const searchQueries = [
      airportName,
      `${airportName} airport`,
      airportName.replace('International', '').replace('Airport', '').trim() + ' airport'
    ];
    
    for (const query of searchQueries) {
      console.log(`🔍 Searching for: "${query}"`);
      
      const apiUrl = `https://api.gomaps.pro/v1/places/search?query=${encodeURIComponent(query)}&type=airport&limit=1`;
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${process.env.GOMAPS_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`Response status: ${response.status}`);
      
      if (!response.ok) {
        console.log(`❌ API request failed: ${response.status} ${response.statusText}`);
        continue;
      }
      
      const data = await response.json();
      console.log(`✅ API response received`);
      
      if (data.results && data.results.length > 0) {
        const airport = data.results[0];
        console.log(`📍 Found airport: ${airport.name}`);
        console.log(`📍 Address: ${airport.formatted_address}`);
        console.log(`📍 Rating: ${airport.rating || 'N/A'}`);
        
        if (airport.photos && airport.photos.length > 0) {
          console.log(`📸 Found ${airport.photos.length} photos`);
          
          const photos = airport.photos.slice(0, 3).map((photo, index) => {
            const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY || process.env.GOMAPS_API_KEY}`;
            console.log(`   Photo ${index + 1}: ${photoUrl}`);
            return photoUrl;
          });
          
          console.log('\n✅ Successfully generated photo URLs');
          return photos;
        } else {
          console.log('❌ No photos found for this airport');
        }
      } else {
        console.log('❌ No airport found for this query');
      }
    }
    
    // Try with destination
    console.log(`\n🔍 Searching with destination: "${airportName} ${destination}"`);
    const destinationQuery = `${airportName} ${destination}`;
    const apiUrl = `https://api.gomaps.pro/v1/places/search?query=${encodeURIComponent(destinationQuery)}&type=airport&limit=1`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.GOMAPS_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const airport = data.results[0];
        console.log(`📍 Found airport with destination search: ${airport.name}`);
        
        if (airport.photos && airport.photos.length > 0) {
          console.log(`📸 Found ${airport.photos.length} photos with destination search`);
          const photos = airport.photos.slice(0, 3).map((photo, index) => {
            const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY || process.env.GOMAPS_API_KEY}`;
            console.log(`   Photo ${index + 1}: ${photoUrl}`);
            return photoUrl;
          });
          return photos;
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing GOMAPS.PRO API:', error.message);
  }
  
  console.log('\n❌ No photos found from GOMAPS.PRO API');
  return [];
}

// Run the test
testGomapsAirportPhotos().then(() => {
  console.log('\n🏁 Test completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});

