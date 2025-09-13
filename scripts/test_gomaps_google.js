require('dotenv').config({ path: '.env.local' });

async function testGoogleMapsAPI() {
  console.log('🧪 Testing as Google Maps API Key...\n');
  
  console.log(`API Key: ${process.env.GOMAPS_API_KEY ? 'SET' : 'NOT SET'}`);
  if (process.env.GOMAPS_API_KEY) {
    console.log(`Key length: ${process.env.GOMAPS_API_KEY.length}`);
    console.log(`Key starts with: ${process.env.GOMAPS_API_KEY.substring(0, 10)}...`);
  }
  
  try {
    // Test with Google Maps Places API
    console.log('\n🔍 Testing Google Maps Places API');
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=airport&key=${process.env.GOMAPS_API_KEY}`;
    
    const response = await fetch(url);
    
    console.log(`Response status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response status:', data.status);
      console.log('Results count:', data.results ? data.results.length : 0);
      
      if (data.results && data.results.length > 0) {
        console.log('First result:', {
          name: data.results[0].name,
          place_id: data.results[0].place_id,
          photos: data.results[0].photos ? data.results[0].photos.length : 0
        });
        
        // Test getting photos
        if (data.results[0].photos && data.results[0].photos.length > 0) {
          const photoRef = data.results[0].photos[0].photo_reference;
          const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${process.env.GOMAPS_API_KEY}`;
          console.log('Photo URL:', photoUrl);
        }
      }
    } else {
      const errorText = await response.text();
      console.log('Response error:', errorText);
    }
    
    // Test with specific airport search
    console.log('\n🔍 Testing specific airport search');
    const airportUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=Narita+International+Airport&key=${process.env.GOMAPS_API_KEY}`;
    
    const airportResponse = await fetch(airportUrl);
    
    console.log(`Airport response status: ${airportResponse.status}`);
    
    if (airportResponse.ok) {
      const airportData = await airportResponse.json();
      console.log('Airport response status:', airportData.status);
      console.log('Airport results count:', airportData.results ? airportData.results.length : 0);
      
      if (airportData.results && airportData.results.length > 0) {
        const airport = airportData.results[0];
        console.log('Airport found:', {
          name: airport.name,
          place_id: airport.place_id,
          photos: airport.photos ? airport.photos.length : 0,
          rating: airport.rating,
          address: airport.formatted_address
        });
        
        if (airport.photos && airport.photos.length > 0) {
          console.log('Airport photos available:', airport.photos.length);
          airport.photos.slice(0, 3).forEach((photo, index) => {
            const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${process.env.GOMAPS_API_KEY}`;
            console.log(`Photo ${index + 1}:`, photoUrl);
          });
        }
      }
    } else {
      const errorText = await airportResponse.text();
      console.log('Airport response error:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGoogleMapsAPI().then(() => {
  console.log('\n🏁 Test completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});

