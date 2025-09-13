require('dotenv').config({ path: '.env.local' });

async function testGomapsKeyFormat() {
  console.log('🧪 Testing GOMAPS.PRO API Key Format...\n');
  
  console.log(`GOMAPS_API_KEY: ${process.env.GOMAPS_API_KEY ? 'SET' : 'NOT SET'}`);
  if (process.env.GOMAPS_API_KEY) {
    console.log(`Key length: ${process.env.GOMAPS_API_KEY.length}`);
    console.log(`Key starts with: ${process.env.GOMAPS_API_KEY.substring(0, 10)}...`);
    console.log(`Key ends with: ...${process.env.GOMAPS_API_KEY.substring(process.env.GOMAPS_API_KEY.length - 4)}`);
  }
  
  try {
    // Test 1: Try with Authorization header (Bearer token)
    console.log('\n🔍 Test 1: Using Authorization header (Bearer token)');
    const url1 = `https://maps.gomaps.pro/maps/api/place/textsearch/json?query=airport&key=${process.env.GOMAPS_API_KEY}`;
    
    const response1 = await fetch(url1, {
      headers: {
        'Authorization': `Bearer ${process.env.GOMAPS_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Response 1 status: ${response1.status}`);
    
    if (response1.ok) {
      const data1 = await response1.json();
      console.log('Response 1 data:', JSON.stringify(data1, null, 2));
    } else {
      const errorText = await response1.text();
      console.log('Response 1 error:', errorText);
    }
    
    // Test 2: Try without Authorization header (just key parameter)
    console.log('\n🔍 Test 2: Using key parameter only');
    const url2 = `https://maps.gomaps.pro/maps/api/place/textsearch/json?query=airport&key=${process.env.GOMAPS_API_KEY}`;
    
    const response2 = await fetch(url2);
    
    console.log(`Response 2 status: ${response2.status}`);
    
    if (response2.ok) {
      const data2 = await response2.json();
      console.log('Response 2 data:', JSON.stringify(data2, null, 2));
    } else {
      const errorText = await response2.text();
      console.log('Response 2 error:', errorText);
    }
    
    // Test 3: Try with different API endpoint
    console.log('\n🔍 Test 3: Using different API endpoint');
    const url3 = `https://api.gomaps.pro/v1/places/search?query=airport&key=${process.env.GOMAPS_API_KEY}`;
    
    const response3 = await fetch(url3);
    
    console.log(`Response 3 status: ${response3.status}`);
    
    if (response3.ok) {
      const data3 = await response3.json();
      console.log('Response 3 data:', JSON.stringify(data3, null, 2));
    } else {
      const errorText = await response3.text();
      console.log('Response 3 error:', errorText);
    }
    
    // Test 4: Try with Authorization header on different endpoint
    console.log('\n🔍 Test 4: Using Authorization header on different endpoint');
    const url4 = `https://api.gomaps.pro/v1/places/search?query=airport`;
    
    const response4 = await fetch(url4, {
      headers: {
        'Authorization': `Bearer ${process.env.GOMAPS_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Response 4 status: ${response4.status}`);
    
    if (response4.ok) {
      const data4 = await response4.json();
      console.log('Response 4 data:', JSON.stringify(data4, null, 2));
    } else {
      const errorText = await response4.text();
      console.log('Response 4 error:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGomapsKeyFormat().then(() => {
  console.log('\n🏁 Test completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});

