require('dotenv').config({ path: '.env.local' });

async function testGoogleMapsStatus() {
  console.log('🧪 Testing Google Maps API Key Status...\n');
  
  console.log(`API Key: ${process.env.GOMAPS_API_KEY ? 'SET' : 'NOT SET'}`);
  if (process.env.GOMAPS_API_KEY) {
    console.log(`Key length: ${process.env.GOMAPS_API_KEY.length}`);
    console.log(`Key starts with: ${process.env.GOMAPS_API_KEY.substring(0, 10)}...`);
  }
  
  try {
    // Test 1: Check if the API key is valid with a simple request
    console.log('\n🔍 Test 1: Basic API key validation');
    const url1 = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=test&key=${process.env.GOMAPS_API_KEY}`;
    
    const response1 = await fetch(url1);
    const data1 = await response1.json();
    
    console.log(`Response status: ${response1.status}`);
    console.log(`API status: ${data1.status}`);
    
    if (data1.status === 'REQUEST_DENIED') {
      console.log('❌ API access denied. Possible reasons:');
      console.log('   - Places API not enabled for this API key');
      console.log('   - Billing not set up for Google Cloud project');
      console.log('   - API key has domain restrictions');
      console.log('   - API key is invalid or expired');
      console.log(`   - Error message: ${data1.error_message || 'No specific error message'}`);
      
      if (data1.error_message) {
        console.log('\n🔧 To fix this:');
        console.log('1. Go to Google Cloud Console: https://console.cloud.google.com/');
        console.log('2. Select your project');
        console.log('3. Go to "APIs & Services" > "Library"');
        console.log('4. Search for "Places API" and enable it');
        console.log('5. Go to "APIs & Services" > "Credentials"');
        console.log('6. Check if your API key has the right restrictions');
        console.log('7. Set up billing if not already done');
      }
    } else if (data1.status === 'OK') {
      console.log('✅ API key is working correctly!');
    } else {
      console.log(`⚠️  API returned status: ${data1.status}`);
    }
    
    // Test 2: Try a different API to see if the key works at all
    console.log('\n🔍 Test 2: Testing with Geocoding API (usually enabled by default)');
    const url2 = `https://maps.googleapis.com/maps/api/geocode/json?address=test&key=${process.env.GOMAPS_API_KEY}`;
    
    const response2 = await fetch(url2);
    const data2 = await response2.json();
    
    console.log(`Geocoding API status: ${data2.status}`);
    
    if (data2.status === 'OK') {
      console.log('✅ Geocoding API works - your API key is valid');
      console.log('❌ Places API is likely not enabled');
    } else if (data2.status === 'REQUEST_DENIED') {
      console.log('❌ API key has fundamental issues (billing, restrictions, etc.)');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGoogleMapsStatus().then(() => {
  console.log('\n🏁 Test completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});

