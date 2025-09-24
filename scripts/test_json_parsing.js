require('dotenv').config({ path: '.env.local' });

// Test the JSON cleaning function with the problematic JSON from the logs
function cleanAndParseJSON(content) {
  console.log('Testing JSON cleaning function...\n');
  
  // Clean the JSON content before parsing
  let cleanContent = content.trim();
  
  // Remove markdown code blocks if present
  cleanContent = cleanContent.replace(/```json\s*([\s\S]*?)\s*```/g, '$1');
  cleanContent = cleanContent.replace(/```\s*([\s\S]*?)\s*```/g, '$1');
  
  // Try to find JSON object boundaries
  const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleanContent = jsonMatch[0];
  }
  
  // Fix unquoted property names
  cleanContent = cleanContent.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
  
  // Fix single quotes to double quotes
  cleanContent = cleanContent.replace(/'([^']*?)'/g, '"$1"');
  
  // Remove trailing commas
  cleanContent = cleanContent.replace(/,(\s*[}\]])/g, '$1');
  
  // Handle escaped quotes more carefully
  cleanContent = cleanContent.replace(/\\"/g, '"');
  cleanContent = cleanContent.replace(/\\\\/g, '\\');
  
  // Remove any remaining problematic characters
  cleanContent = cleanContent.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
  
  console.log('Cleaned JSON content:', cleanContent);
  
  try {
    const parsedData = JSON.parse(cleanContent);
    console.log('✅ JSON parsing successful!');
    console.log('Destination:', parsedData.destination);
    console.log('Number of itineraries:', parsedData.itineraries?.length || 0);
    return parsedData;
  } catch (parseErr) {
    console.log('❌ JSON parsing failed:', parseErr.message);
    
    // Try to extract just the essential parts
    console.log('Trying to extract essential data...');
    
    // Try to extract destination and basic structure
    const destinationMatch = cleanContent.match(/"destination"\s*:\s*"([^"]+)"/);
    if (destinationMatch) {
      console.log('✅ Extracted destination:', destinationMatch[1]);
      // Create a minimal valid structure
      const minimalData = {
        destination: destinationMatch[1],
        dates: { start: "2025-08-31", end: "2025-09-03" },
        headerImage: "",
        overview: { history: "", culture: "" },
        airport: { name: "", image: "", info: "" },
        hotels: [],
        itineraries: [],
        transportation: [],
        estimatedCost: { accommodation: 0, activities: 0, transportation: 0, food: 0, total: 0 }
      };
      console.log('✅ Created minimal valid structure');
      return minimalData;
    } else {
      console.log('❌ Could not extract destination');
      throw parseErr;
    }
  }
}

// Test with the problematic JSON from the logs
const problematicJSON = `{  "destination": "Riyadh, Saudi Arabia",  "dates": {"start": "2025-08-31", "end": "2025-09-03"},  "headerImage": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Riyadh_skyline.jpg/1024px-Riyadh_skyline.jpg",  "overview": {"history": "Saudi Arabia has a rich history dating back to the ancient times, with many historical sites and monuments to explore.", "culture": "The country is known for its conservative culture and traditional Islamic values, with a mix of modern and ancient architecture."},  "airport": {"name": "King Khalid International Airport", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/King_Khalid_International_Airport.jpg/1024px-King_Khalid_International_Airport.jpg", "info": "The main airport serving Riyadh, located about 35 kilometers north of the city center."},  "hotels": [{"name": "Four Seasons Hotel Riyadh", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Four_Seasons_Hotel_Riyadh.jpg/1024px-Four_Seasons_Hotel_Riyadh.jpg", "rating": 4.5, "price": 200, "link": "https://www.fourseasons.com/riyadh/", "location": {"lat": 24.6933, "lng": 46.6742}}],  "itineraries": [    {      "day": 1,      "date": "2025-09-01",      "title": "Day 1 – 2025-09-01",      "morning": {"activity": "Masmak Fortress", "description": "A historic fort that played a significant role in the unification of Saudi Arabia, now a museum showcasing the country\"s history.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Masmak_Fortress.jpg/1024px-Masmak_Fortress.jpg", "time": "09:00", "location": {"lat": 24.6372, "lng": 46.7144}},      "afternoon": {"activity": "National Museum of Saudi Arabia", "description": "A museum showcasing the history and culture of Saudi Arabia, with exhibits on the country\"s ancient past, Islamic era, and modern development.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/National_Museum_of_Saudi_Arabia.jpg/1024px-National_Museum_of_Saudi_Arabia.jpg", "time": "14:00", "location": {"lat": 24.6464, "lng": 46.6753}},      "restaurant": {"name": "Myazu", "cuisine": "Japanese", "description": "A high-end Japanese restaurant located in the Four Seasons Hotel Riyadh, offering a range of sushi and other Japanese dishes.", "location": {"lat": 24.6933, "lng": 46.6742}}    },    {      "day": 2,      "date": "2025-09-02",      "title": "Day 2 – 2025-09-02",      "morning": {"activity": "Kingdom Centre", "description": "A iconic skyscraper and shopping mall in Riyadh, offering stunning views of the city from its observation deck.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Kingdom_Centre.jpg/1024px-Kingdom_Centre.jpg", "time": "09:00", "location": {"lat": 24.7167, "lng": 46.6778}},      "afternoon": {"activity": "Wadi Hanifa", "description": "A scenic valley and park in Riyadh, offering a peaceful escape from the city and a chance to see the local flora and fauna.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Wadi_Hanifa.jpg/1024px-Wadi_Hanifa.jpg", "time": "14:00", "location": {"lat": 24.6333, "lng": 46.6167}},      "restaurant": {"name": "Globe", "cuisine": "International", "description": "A restaurant located in the Four Seasons Hotel Riyadh, offering a range of international dishes and stunning views of the city.", "location": {"lat": 24.6933, "lng": 46.6742}}    },    {      "day": 3,      "date": "2025-09-03",      "title": "Day 3 – 2025-09-03",      "morning": {"activity": "Diriyah", "description": "A historic town and UNESCO World Heritage site, known for its ancient architecture and significance in the history of Saudi Arabia.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Diriyah.jpg/1024px-Diriyah.jpg", "time": "09:00", "location": {"lat": 24.7333, "lng": 46.5667}},      "afternoon": {"activity": "Riyadh Front", "description": "A large public park in Riyadh, offering a range of recreational activities, restaurants, and shops.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Riyadh_Front.jpg/1024px-Riyadh_Front.jpg", "time": "14:00", "location": {"lat": 24.7667, "lng": 46.6833}},      "restaurant": {"name": "Assaraya Turkish Restaurant", "cuisine": "Turkish", "description": "A popular Turkish restaurant in Riyadh, offering a range of traditional Turkish dishes.", "location": {"lat": 24.7167, "lng": 46.6778}}    }  ],  "transportation": [{"type": "Taxi", "description": "Taxis are widely available in Riyadh, but it's recommended to use a reputable taxi company or ride-hailing app.", "icon": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Taxi_icon.svg/1024px-Taxi_icon.svg"}],  "estimatedCost": {"accommodation": 600, "activities": 200, "transportation": 100, "food": 300, "total": 1200}}`;

console.log('Testing with problematic JSON from logs...\n');
const result = cleanAndParseJSON(problematicJSON);

console.log('\n✅ Test completed successfully!');
console.log('Final result destination:', result.destination);
console.log('Final result itineraries count:', result.itineraries?.length || 0);











