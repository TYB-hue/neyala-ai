require('dotenv').config({ path: '.env.local' });

async function testGomapsSimple() {
  console.log('🧪 Simple GOMAPS.PRO API Test...\n');
  
  console.log(`GOMAPS_API_KEY: ${process.env.GOMAPS_API_KEY ? 'SET' : 'NOT SET'}`);
  if (process.env.GOMAPS_API_KEY) {
    console.log(`Key length: ${process.env.GOMAPS_API_KEY.length}`);
    console.log(`Key starts with: ${process.env.GOMAPS_API_KEY.substring(0, 10)}...`);
  }
  
  try {
    // Test 1: Simple search without type parameter
    console.log('\n🔍 Test 1: Simple search for "airport"');
    const url1 = `https://api.gomaps.pro/v1/places/search?query=airport&limit=1`;
    
    const response1 = await fetch(url1, {
      headers: {
        'Authorization': `Bearer ${process.env.GOMAPS_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Response 1 status: ${response1.status}`);
    console.log(`Response 1 headers:`, Object.fromEntries(response1.headers.entries()));
    
    if (response1.ok) {
      const data1 = await response1.json();
      console.log('Response 1 data:', JSON.stringify(data1, null, 2));
    } else {
      const errorText = await response1.text();
      console.log('Response 1 error:', errorText);
    }
    
    // Test 2: Try with different API endpoint format
    console.log('\n🔍 Test 2: Different endpoint format');
    const url2 = `https://api.gomaps.pro/places/search?query=airport&limit=1`;
    
    const response2 = await fetch(url2, {
      headers: {
        'Authorization': `Bearer ${process.env.GOMAPS_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Response 2 status: ${response2.status}`);
    
    if (response2.ok) {
      const data2 = await response2.json();
      console.log('Response 2 data:', JSON.stringify(data2, null, 2));
    } else {
      const errorText = await response2.text();
      console.log('Response 2 error:', errorText);
    }
    
    // Test 3: Try without Authorization header
    console.log('\n🔍 Test 3: Without Authorization header');
    const url3 = `https://api.gomaps.pro/v1/places/search?query=airport&limit=1&key=${process.env.GOMAPS_API_KEY}`;
    
    const response3 = await fetch(url3, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Response 3 status: ${response3.status}`);
    
    if (response3.ok) {
      const data3 = await response3.json();
      console.log('Response 3 data:', JSON.stringify(data3, null, 2));
    } else {
      const errorText = await response3.text();
      console.log('Response 3 error:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGomapsSimple().then(() => {
  console.log('\n🏁 Test completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});

