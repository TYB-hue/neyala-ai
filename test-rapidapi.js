const axios = require('axios');

const RAPIDAPI_KEY = '8073afca15msh1481d4cb88d3b40p1e6e00jsn99bc9c5aa5ca';
const RAPIDAPI_HOST = 'booking-com15.p.rapidapi.com';

// Helper function to get future dates
function getFutureDates() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  
  return {
    arrival: tomorrow.toISOString().split('T')[0], // YYYY-MM-DD format
    departure: dayAfterTomorrow.toISOString().split('T')[0]
  };
}

async function testRapidAPI() {
  try {
    console.log('🚀 Testing RapidAPI Booking.com Integration...\n');
    
    const dates = getFutureDates();
    console.log('📅 Using dates:', dates);

    // Test 1: Search for location
    console.log('1️⃣ Testing destination search...');
    const locationResponse = await axios.get(
      `https://${RAPIDAPI_HOST}/api/v1/hotels/searchDestination`,
      {
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': RAPIDAPI_HOST
        },
        params: {
          query: 'New York'
        }
      }
    );

    console.log('📍 Location Response Status:', locationResponse.status);
    console.log('📍 Location Response Data:', JSON.stringify(locationResponse.data, null, 2));

    if (locationResponse.data && locationResponse.data.data && locationResponse.data.data.length > 0) {
      const destination = locationResponse.data.data[0];
      console.log('✅ Destination found:', destination.name, '(ID:', destination.dest_id, ')');
      console.log('📍 Full destination object:', JSON.stringify(destination, null, 2));

      // Test 2: Search for hotels with different parameters
      console.log('\n2️⃣ Testing hotel search with different parameters...');
      
      // Try different date formats and parameters
      const testParams = [
        {
          name: 'Basic search',
          params: {
            dest_id: destination.dest_id,
            search_type: destination.search_type || 'city',
            arrival_date: dates.arrival,
            departure_date: dates.departure,
            adults: 1,
            children_age: 0,
            room_qty: 1,
            page_number: 1,
            units: 'metric',
            temperature_unit: 'c',
            languagecode: 'en-us',
            currency_code: 'USD'
          }
        },
        {
          name: 'Alternative search',
          params: {
            dest_id: destination.dest_id,
            search_type: 'city',
            arrival_date: dates.arrival,
            departure_date: dates.departure,
            adults: 1,
            children_age: '',
            room_qty: 1,
            page_number: 1,
            units: 'metric',
            temperature_unit: 'c',
            languagecode: 'en-us',
            currency_code: 'USD'
          }
        },
        {
          name: 'Minimal search',
          params: {
            dest_id: destination.dest_id,
            search_type: 'city',
            arrival_date: dates.arrival,
            departure_date: dates.departure,
            adults: 1,
            room_qty: 1
          }
        }
      ];

      for (const test of testParams) {
        console.log(`\n🔍 Testing: ${test.name}`);
        console.log('🏨 Hotel Search Params:', JSON.stringify(test.params, null, 2));

        try {
          const hotelsResponse = await axios.get(
            `https://${RAPIDAPI_HOST}/api/v1/hotels/searchHotels`,
            {
              headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': RAPIDAPI_HOST
              },
              params: test.params
            }
          );

          console.log('🏨 Hotels Response Status:', hotelsResponse.status);
          console.log('🏨 Hotels Response Data:', JSON.stringify(hotelsResponse.data, null, 2));

          if (hotelsResponse.data && hotelsResponse.data.data && hotelsResponse.data.data.hotels) {
            console.log(`✅ ${test.name}: Found ${hotelsResponse.data.data.hotels.length} hotels`);
            if (hotelsResponse.data.data.hotels.length > 0) {
              console.log('🏨 First hotel:', JSON.stringify(hotelsResponse.data.data.hotels[0], null, 2));
            }
          } else {
            console.log(`❌ ${test.name}: No hotels found`);
            console.log('🔍 Checking response structure...');
            if (hotelsResponse.data) {
              console.log('Available keys in response:', Object.keys(hotelsResponse.data));
              if (hotelsResponse.data.data) {
                console.log('Available keys in data:', Object.keys(hotelsResponse.data.data));
              }
            }
          }
        } catch (error) {
          console.error(`❌ ${test.name} failed:`, error.response?.data || error.message);
        }
      }

      // Test 3: Try a different destination
      console.log('\n3️⃣ Testing with a different destination...');
      const londonResponse = await axios.get(
        `https://${RAPIDAPI_HOST}/api/v1/hotels/searchDestination`,
        {
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': RAPIDAPI_HOST
          },
          params: {
            query: 'London'
          }
        }
      );

      if (londonResponse.data && londonResponse.data.data && londonResponse.data.data.length > 0) {
        const londonDest = londonResponse.data.data[0];
        console.log('✅ London destination found:', londonDest.name, '(ID:', londonDest.dest_id, ')');
        
        const londonHotelsResponse = await axios.get(
          `https://${RAPIDAPI_HOST}/api/v1/hotels/searchHotels`,
          {
            headers: {
              'X-RapidAPI-Key': RAPIDAPI_KEY,
              'X-RapidAPI-Host': RAPIDAPI_HOST
            },
            params: {
              dest_id: londonDest.dest_id,
              search_type: 'city',
              arrival_date: dates.arrival,
              departure_date: dates.departure,
              adults: 1,
              room_qty: 1
            }
          }
        );

        console.log('🏨 London Hotels Response Status:', londonHotelsResponse.status);
        if (londonHotelsResponse.data && londonHotelsResponse.data.data && londonHotelsResponse.data.data.hotels) {
          console.log('🏨 London Hotels found:', londonHotelsResponse.data.data.hotels.length);
        } else {
          console.log('❌ No London hotels found');
        }
      }

    } else {
      console.log('❌ No destination found');
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testRapidAPI(); 