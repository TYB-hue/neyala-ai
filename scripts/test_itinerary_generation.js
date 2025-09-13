require('dotenv').config({ path: '.env.local' });

const Groq = require('groq-sdk');

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY
});

async function getGroqChatCompletion(messages) {
  return groq.chat.completions.create({
    messages,
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
    max_tokens: 3000,
    top_p: 0.9,
  });
}

async function testItineraryGeneration() {
  console.log('Testing itinerary generation with improved prompts...\n');

  const testDestinations = [
    'Paris, France',
    'Tokyo, Japan', 
    'New York, USA',
    'London, UK',
    'Rome, Italy'
  ];

  for (const destination of testDestinations) {
    console.log(`\n=== Testing: ${destination} ===`);
    
    try {
      const completion = await getGroqChatCompletion([
        {
          role: "system",
          content: `You are a professional travel planner AI. Your task is to create detailed and realistic itineraries with SPECIFIC, REAL attractions and restaurants.  

CRITICAL REQUIREMENTS:  
1. You must use ONLY real, specific, and verifiable attractions, landmarks, and restaurants that exist in the chosen city/country.  
2. NEVER use generic placeholders like "City Center", "Local Market", "Main Square", "Historical District", "Cultural Experience", "Tourist Area", "Downtown Area", "Central Park", "Museum District", "Shopping District", "Entertainment District", "Historic Quarter", "Modern District", "Tourist Area", "Local Attractions", "Cultural Center", "Historic Quarter", "Modern District", "Tourist Restaurant", "Cultural Restaurant", "Modern Restaurant", "Entertainment Restaurant", "Traditional Restaurant", "Popular Restaurant", "Local Restaurant", "Cultural Cuisine", "Modern Cuisine", "Tourist Cuisine", "Entertainment Cuisine", "Traditional Cuisine", "Local Cuisine".

3. For attractions, use ONLY real, famous landmarks, museums, parks, monuments, and tourist sites that actually exist in the destination. Examples of GOOD attractions:
   - Paris: Eiffel Tower, Louvre Museum, Notre-Dame Cathedral, Arc de Triomphe, Champs-Élysées, Montmartre, Sacre-Coeur, Palace of Versailles
   - London: Big Ben, Tower of London, British Museum, Buckingham Palace, London Eye, Westminster Abbey, Tower Bridge, St. Paul's Cathedral
   - Tokyo: Senso-ji Temple, Tokyo Skytree, Meiji Shrine, Shibuya Crossing, Tsukiji Fish Market, Tokyo Tower, Imperial Palace, Ginza District
   - New York: Statue of Liberty, Empire State Building, Central Park, Times Square, Metropolitan Museum of Art, Brooklyn Bridge, Broadway, Rockefeller Center
   - Rome: Colosseum, Vatican Museums, Trevi Fountain, Pantheon, Piazza Navona, Roman Forum, St. Peter's Basilica, Spanish Steps

4. For restaurants, use ONLY real, popular restaurants that exist in the destination city. Examples of GOOD restaurants:
   - Paris: Le Comptoir du Relais, L'Ami Louis, Le Chateaubriand, Guy Savoy, Pierre Gagnaire, Alain Ducasse
   - London: The Ivy, Sketch, Gordon Ramsay, Hawksmoor, The Ritz, Claridge's, The Wolseley
   - Tokyo: Sukiyabashi Jiro, Narisawa, Ryugin, Saito, Quintessence, Den, Kozasa
   - New York: Eleven Madison Park, Le Bernardin, Per Se, Gramercy Tavern, Daniel, Jean-Georges
   - Rome: La Pergola, Il Pagliaccio, Aroma, Imago, La Terrazza, Pipero al Rex

5. If you don't know specific attractions or restaurants for a destination, research and use real ones. Never make up names or use generic terms.

6. Each activity must be a specific, well-known landmark, attraction, or cultural site that tourists genuinely visit.

7. Do not repeat the same attraction across multiple days unless it is a multi-day site.

8. Never default to another city if the requested city is not known. Use only what is relevant to the actual destination.

ITINERARY RULES:  
1. If the user selects travel dates (e.g. 2025-08-25 to 2025-08-27), the first day (arrival day) is skipped. Start itineraries from the next full day until the end date.  
2. Each travel day must include:  
   - Two specific main activities (real, famous attractions in the chosen city)  
   - One restaurant recommendation (real, popular restaurant in that city)  
3. The itinerary must feel enjoyable, professional, and valuable for a traveler.  

OUTPUT FORMAT:  
Return ONLY a valid JSON object with this structure:  

{
  "destination": "City, Country",
  "dates": {"start": "YYYY-MM-DD", "end": "YYYY-MM-DD"},
  "headerImage": "URL",
  "overview": {"history": "text", "culture": "text"},
  "airport": {"name": "Airport Name", "image": "URL", "info": "text"},
  "hotels": [{"name": "Hotel Name", "image": "URL", "rating": 4.5, "price": 150, "link": "URL", "location": {"lat": 0, "lng": 0}}],
  "itineraries": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "title": "Day 1 – [Date]",
      "morning": {"activity": "Real attraction name", "description": "Detailed description", "image": "URL", "time": "09:00", "location": {"lat": 0, "lng": 0}},
      "afternoon": {"activity": "Real attraction name", "description": "Detailed description", "image": "URL", "time": "14:00", "location": {"lat": 0, "lng": 0}},
      "restaurant": {"name": "Real restaurant name", "cuisine": "Specific cuisine", "description": "Why recommended", "location": {"lat": 0, "lng": 0}}
    }
  ],
  "transportation": [{"type": "Metro", "description": "text", "icon": "URL"}],
  "estimatedCost": {"accommodation": 500, "activities": 300, "transportation": 100, "food": 200, "total": 1100}
}`
        },
        {
          role: "user",
          content: `Create a detailed travel itinerary for ${destination} from 2025-01-15 to 2025-01-17 for a couple.
          
          CRITICAL INSTRUCTIONS:
          1. Use ONLY real, specific attractions and restaurants that actually exist in ${destination}
          2. NEVER use generic terms like "City Center", "Local Market", "Main Square", "Historical District", "Cultural Experience", "Tourist Area", "Downtown Area", "Central Park", "Museum District", "Shopping District", "Entertainment District", "Historic Quarter", "Modern District", "Local Attractions", "Cultural Center", "Tourist Restaurant", "Cultural Restaurant", "Modern Restaurant", "Entertainment Restaurant", "Traditional Restaurant", "Popular Restaurant", "Local Restaurant", "Cultural Cuisine", "Modern Cuisine", "Tourist Cuisine", "Entertainment Cuisine", "Traditional Cuisine", "Local Cuisine"
          3. Research and use actual famous landmarks, museums, parks, monuments, and tourist sites for ${destination}
          4. For restaurants, use real, popular restaurants that exist in ${destination}
          5. If you don't know specific places for ${destination}, research and find real ones
          
          CRITICAL: Respond with ONLY valid JSON. Do NOT use markdown formatting, code blocks, or any other formatting. Return pure JSON only.`
        }
      ]);

      if (!completion.choices[0]?.message?.content) {
        console.log('❌ No content received from Groq API');
        continue;
      }

      // Clean the JSON content before parsing
      let cleanContent = completion.choices[0].message.content.trim();
      
      // Remove markdown code blocks if present
      cleanContent = cleanContent.replace(/```json\s*([\s\S]*?)\s*```/g, '$1');
      cleanContent = cleanContent.replace(/```\s*([\s\S]*?)\s*```/g, '$1');
      
      // Fix unquoted property names
      cleanContent = cleanContent.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');
      
      // Fix single quotes to double quotes
      cleanContent = cleanContent.replace(/'([^']*?)'/g, '"$1"');
      
      // Remove trailing commas
      cleanContent = cleanContent.replace(/,(\s*[}\]])/g, '$1');
      
      // Fix escaped quotes
      cleanContent = cleanContent.replace(/\\"/g, '_QUOTE_');
      cleanContent = cleanContent.replace(/"/g, '\\"');
      cleanContent = cleanContent.replace(/_QUOTE_/g, '\\"');
      
      // Handle nested quotes
      cleanContent = cleanContent.replace(/([^\\])"([^"]*?)\\?"([^"]*?)([^\\])"/g, '$1"$2\\"$3$4"');
      
      // Remove any remaining problematic characters
      cleanContent = cleanContent.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

      try {
        const itineraryData = JSON.parse(cleanContent);
        
        // Check for generic terms
        const genericTerms = [
          'City Center', 'Local Market', 'Main Square', 'Historical District', 'Cultural Experience',
          'Tourist Area', 'Downtown Area', 'Central Park', 'Museum District', 'Shopping District',
          'Entertainment District', 'Historic Quarter', 'Modern District', 'Local Attractions',
          'Cultural Center', 'Tourist Restaurant', 'Cultural Restaurant', 'Modern Restaurant',
          'Entertainment Restaurant', 'Traditional Restaurant', 'Popular Restaurant', 'Local Restaurant',
          'Cultural Cuisine', 'Modern Cuisine', 'Tourist Cuisine', 'Entertainment Cuisine',
          'Traditional Cuisine', 'Local Cuisine'
        ];
        
        const itineraryString = JSON.stringify(itineraryData).toLowerCase();
        const foundGenericTerms = genericTerms.filter(term => 
          itineraryString.includes(term.toLowerCase())
        );
        
        if (foundGenericTerms.length > 0) {
          console.log(`❌ Found generic terms: ${foundGenericTerms.join(', ')}`);
        } else {
          console.log('✅ No generic terms found!');
        }
        
        // Display the attractions and restaurants
        if (itineraryData.itineraries && itineraryData.itineraries.length > 0) {
          const day = itineraryData.itineraries[0];
          console.log(`Morning: ${day.morning?.activity || 'N/A'}`);
          console.log(`Afternoon: ${day.afternoon?.activity || 'N/A'}`);
          console.log(`Restaurant: ${day.restaurant?.name || 'N/A'}`);
        }
        
      } catch (parseError) {
        console.log('❌ Failed to parse JSON:', parseError.message);
      }
      
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  }
}

testItineraryGeneration().catch(console.error);
