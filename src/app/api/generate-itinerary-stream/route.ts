import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { getDestinationHeaderImage, getAirportImage, getAirportPhotos, getActivityImage, generateESIMLink } from '@/lib/unsplash';
import { getTransportationIcon } from '@/lib/transportation-icons';
import { getGroqChatCompletion } from '@/lib/groq';

interface ItineraryRequest {
  destination: string;
  startDate: string;
  endDate: string;
  travelGroup: string;
  requirements?: string[];
  budget?: string;
  travelStyle?: string;
  activities?: string[];
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    // Authentication is optional - allow users to generate itineraries without signing in
    // userId will be undefined if not signed in, which is fine for generating itineraries
    // Users can still use the service, but won't be able to save itineraries to their account

    const requestData: ItineraryRequest = await req.json();

    // Create a ReadableStream for real-time updates
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial status
          controller.enqueue(new TextEncoder().encode('data: {"status": "started", "message": "Starting itinerary generation..."}\n\n'));

          // Generate itinerary with Groq AI
          controller.enqueue(new TextEncoder().encode('data: {"status": "generating", "message": "Creating your personalized itinerary..."}\n\n'));

          const maxRetries = 3; // Reduced from 5 to 3 to conserve API tokens
          let attempt = 0;
          let itineraryData = null;
          
          while (attempt < maxRetries && !itineraryData) {
            attempt++;
            console.log(`Attempt ${attempt} of ${maxRetries} to generate itinerary`);
            
            try {
                                  // Try Groq AI API
              const completion: any = await getGroqChatCompletion([
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
  "headerImage": "placeholder",
  "overview": {"history": "text", "culture": "text"},
  "airport": {"name": "Airport Name", "image": "placeholder", "photos": ["placeholder"], "info": "text"},
  "hotels": [{"name": "Hotel Name", "rating": 4.5, "price": 150, "link": "URL", "location": {"lat": 0, "lng": 0}}],
  "itineraries": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "title": "Day 1 – [Date]",
      "morning": {"activity": "Real attraction name", "description": "Detailed description", "image": "placeholder", "time": "09:00", "location": {"lat": 0, "lng": 0}},
      "afternoon": {"activity": "Real attraction name", "description": "Detailed description", "image": "placeholder", "time": "14:00", "location": {"lat": 0, "lng": 0}},
      "restaurant": {"name": "Real restaurant name", "cuisine": "Specific cuisine", "description": "Why recommended", "location": {"lat": 0, "lng": 0}}
    }
  ],
  "transportation": [{"type": "Metro", "description": "text", "icon": "placeholder"}],
  "estimatedCost": {"accommodation": 500, "activities": 300, "transportation": 100, "food": 200, "total": 1100}
}

CRITICAL IMAGE INSTRUCTIONS: 
- You MUST use "placeholder" as the value for ALL image fields
- NEVER generate any actual URLs for images
- Use "headerImage": "placeholder" for destination header images
- Use "image": "placeholder" for activity images  
- Use "icon": "placeholder" for transportation icons
- Use "photos": ["placeholder"] for photo arrays

ABSOLUTELY FORBIDDEN: Do not generate any URLs that start with:
- https://upload.wikimedia.org/
- https://images.unsplash.com/
- https://images.pexels.com/
- Any other image URLs

If you include any actual image URLs, the response will be rejected and you will need to retry.`
                },
                {
                  role: "user",
                  content: `Create a detailed travel itinerary for ${requestData.destination} from ${requestData.startDate} to ${requestData.endDate} for ${requestData.travelGroup}.
                  ${requestData.requirements?.length ? `Requirements: ${requestData.requirements.join(', ')}` : ''}
                  ${requestData.budget ? `Budget: ${requestData.budget}` : ''}
                  ${requestData.travelStyle ? `Travel Style: ${requestData.travelStyle}` : ''}
                  ${requestData.activities?.length ? `Preferred Activities: ${requestData.activities.join(', ')}` : ''}
                  
                  CRITICAL INSTRUCTIONS:
                  1. Use ONLY real, specific attractions and restaurants that actually exist in ${requestData.destination}
                  2. NEVER use generic terms like "City Center", "Local Market", "Main Square", "Historical District", "Cultural Experience", "Tourist Area", "Downtown Area", "Central Park", "Museum District", "Shopping District", "Entertainment District", "Historic Quarter", "Modern District", "Local Attractions", "Cultural Center", "Tourist Restaurant", "Cultural Restaurant", "Modern Restaurant", "Entertainment Restaurant", "Traditional Restaurant", "Popular Restaurant", "Local Restaurant", "Cultural Cuisine", "Modern Cuisine", "Tourist Cuisine", "Entertainment Cuisine", "Traditional Cuisine", "Local Cuisine"
                  3. Research and use actual famous landmarks, museums, parks, monuments, and tourist sites for ${requestData.destination}
                  4. For restaurants, use real, popular restaurants that exist in ${requestData.destination}
                  5. If you don't know specific places for ${requestData.destination}, research and find real ones
                  6. Calculate the number of days between ${requestData.startDate} and ${requestData.endDate} and create that many itinerary days
                  7. Each day must have morning, afternoon, and restaurant activities
                  8. CRITICAL: Use "placeholder" as the value for ALL image fields - NEVER use actual URLs
                  9. Ensure the JSON is complete and properly formatted
                  10. MANDATORY: Use placeholder values for all image fields: "headerImage": "placeholder", "image": "placeholder", etc.
                  11. ABSOLUTELY FORBIDDEN: Do not generate any URLs that start with https://upload.wikimedia.org/, https://images.unsplash.com/, https://images.pexels.com/, or any other image URLs
                  
                  CRITICAL: Respond with ONLY valid JSON. Do NOT use markdown formatting, code blocks, or any other formatting. Return pure JSON only. Start your response with { and end with }. Do not include any text before or after the JSON object. Make sure the JSON is complete and properly closed.
                  
                  REMEMBER: If you include any image URLs, the JSON will be invalid and the system will fail.`
                }
              ]);

              if (!completion || !completion.choices || completion.choices.length === 0 || !completion.choices[0]?.message?.content) {
                throw new Error('No content received from Groq API');
              }

              console.log('Raw API response length:', completion.choices[0].message.content.length);
              console.log('Raw API response preview:', completion.choices[0].message.content.substring(0, 200));
              console.log('Raw API response ending:', completion.choices[0].message.content.substring(completion.choices[0].message.content.length - 200));

              try {
                // Parse the JSON response from Groq
                let rawContent = completion.choices[0].message.content;
                
                // Clean up the JSON response - remove any markdown formatting
                const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                  rawContent = jsonMatch[0];
                }
                
                // Parse the JSON
                const parsedData = JSON.parse(rawContent);
                console.log('Successfully parsed JSON from Groq API');
                
                // Validate that no actual image URLs are present
                const forbiddenUrls = [
                  'https://upload.wikimedia.org/',
                  'https://images.unsplash.com/',
                  'https://images.pexels.com/'
                ];
                
                const jsonString = JSON.stringify(parsedData);
                const hasForbiddenUrls = forbiddenUrls.some(url => jsonString.includes(url));
                
                if (hasForbiddenUrls) {
                  throw new Error('Response contains forbidden image URLs. AI must use "placeholder" values only.');
                }
                
                // Validate that the itinerary doesn't contain generic terms in attractions/restaurants
                const genericTerms = [
                  'Local Market', 'Main Square', 'Historical District', 'Cultural Experience',
                  'Tourist Area', 'Downtown Area', 'Central Park', 'Museum District', 'Shopping District',
                  'Entertainment District', 'Historic Quarter', 'Modern District', 'Local Attractions',
                  'Cultural Center', 'Tourist Restaurant', 'Cultural Restaurant', 'Modern Restaurant',
                  'Entertainment Restaurant', 'Traditional Restaurant', 'Popular Restaurant', 'Local Restaurant',
                  'Cultural Cuisine', 'Modern Cuisine', 'Tourist Cuisine', 'Entertainment Cuisine',
                  'Traditional Cuisine', 'Local Cuisine'
                ];
                
                // Only check for generic terms in attractions and restaurants, not in descriptions
                let hasGenericTerms = false;
                const foundGenericTerms = [];
                
                if (parsedData.itineraries && Array.isArray(parsedData.itineraries)) {
                  for (const day of parsedData.itineraries) {
                    // Check morning activity
                    if (day.morning?.activity) {
                      const activity = day.morning.activity.toLowerCase();
                      const found = genericTerms.filter(term => activity.includes(term.toLowerCase()));
                      if (found.length > 0) {
                        hasGenericTerms = true;
                        foundGenericTerms.push(...found);
                      }
                    }
                    
                    // Check afternoon activity
                    if (day.afternoon?.activity) {
                      const activity = day.afternoon.activity.toLowerCase();
                      const found = genericTerms.filter(term => activity.includes(term.toLowerCase()));
                      if (found.length > 0) {
                        hasGenericTerms = true;
                        foundGenericTerms.push(...found);
                      }
                    }
                    
                    // Check restaurant name
                    if (day.restaurant?.name) {
                      const restaurant = day.restaurant.name.toLowerCase();
                      const found = genericTerms.filter(term => restaurant.includes(term.toLowerCase()));
                      if (found.length > 0) {
                        hasGenericTerms = true;
                        foundGenericTerms.push(...found);
                      }
                    }
                  }
                }
                
                if (hasGenericTerms) {
                  const uniqueTerms = Array.from(new Set(foundGenericTerms));
                  console.warn(`Attempt ${attempt}: Found generic terms in attractions/restaurants:`, uniqueTerms);
                  if (attempt < maxRetries) {
                    console.log(`Retrying... (${attempt}/${maxRetries})`);
                    continue; // Try again
                  } else {
                    throw new Error(`Itinerary contains generic terms after ${maxRetries} attempts: ${uniqueTerms.join(', ')}`);
                  }
                }
                
                // If we get here, the itinerary is valid
                itineraryData = parsedData;
                console.log(`Successfully generated itinerary on attempt ${attempt}`);
                
                // Replace placeholder images with real ones
                if (itineraryData.headerImage === "placeholder") {
                  console.log('Replacing header image placeholder for:', itineraryData.destination);
                  itineraryData.headerImage = await getDestinationHeaderImage(itineraryData.destination);
                  console.log('Header image replaced with:', itineraryData.headerImage);
                }
                
                if (itineraryData.airport && itineraryData.airport.image === "placeholder") {
                  itineraryData.airport.image = await getAirportImage(itineraryData.airport.name, itineraryData.destination);
                  itineraryData.airport.photos = await getAirportPhotos(itineraryData.airport.name, itineraryData.destination);
                }
                
              } catch (parseError) {
                console.error(`Attempt ${attempt} - JSON parse error:`, parseError);
                if (attempt < maxRetries) {
                  console.log(`Retrying... (${attempt}/${maxRetries})`);
                  continue; // Try again
                } else {
                  throw parseError;
                }
              }
              
            } catch (groqError: unknown) {
              console.error(`Attempt ${attempt} - Groq API error:`, groqError);
              
              // Handle specific error types
              if (groqError && typeof groqError === 'object' && 'status' in groqError && groqError.status === 429) {
                console.log(`Rate limit hit on attempt ${attempt}. The Groq API is currently rate-limited.`);
                if (attempt < maxRetries) {
                  // Longer delays for rate limits: 5s, 10s, 20s, 40s, 80s
                  const delay = 5000 * Math.pow(2, attempt - 1); // Exponential backoff starting at 5 seconds
                  console.log(`Waiting ${delay/1000}s before retry...`);
                  controller.enqueue(new TextEncoder().encode(`data: {"status": "retrying", "message": "Rate limit reached. Waiting ${delay/1000} seconds before retry ${attempt}/${maxRetries}..."}\n\n`));
                  await new Promise(resolve => setTimeout(resolve, delay));
                  continue;
                } else {
                  throw new Error('Rate limit exceeded. The API is currently busy. Please wait 1-2 minutes and try again.');
                }
              } else if (groqError && typeof groqError === 'object' && 'message' in groqError && typeof groqError.message === 'string') {
                const errorMessage = groqError.message;
                
                // Check for daily token limit (TPD - Tokens Per Day)
                if (errorMessage.includes('tokens per day') || errorMessage.includes('TPD') || errorMessage.includes('Please try again in')) {
                  // Extract wait time if available
                  const waitTimeMatch = errorMessage.match(/try again in ([\d]+)m([\d.]+)s/);
                  let waitMessage = 'Daily token limit reached. Please try again later or upgrade your Groq plan.';
                  if (waitTimeMatch) {
                    const minutes = waitTimeMatch[1];
                    waitMessage = `Daily token limit reached. Please try again in ${minutes} minutes, or upgrade your Groq plan for higher limits.`;
                  }
                  throw new Error(waitMessage);
                }
                
                // Check for general rate limit
                if (errorMessage.includes('Rate limit') || errorMessage.includes('rate limit')) {
                  console.log(`Rate limit message detected on attempt ${attempt}`);
                  if (attempt < maxRetries) {
                    const delay = 5000 * Math.pow(2, attempt - 1);
                    console.log(`Waiting ${delay/1000}s before retry...`);
                    controller.enqueue(new TextEncoder().encode(`data: {"status": "retrying", "message": "Rate limit reached. Waiting ${delay/1000} seconds before retry ${attempt}/${maxRetries}..."}\n\n`));
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                  } else {
                    throw new Error('Rate limit exceeded. The API is currently busy. Please wait 1-2 minutes and try again.');
                  }
                }
              }
              
              if (attempt < maxRetries) {
                console.log(`Retrying... (${attempt}/${maxRetries})`);
                continue; // Try again
              } else {
                throw groqError;
              }
            }
          }
          
          // If we still don't have itinerary data after all retries, use fallback
          if (!itineraryData) {
            console.warn('All Groq API attempts failed, using fallback itinerary');
            itineraryData = generateFallbackItinerary(requestData);
          }
          
          // Final validation
          if (!itineraryData || !itineraryData.itineraries || !Array.isArray(itineraryData.itineraries) || itineraryData.itineraries.length === 0) {
            console.error('Final validation failed: No valid itinerary data');
            throw new Error('Failed to generate valid itinerary data');
          }
          
          console.log(`Final itinerary validation passed: ${itineraryData.itineraries.length} days generated for ${itineraryData.destination}`);

          // Send status update
          controller.enqueue(new TextEncoder().encode('data: {"status": "processing", "message": "Enhancing with high-quality images..."}\n\n'));

          // Parallel image fetching for speed (skip headerImage since it's already updated)
          const [airportImage, airportPhotos] = await Promise.all([
            getAirportImage(itineraryData.airport.name, itineraryData.destination),
            getAirportPhotos(itineraryData.airport.name, itineraryData.destination)
          ]);

          // Create enhanced itinerary data with images (separate from validated schema)
          const enhancedItineraryData: Record<string, unknown> = {
            ...itineraryData,
            // headerImage is already updated in itineraryData from the placeholder replacement above
            airport: {
              ...itineraryData.airport,
              image: airportImage,
              photos: airportPhotos
            }
          };

          // Hotels will be loaded separately to improve performance
          // Initialize with empty array - hotels will be loaded asynchronously
          enhancedItineraryData.hotels = [];

          if (enhancedItineraryData.itineraries && Array.isArray(enhancedItineraryData.itineraries)) {
            const itineraryPromises = (enhancedItineraryData.itineraries as Array<Record<string, unknown>>).map(async (day: Record<string, unknown>) => {
              // Process morning activity
              if (day.morning) {
                const morningActivity = day.morning as Record<string, unknown>;
                if (!morningActivity.image || morningActivity.image === "placeholder") {
                  morningActivity.image = await getActivityImage(morningActivity.activity as string, enhancedItineraryData.destination as string);
                }
              }
              
              // Process afternoon activity
              if (day.afternoon) {
                const afternoonActivity = day.afternoon as Record<string, unknown>;
                if (!afternoonActivity.image || afternoonActivity.image === "placeholder") {
                  afternoonActivity.image = await getActivityImage(afternoonActivity.activity as string, enhancedItineraryData.destination as string);
                }
              }
              
              return day;
            });
            await Promise.all(itineraryPromises);
          }

          // Process transportation icons
          if (enhancedItineraryData.transportation && Array.isArray(enhancedItineraryData.transportation)) {
            for (const transport of enhancedItineraryData.transportation as Array<Record<string, unknown>>) {
              if (!transport.icon || transport.icon === "placeholder") {
                const iconData = getTransportationIcon(transport.type as string);
                transport.icon = iconData.icon;
                transport.type = iconData.name;
              }
            }
          }

          // Add eSIM section
          enhancedItineraryData.eSIM = {
            provider: "Airalo",
            description: "Get a global eSIM for seamless connectivity during your trip",
            link: generateESIMLink(enhancedItineraryData.destination as string),
            price: "$5-15"
          };

          // Send final result - ensure proper JSON formatting
          const finalResponse = {
            status: "completed",
            data: enhancedItineraryData
          };
          
          // Stringify the response and ensure it's properly formatted
          const responseString = JSON.stringify(finalResponse);
          console.log('Sending final response length:', responseString.length);
          
          controller.enqueue(new TextEncoder().encode(`data: ${responseString}\n\n`));
          controller.close();

        } catch (error: any) {
          const payload = {
            status: "error",
            error: error && typeof error.message === 'string' ? error.message : 'Unknown error'
          };
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(payload)}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: unknown) {
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// Generate fallback itinerary when Groq API fails
function generateFallbackItinerary(requestData: ItineraryRequest) {
  const destination = requestData.destination;
  const locationKey = destination.toLowerCase().split(',')[0].trim();
  
  // Get coordinates for the destination
  const coordinates = getLocationCoordinates(destination);
  
  // Calculate the number of days (excluding arrival day)
  const startDate = new Date(requestData.startDate);
  const endDate = new Date(requestData.endDate);
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Ensure we have at least 1 day
  const totalDays = Math.max(1, daysDiff);
  
  // Generate itineraries for each day (starting from day after arrival)
  const itineraries = [];
  
  // Generic fallback attractions for any destination
  const getGenericAttractions = (city: string) => {
    const genericAttractions = [
      { morning: 'City Center', afternoon: 'Local Market', restaurant: 'Local Restaurant', cuisine: 'Local Cuisine' },
      { morning: 'Main Square', afternoon: 'Historical District', restaurant: 'Traditional Restaurant', cuisine: 'Traditional Cuisine' },
      { morning: 'Central Park', afternoon: 'Shopping District', restaurant: 'Popular Restaurant', cuisine: 'Local Cuisine' },
      { morning: 'Museum District', afternoon: 'Cultural Center', restaurant: 'Cultural Restaurant', cuisine: 'Cultural Cuisine' },
      { morning: 'Historic Quarter', afternoon: 'Modern District', restaurant: 'Modern Restaurant', cuisine: 'Modern Cuisine' },
      { morning: 'Tourist Area', afternoon: 'Local Attractions', restaurant: 'Tourist Restaurant', cuisine: 'Tourist Cuisine' },
      { morning: 'Downtown Area', afternoon: 'Entertainment District', restaurant: 'Entertainment Restaurant', cuisine: 'Entertainment Cuisine' }
    ];
    return genericAttractions;
  };

  // Specific attractions for known cities (keep these for better quality)
  const attractions: { [key: string]: Array<{ morning: string; afternoon: string; restaurant: string; cuisine: string }> } = {
    'dubai': [
      { morning: 'Burj Khalifa', afternoon: 'Dubai Mall', restaurant: 'Al Mallah', cuisine: 'Middle Eastern' },
      { morning: 'Palm Jumeirah', afternoon: 'Dubai Marina', restaurant: 'Ravi Restaurant', cuisine: 'Pakistani' },
      { morning: 'Dubai Miracle Garden', afternoon: 'Global Village', restaurant: 'Automatic Restaurant', cuisine: 'Middle Eastern' },
      { morning: 'Dubai Desert Conservation Reserve', afternoon: 'Ski Dubai', restaurant: 'Ashiana', cuisine: 'Indian' },
      { morning: 'Jumeirah Mosque', afternoon: 'The Dubai Fountain', restaurant: 'Al Dhiyafa Road', cuisine: 'Middle Eastern' },
      { morning: 'Dubai Frame', afternoon: 'Dubai Museum', restaurant: 'Al Mallah', cuisine: 'Middle Eastern' },
      { morning: 'Dubai Marina Walk', afternoon: 'Dubai Creek', restaurant: 'Ravi Restaurant', cuisine: 'Pakistani' }
    ],
    'paris': [
      { morning: 'Eiffel Tower', afternoon: 'Louvre Museum', restaurant: 'Le Comptoir du Relais', cuisine: 'French' },
      { morning: 'Notre-Dame Cathedral', afternoon: 'Arc de Triomphe', restaurant: 'L\'Ami Louis', cuisine: 'French' },
      { morning: 'Montmartre', afternoon: 'Champs-Élysées', restaurant: 'Le Chateaubriand', cuisine: 'French' },
      { morning: 'Sacre-Coeur', afternoon: 'Musee d\'Orsay', restaurant: 'L\'Arpege', cuisine: 'French' },
      { morning: 'Palace of Versailles', afternoon: 'Chateau de Fontainebleau', restaurant: 'Guy Savoy', cuisine: 'French' },
      { morning: 'Centre Pompidou', afternoon: 'Place de la Concorde', restaurant: 'Pierre Gagnaire', cuisine: 'French' },
      { morning: 'Luxembourg Gardens', afternoon: 'Pantheon Paris', restaurant: 'Alain Ducasse', cuisine: 'French' }
    ],
    'london': [
      { morning: 'Big Ben', afternoon: 'British Museum', restaurant: 'The Ivy', cuisine: 'British' },
      { morning: 'Tower of London', afternoon: 'Buckingham Palace', restaurant: 'Sketch', cuisine: 'British' },
      { morning: 'London Eye', afternoon: 'Westminster Abbey', restaurant: 'Gordon Ramsay', cuisine: 'British' },
      { morning: 'Tower Bridge', afternoon: 'St. Paul\'s Cathedral', restaurant: 'Hawksmoor', cuisine: 'British' },
      { morning: 'Hyde Park', afternoon: 'Natural History Museum', restaurant: 'The Ritz', cuisine: 'British' },
      { morning: 'Covent Garden', afternoon: 'Trafalgar Square', restaurant: 'Claridge\'s', cuisine: 'British' },
      { morning: 'Camden Market', afternoon: 'Regent\'s Park', restaurant: 'The Wolseley', cuisine: 'British' }
    ],
    'rome': [
      { morning: 'Colosseum', afternoon: 'Roman Forum', restaurant: 'La Pergola', cuisine: 'Italian' },
      { morning: 'Vatican Museums', afternoon: 'St. Peter\'s Basilica', restaurant: 'Il Pagliaccio', cuisine: 'Italian' },
      { morning: 'Trevi Fountain', afternoon: 'Pantheon Rome', restaurant: 'Aroma', cuisine: 'Italian' },
      { morning: 'Piazza Navona', afternoon: 'Castel Sant\'Angelo', restaurant: 'Imago', cuisine: 'Italian' },
      { morning: 'Villa Borghese', afternoon: 'Spanish Steps', restaurant: 'La Terrazza', cuisine: 'Italian' },
      { morning: 'Catacombs', afternoon: 'Appian Way', restaurant: 'Pipero al Rex', cuisine: 'Italian' },
      { morning: 'Capitoline Museums', afternoon: 'Palatine Hill', restaurant: 'All\'Oro', cuisine: 'Italian' }
    ],
    'tokyo': [
      { morning: 'Senso-ji Temple', afternoon: 'Tokyo Skytree', restaurant: 'Sukiyabashi Jiro', cuisine: 'Japanese' },
      { morning: 'Meiji Shrine', afternoon: 'Shibuya Crossing', restaurant: 'Narisawa', cuisine: 'Japanese' },
      { morning: 'Tsukiji Fish Market', afternoon: 'Tokyo Tower', restaurant: 'Ryugin', cuisine: 'Japanese' },
      { morning: 'Ueno Park', afternoon: 'Akihabara', restaurant: 'Saito', cuisine: 'Japanese' },
      { morning: 'Imperial Palace', afternoon: 'Ginza District', restaurant: 'Quintessence', cuisine: 'Japanese' },
      { morning: 'Harajuku', afternoon: 'Yoyogi Park', restaurant: 'Den', cuisine: 'Japanese' },
      { morning: 'Odaiba', afternoon: 'Rainbow Bridge', restaurant: 'Kozasa', cuisine: 'Japanese' }
    ],
    'beijing': [
      { morning: 'Great Wall of China', afternoon: 'Forbidden City', restaurant: 'Da Dong', cuisine: 'Chinese' },
      { morning: 'Temple of Heaven', afternoon: 'Tiananmen Square', restaurant: 'Jing Yaa Tang', cuisine: 'Chinese' },
      { morning: 'Summer Palace', afternoon: 'Lama Temple', restaurant: 'Capital M', cuisine: 'Chinese' },
      { morning: 'Beihai Park', afternoon: 'Jingshan Park', restaurant: 'Made in China', cuisine: 'Chinese' },
      { morning: 'Hutong Tour', afternoon: 'Wangfujing Street', restaurant: 'Duck de Chine', cuisine: 'Chinese' },
      { morning: 'Olympic Park', afternoon: '798 Art District', restaurant: 'TRB Hutong', cuisine: 'Chinese' },
      { morning: 'Ming Tombs', afternoon: 'Mutianyu Great Wall', restaurant: 'Jing Yaa Tang', cuisine: 'Chinese' }
    ],
    'shanghai': [
      { morning: 'The Bund', afternoon: 'Yu Garden', restaurant: 'Ultraviolet', cuisine: 'Chinese' },
      { morning: 'Shanghai Tower', afternoon: 'Nanjing Road', restaurant: 'Fu 1015', cuisine: 'Chinese' },
      { morning: 'Tianzifang', afternoon: 'Xintiandi', restaurant: 'Jade on 36', cuisine: 'Chinese' },
      { morning: 'Shanghai Museum', afternoon: 'People\'s Square', restaurant: 'Hakkasan', cuisine: 'Chinese' },
      { morning: 'Lujiazui', afternoon: 'Century Park', restaurant: 'Mercato', cuisine: 'Italian' },
      { morning: 'French Concession', afternoon: 'Shanghai Disneyland', restaurant: 'Lost Heaven', cuisine: 'Chinese' },
      { morning: 'Zhujiajiao Water Town', afternoon: 'Shanghai Circus', restaurant: 'Din Tai Fung', cuisine: 'Chinese' }
    ],
    'barcelona': [
      { morning: 'Sagrada Familia', afternoon: 'Park Guell', restaurant: 'El Celler de Can Roca', cuisine: 'Spanish' },
      { morning: 'La Rambla', afternoon: 'Gothic Quarter', restaurant: 'Tickets', cuisine: 'Spanish' },
      { morning: 'Casa Batllo', afternoon: 'Casa Mila', restaurant: 'ABaC', cuisine: 'Spanish' },
      { morning: 'Montjuic Castle', afternoon: 'Magic Fountain', restaurant: 'Disfrutar', cuisine: 'Spanish' },
      { morning: 'Barceloneta Beach', afternoon: 'Port Vell', restaurant: 'Pakta', cuisine: 'Peruvian-Japanese' },
      { morning: 'Tibidabo', afternoon: 'Temple of the Sacred Heart', restaurant: 'Moments', cuisine: 'Spanish' },
      { morning: 'Camp Nou', afternoon: 'Poble Espanyol', restaurant: 'Lasarte', cuisine: 'Spanish' }
    ],
    'amsterdam': [
      { morning: 'Anne Frank House', afternoon: 'Van Gogh Museum', restaurant: 'Restaurant de Kas', cuisine: 'Dutch' },
      { morning: 'Rijksmuseum', afternoon: 'Vondelpark', restaurant: 'Ciel Bleu', cuisine: 'French' },
      { morning: 'Dam Square', afternoon: 'Red Light District', restaurant: 'Bord\'Eau', cuisine: 'French' },
      { morning: 'Canal Cruise', afternoon: 'Jordaan District', restaurant: 'Restaurant 212', cuisine: 'International' },
      { morning: 'Heineken Experience', afternoon: 'Museumplein', restaurant: 'Ron Gastrobar', cuisine: 'Dutch' },
      { morning: 'Albert Cuyp Market', afternoon: 'De Pijp', restaurant: 'Restaurant Floreyn', cuisine: 'Dutch' },
      { morning: 'Zaanse Schans', afternoon: 'Windmills Tour', restaurant: 'Restaurant As', cuisine: 'Dutch' }
    ],
    'berlin': [
      { morning: 'Brandenburg Gate', afternoon: 'Reichstag Building', restaurant: 'Facil', cuisine: 'German' },
      { morning: 'Berlin Wall Memorial', afternoon: 'Checkpoint Charlie', restaurant: 'Tim Raue', cuisine: 'Asian' },
      { morning: 'Museum Island', afternoon: 'Alexanderplatz', restaurant: 'Lorenz Adlon', cuisine: 'German' },
      { morning: 'East Side Gallery', afternoon: 'Kreuzberg', restaurant: 'Pauly Saal', cuisine: 'German' },
      { morning: 'Tiergarten', afternoon: 'Victory Column', restaurant: 'Fischers Fritz', cuisine: 'German' },
      { morning: 'Potsdamer Platz', afternoon: 'Sony Center', restaurant: 'Horvath', cuisine: 'German' },
      { morning: 'Charlottenburg Palace', afternoon: 'Kurfurstendamm', restaurant: 'Rutz', cuisine: 'German' }
    ],
    'kuala lumpur': [
      { morning: 'Petronas Towers', afternoon: 'KL Tower', restaurant: 'Nobu Kuala Lumpur', cuisine: 'Japanese' },
      { morning: 'Batu Caves', afternoon: 'Merdeka Square', restaurant: 'Bijan Bar & Restaurant', cuisine: 'Malaysian' },
      { morning: 'KLCC Park', afternoon: 'Central Market', restaurant: 'Cantaloupe', cuisine: 'International' },
      { morning: 'Petaling Street', afternoon: 'KL Bird Park', restaurant: 'Enak KL', cuisine: 'Malaysian' },
      { morning: 'Aquaria KLCC', afternoon: 'Sunway Lagoon', restaurant: 'Fuego at Troika Sky Dining', cuisine: 'Latin American' },
      { morning: 'Genting Highlands', afternoon: 'Putrajaya', restaurant: 'Marble 8', cuisine: 'Steakhouse' },
      { morning: 'Pavilion KL', afternoon: 'Suria KLCC', restaurant: 'Sage Restaurant & Wine Bar', cuisine: 'International' }
    ],
    'stockholm': [
      { morning: 'Gamla Stan', afternoon: 'Royal Palace', restaurant: 'Frantzen', cuisine: 'Swedish' },
      { morning: 'Vasa Museum', afternoon: 'Skansen', restaurant: 'Oaxen Slip', cuisine: 'Swedish' },
      { morning: 'Stockholm City Hall', afternoon: 'ABBA Museum', restaurant: 'Ekstedt', cuisine: 'Swedish' },
      { morning: 'Djurgarden', afternoon: 'Fotografiska', restaurant: 'Gastrologik', cuisine: 'Swedish' },
      { morning: 'Drottningholm Palace', afternoon: 'Moderna Museet', restaurant: 'Operakallaren', cuisine: 'Swedish' },
      { morning: 'Stockholm Archipelago', afternoon: 'Kungstradgarden', restaurant: 'Lilla Ego', cuisine: 'Swedish' },
      { morning: 'Ostermalm', afternoon: 'Sodermalm', restaurant: 'Aira', cuisine: 'Swedish' }
    ],
    'new york': [
      { morning: 'Statue of Liberty', afternoon: 'Empire State Building', restaurant: 'Eleven Madison Park', cuisine: 'American' },
      { morning: 'Central Park', afternoon: 'Times Square', restaurant: 'Le Bernardin', cuisine: 'French' },
      { morning: 'Metropolitan Museum of Art', afternoon: 'Brooklyn Bridge', restaurant: 'Per Se', cuisine: 'American' },
      { morning: 'Broadway', afternoon: 'Rockefeller Center', restaurant: 'Gramercy Tavern', cuisine: 'American' },
      { morning: 'High Line', afternoon: 'Chelsea Market', restaurant: 'Daniel', cuisine: 'French' },
      { morning: '9/11 Memorial', afternoon: 'One World Trade Center', restaurant: 'Jean-Georges', cuisine: 'French' },
      { morning: 'MoMA', afternoon: 'Fifth Avenue', restaurant: 'Blue Hill at Stone Barns', cuisine: 'American' }
    ],
    'singapore': [
      { morning: 'Marina Bay Sands', afternoon: 'Gardens by the Bay', restaurant: 'Odette', cuisine: 'French' },
      { morning: 'Sentosa Island', afternoon: 'Universal Studios', restaurant: 'Les Amis', cuisine: 'French' },
      { morning: 'Chinatown', afternoon: 'Little India', restaurant: 'Burnt Ends', cuisine: 'Australian' },
      { morning: 'Orchard Road', afternoon: 'Clarke Quay', restaurant: 'Labyrinth', cuisine: 'Singaporean' },
      { morning: 'Singapore Zoo', afternoon: 'Night Safari', restaurant: 'Meta', cuisine: 'Singaporean' },
      { morning: 'Botanic Gardens', afternoon: 'National Gallery', restaurant: 'Shinji by Kanesaka', cuisine: 'Japanese' },
      { morning: 'Jurong Bird Park', afternoon: 'Science Centre', restaurant: 'Candlenut', cuisine: 'Peranakan' }
    ],
    'bangkok': [
      { morning: 'Grand Palace', afternoon: 'Wat Phra Kaew', restaurant: 'Gaggan', cuisine: 'Indian' },
      { morning: 'Wat Arun', afternoon: 'Chinatown', restaurant: 'Sühring', cuisine: 'German' },
      { morning: 'Chatuchak Market', afternoon: 'Khao San Road', restaurant: 'Le Du', cuisine: 'Thai' },
      { morning: 'Jim Thompson House', afternoon: 'Siam Paragon', restaurant: 'Bo.lan', cuisine: 'Thai' },
      { morning: 'Lumpini Park', afternoon: 'MBK Center', restaurant: 'Nahm', cuisine: 'Thai' },
      { morning: 'Damnoen Saduak', afternoon: 'Maeklong Railway', restaurant: 'Issaya Siamese Club', cuisine: 'Thai' },
      { morning: 'Ayutthaya', afternoon: 'Bang Pa-In Palace', restaurant: 'Paste', cuisine: 'Thai' }
    ],
    'istanbul': [
      { morning: 'Hagia Sophia', afternoon: 'Blue Mosque', restaurant: 'Mikla', cuisine: 'Turkish' },
      { morning: 'Topkapi Palace', afternoon: 'Grand Bazaar', restaurant: 'Çiya Sofrası', cuisine: 'Turkish' },
      { morning: 'Basilica Cistern', afternoon: 'Sultanahmet Square', restaurant: 'Tugra', cuisine: 'Turkish' },
      { morning: 'Galata Tower', afternoon: 'Taksim Square', restaurant: '360 Istanbul', cuisine: 'International' },
      { morning: 'Dolmabahce Palace', afternoon: 'Bosphorus Cruise', restaurant: 'Pandeli', cuisine: 'Turkish' },
      { morning: 'Spice Bazaar', afternoon: 'Suleymaniye Mosque', restaurant: 'Kebapçı İskender', cuisine: 'Turkish' },
      { morning: 'Princes Islands', afternoon: 'Ortakoy Mosque', restaurant: 'Balıkçı Lokantası', cuisine: 'Turkish' }
    ],
    'cairo': [
      { morning: 'Pyramids of Giza', afternoon: 'Sphinx', restaurant: 'Abu El Sid', cuisine: 'Egyptian' },
      { morning: 'Egyptian Museum', afternoon: 'Khan el-Khalili', restaurant: 'Felfela', cuisine: 'Egyptian' },
      { morning: 'Islamic Cairo', afternoon: 'Al-Azhar Mosque', restaurant: 'Koshary Abou Tarek', cuisine: 'Egyptian' },
      { morning: 'Coptic Cairo', afternoon: 'Hanging Church', restaurant: 'El Horreya', cuisine: 'Egyptian' },
      { morning: 'Saqqara', afternoon: 'Dahshur', restaurant: 'Andrea Mariouteya', cuisine: 'Egyptian' },
      { morning: 'Memphis', afternoon: 'Mit Rahina', restaurant: 'Al-Azhar Kebab', cuisine: 'Egyptian' },
      { morning: 'Alexandria', afternoon: 'Bibliotheca Alexandrina', restaurant: 'Kebdet El Prince', cuisine: 'Egyptian' }
    ],
    'mexico city': [
      { morning: 'Zocalo', afternoon: 'Templo Mayor', restaurant: 'Pujol', cuisine: 'Mexican' },
      { morning: 'Chapultepec Castle', afternoon: 'Anthropology Museum', restaurant: 'Quintonil', cuisine: 'Mexican' },
      { morning: 'Frida Kahlo Museum', afternoon: 'Coyoacan', restaurant: 'Rosetta', cuisine: 'Mexican' },
      { morning: 'Teotihuacan', afternoon: 'Pyramids of Sun and Moon', restaurant: 'Sud 777', cuisine: 'Mexican' },
      { morning: 'Xochimilco', afternoon: 'Floating Gardens', restaurant: 'Biko', cuisine: 'Mexican' },
      { morning: 'Palacio de Bellas Artes', afternoon: 'Alameda Central', restaurant: 'Limo', cuisine: 'Mexican' },
      { morning: 'Coyoacan Market', afternoon: 'San Angel', restaurant: 'Azul Historico', cuisine: 'Mexican' }
    ],
    'toronto': [
      { morning: 'CN Tower', afternoon: 'Ripley\'s Aquarium', restaurant: 'Alo', cuisine: 'French' },
      { morning: 'Royal Ontario Museum', afternoon: 'Casa Loma', restaurant: 'Canis', cuisine: 'Canadian' },
      { morning: 'Distillery District', afternoon: 'St. Lawrence Market', restaurant: 'Edulis', cuisine: 'Canadian' },
      { morning: 'High Park', afternoon: 'Kensington Market', restaurant: 'Bar Isabel', cuisine: 'Spanish' },
      { morning: 'Toronto Islands', afternoon: 'Centre Island', restaurant: 'DaiLo', cuisine: 'Asian' },
      { morning: 'Art Gallery of Ontario', afternoon: 'Eaton Centre', restaurant: 'Richmond Station', cuisine: 'Canadian' },
      { morning: 'Harbourfront Centre', afternoon: 'Toronto Zoo', restaurant: 'Buca', cuisine: 'Italian' }
    ],
    'sydney': [
      { morning: 'Sydney Opera House', afternoon: 'Sydney Harbour Bridge', restaurant: 'Quay', cuisine: 'Australian' },
      { morning: 'Bondi Beach', afternoon: 'Bondi to Bronte Walk', restaurant: 'Tetsuya\'s', cuisine: 'Japanese' },
      { morning: 'Taronga Zoo', afternoon: 'Manly Beach', restaurant: 'Sepia', cuisine: 'Japanese' },
      { morning: 'Royal Botanic Garden', afternoon: 'The Rocks', restaurant: 'Momofuku Seiobo', cuisine: 'Asian' },
      { morning: 'Darling Harbour', afternoon: 'Sydney Tower Eye', restaurant: 'Bentley Restaurant', cuisine: 'Australian' },
      { morning: 'Blue Mountains', afternoon: 'Three Sisters', restaurant: 'Est.', cuisine: 'Australian' },
      { morning: 'Featherdale Wildlife Park', afternoon: 'Parramatta', restaurant: 'LuMi Dining', cuisine: 'Italian' }
    ]
  };
  
  // Use specific attractions for known cities, or generic ones for unknown cities
  const cityAttractions = attractions[locationKey] || getGenericAttractions(locationKey);
  
  for (let i = 1; i <= totalDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateString = currentDate.toISOString().split('T')[0];
    
    const dayAttraction = cityAttractions[(i - 1) % cityAttractions.length];
    
    itineraries.push({
      day: i,
      date: dateString,
      title: `Day ${i} – ${dateString}`,
      morning: {
        activity: dayAttraction.morning,
        description: attractions[locationKey] 
          ? `Visit the iconic ${dayAttraction.morning}, one of the most famous attractions in ${destination}.`
          : `Start your day by exploring ${dayAttraction.morning} in ${destination}, a popular area for visitors.`,
        image: `https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop&q=80`,
        time: "09:00",
        location: getAttractionCoordinates(dayAttraction.morning, destination)
      },
      afternoon: {
        activity: dayAttraction.afternoon,
        description: attractions[locationKey]
          ? `Explore ${dayAttraction.afternoon}, a must-visit destination in ${destination}.`
          : `Continue your exploration with ${dayAttraction.afternoon}, another interesting area in ${destination}.`,
        image: `https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop&q=80`,
        time: "14:00",
        location: getAttractionCoordinates(dayAttraction.afternoon, destination)
      },
      restaurant: {
        name: dayAttraction.restaurant,
        cuisine: dayAttraction.cuisine,
        description: attractions[locationKey]
          ? `Enjoy authentic ${dayAttraction.cuisine} cuisine at this popular local restaurant`
          : `Experience local flavors at ${dayAttraction.restaurant}, serving delicious ${dayAttraction.cuisine} cuisine`,
        location: coordinates
      }
    });
  }
  
  return {
    destination: destination,
    dates: {
      start: requestData.startDate,
      end: requestData.endDate
    },
    headerImage: `https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=1200&h=600&fit=crop&q=80`,
    overview: {
      history: `${destination} is a fascinating destination with rich history and culture. From ancient landmarks to modern attractions, there's something for every traveler to discover.`,
      culture: `The local culture is vibrant and welcoming, offering visitors a unique blend of traditional customs and contemporary lifestyle.`
    },
    airport: {
      name: `${locationKey} International Airport`,
      image: `https://cf.bstatic.com/xdata/images/hotel/square600/510565710.webp?k=dff438e940e280b0b5740485b7a0a6b9bd9adfa97f59a835c7f98536bc137080&o=`,
      info: `The main international airport serving ${destination}, offering connections to major cities worldwide.`
    },
    hotels: [
      {
        name: `Luxury Hotel ${locationKey}`,
        image: `https://cf.bstatic.com/xdata/images/hotel/square600/510565710.webp?k=dff438e940e280b0b5740485b7a0a6b9bd9adfa97f59a835c7f98536bc137080&o=`,
        rating: 4.8,
        price: 250,
        link: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(`Luxury Hotel ${locationKey}`)}&aid=1891470&utm_source=neyalaAI&utm_medium=travel_planner&utm_campaign=hotel_booking`,
        location: coordinates
      },
      {
        name: `Comfort Inn ${locationKey}`,
        image: `https://cf.bstatic.com/xdata/images/hotel/square600/583993655.webp?k=ee897e371b17460203379ef7f5cd2eadff8a1cc5e49adc139c7ef70f1c118b09&o=`,
        rating: 4.2,
        price: 120,
        link: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(`Comfort Inn ${locationKey}`)}&aid=1891470&utm_source=neyalaAI&utm_medium=travel_planner&utm_campaign=hotel_booking`,
        location: coordinates
      },
      {
        name: `Budget Hostel ${locationKey}`,
        image: `https://cf.bstatic.com/xdata/images/hotel/square600/749265489.webp?k=7b8f592ffd657941e29fd267a71249fd888ef5423c0d5dd2a2a8d4b3fb805725&o=`,
        rating: 3.8,
        price: 45,
        link: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(`Hostel ${locationKey}`)}&aid=1891470&utm_source=neyalaAI&utm_medium=travel_planner&utm_campaign=hotel_booking`,
        location: coordinates
      }
    ],
    itineraries: itineraries,
    transportation: [
      {
        type: "Metro",
        description: `Efficient metro system connecting major attractions in ${destination}`,
        icon: "/icons/metro.svg"
      },
      {
        type: "Bus",
        description: `Comprehensive bus network for exploring the city and surrounding areas`,
        icon: "/icons/bus.svg"
      },
      {
        type: "Walking",
        description: `Many attractions are within walking distance in the city center`,
        icon: "/icons/walking.svg"
      }
    ],
    estimatedCost: {
      accommodation: 415,
      activities: 150,
      transportation: 50,
      food: 200,
      total: 815
    }
  };
}

// Helper function to get location coordinates
function getLocationCoordinates(location: string): { lat: number; lng: number } {
  const coordinates: { [key: string]: { lat: number; lng: number } } = {
    'paris': { lat: 48.8566, lng: 2.3522 },
    'london': { lat: 51.5074, lng: -0.1278 },
    'new york': { lat: 40.7128, lng: -74.0060 },
    'tokyo': { lat: 35.6762, lng: 139.6503 },
    'singapore': { lat: 1.3521, lng: 103.8198 },
    'dubai': { lat: 25.2048, lng: 55.2708 },
    'bangkok': { lat: 13.7563, lng: 100.5018 },
    'bali': { lat: -8.3405, lng: 115.0920 },
    'rome': { lat: 41.9028, lng: 12.4964 },
    'barcelona': { lat: 41.3851, lng: 2.1734 },
    'amsterdam': { lat: 52.3676, lng: 4.9041 },
    'berlin': { lat: 52.5200, lng: 13.4050 },
    'prague': { lat: 50.0755, lng: 14.4378 },
    'vienna': { lat: 48.2082, lng: 16.3738 },
    'budapest': { lat: 47.4979, lng: 19.0402 },
    'milan': { lat: 45.4642, lng: 9.1900 },
    'venice': { lat: 45.4408, lng: 12.3155 },
    'florence': { lat: 43.7696, lng: 11.2558 },
    'madrid': { lat: 40.4168, lng: -3.7038 },
    'lisbon': { lat: 38.7223, lng: -9.1393 },
    'kuala lumpur': { lat: 3.1390, lng: 101.6869 },
    'malaysia': { lat: 3.1390, lng: 101.6869 },
    'beijing': { lat: 39.9042, lng: 116.4074 },
    'shanghai': { lat: 31.2304, lng: 121.4737 },
    'hong kong': { lat: 22.3193, lng: 114.1694 },
    'seoul': { lat: 37.5665, lng: 126.9780 },
    'osaka': { lat: 34.6937, lng: 135.5023 },
    'kyoto': { lat: 35.0116, lng: 135.7681 },
    'mumbai': { lat: 19.0760, lng: 72.8777 },
    'delhi': { lat: 28.7041, lng: 77.1025 },
    'chennai': { lat: 13.0827, lng: 80.2707 },
    'kolkata': { lat: 22.5726, lng: 88.3639 },
    'hyderabad': { lat: 17.3850, lng: 78.4867 },
    'pune': { lat: 18.5204, lng: 73.8567 },
    'ahmedabad': { lat: 23.0225, lng: 72.5714 },
    'surat': { lat: 21.1702, lng: 72.8311 },
    'jaipur': { lat: 26.9124, lng: 75.7873 },
    'lucknow': { lat: 26.8467, lng: 80.9462 },
    'kanpur': { lat: 26.4499, lng: 80.3319 },
    'nagpur': { lat: 21.1458, lng: 79.0882 },
    'indore': { lat: 22.7196, lng: 75.8577 },
    'thane': { lat: 19.2183, lng: 72.9781 },
    'bhopal': { lat: 23.2599, lng: 77.4126 },
    'visakhapatnam': { lat: 17.6868, lng: 83.2185 },
    'patna': { lat: 25.5941, lng: 85.1376 },
    'vadodara': { lat: 22.3072, lng: 73.1812 },
    'ghaziabad': { lat: 28.6692, lng: 77.4538 },
    'ludhiana': { lat: 30.9010, lng: 75.8573 },
    'agra': { lat: 27.1767, lng: 78.0081 },
    'nashik': { lat: 19.9975, lng: 73.7898 },
    'faridabad': { lat: 28.4089, lng: 77.3178 },
    'meerut': { lat: 28.9845, lng: 77.7064 },
    'rajkot': { lat: 22.3039, lng: 70.8022 },
    'kalyan': { lat: 19.2433, lng: 73.1355 },
    'vasai': { lat: 19.4259, lng: 72.8225 },
    'vashi': { lat: 19.0760, lng: 72.8777 },
    'aurangabad': { lat: 19.8762, lng: 75.3433 },
    'noida': { lat: 28.5355, lng: 77.3910 },
    'solapur': { lat: 17.6599, lng: 75.9064 },
    'ranchi': { lat: 23.3441, lng: 85.3096 },
    'howrah': { lat: 22.5958, lng: 88.2636 },
    'coimbatore': { lat: 11.0168, lng: 76.9558 },
    'jabalpur': { lat: 23.1815, lng: 79.9864 },
    'gwalior': { lat: 26.2183, lng: 78.1828 },
    'vijayawada': { lat: 16.5062, lng: 80.6480 },
    'jodhpur': { lat: 26.2389, lng: 73.0243 },
    'madurai': { lat: 9.9252, lng: 78.1198 },
    'raipur': { lat: 21.2514, lng: 81.6296 },
    'kota': { lat: 25.2138, lng: 75.8648 },
    'guwahati': { lat: 26.1445, lng: 91.7362 },
    'chandigarh': { lat: 30.7333, lng: 76.7794 },
    'new delhi': { lat: 28.6139, lng: 77.2090 },
    'gurgaon': { lat: 28.4595, lng: 77.0266 },
    'stockholm': { lat: 59.3293, lng: 18.0686 },
    'sweden': { lat: 59.3293, lng: 18.0686 },
    'oslo': { lat: 59.9139, lng: 10.7522 },
    'norway': { lat: 59.9139, lng: 10.7522 },
    'copenhagen': { lat: 55.6761, lng: 12.5683 },
    'denmark': { lat: 55.6761, lng: 12.5683 },
    'helsinki': { lat: 60.1699, lng: 24.9384 },
    'finland': { lat: 60.1699, lng: 24.9384 },
    'warsaw': { lat: 52.2297, lng: 21.0122 },
    'poland': { lat: 52.2297, lng: 21.0122 },
    'hungary': { lat: 47.4979, lng: 19.0402 },
    'bratislava': { lat: 48.1486, lng: 17.1077 },
    'slovakia': { lat: 48.1486, lng: 17.1077 },
    'ljubljana': { lat: 46.0569, lng: 14.5058 },
    'slovenia': { lat: 46.0569, lng: 14.5058 },
    'zagreb': { lat: 45.8150, lng: 15.9819 },
    'croatia': { lat: 45.8150, lng: 15.9819 },
    'belgrade': { lat: 44.7866, lng: 20.4489 },
    'serbia': { lat: 44.7866, lng: 20.4489 },
    'sofia': { lat: 42.6977, lng: 23.3219 },
    'bulgaria': { lat: 42.6977, lng: 23.3219 },
    'bucharest': { lat: 44.4268, lng: 26.1025 },
    'romania': { lat: 44.4268, lng: 26.1025 },
    'athens': { lat: 37.9838, lng: 23.7275 },
    'greece': { lat: 37.9838, lng: 23.7275 },
    'istanbul': { lat: 41.0082, lng: 28.9784 },
    'turkey': { lat: 41.0082, lng: 28.9784 },
    'ankara': { lat: 39.9334, lng: 32.8597 },
    'izmir': { lat: 38.4192, lng: 27.1287 },
    'antalya': { lat: 36.8969, lng: 30.7133 },
    'moscow': { lat: 55.7558, lng: 37.6176 },
    'russia': { lat: 55.7558, lng: 37.6176 },
    'saint petersburg': { lat: 59.9311, lng: 30.3609 },
    'kiev': { lat: 50.4501, lng: 30.5234 },
    'ukraine': { lat: 50.4501, lng: 30.5234 },
    'minsk': { lat: 53.9045, lng: 27.5615 },
    'belarus': { lat: 53.9045, lng: 27.5615 },
    'riga': { lat: 56.9496, lng: 24.1052 },
    'latvia': { lat: 56.9496, lng: 24.1052 },
    'tallinn': { lat: 59.4370, lng: 24.7536 },
    'estonia': { lat: 59.4370, lng: 24.7536 },
    'vilnius': { lat: 54.6872, lng: 25.2797 },
    'lithuania': { lat: 54.6872, lng: 25.2797 },
    'reykjavik': { lat: 64.1466, lng: -21.9426 },
    'iceland': { lat: 64.1466, lng: -21.9426 },
    'dublin': { lat: 53.3498, lng: -6.2603 },
    'ireland': { lat: 53.3498, lng: -6.2603 },
    'glasgow': { lat: 55.8642, lng: -4.2518 },
    'edinburgh': { lat: 55.9533, lng: -3.1883 },
    'cardiff': { lat: 51.4816, lng: -3.1791 },
    'belfast': { lat: 54.5973, lng: -5.9301 },
    'manchester': { lat: 53.4808, lng: -2.2426 },
    'birmingham': { lat: 52.4862, lng: -1.8904 },
    'leeds': { lat: 53.8008, lng: -1.5491 },
    'liverpool': { lat: 53.4084, lng: -2.9916 },
    'newcastle': { lat: 54.9783, lng: -1.6178 },
    'sheffield': { lat: 53.3811, lng: -1.4701 },
    'bristol': { lat: 51.4545, lng: -2.5879 },
    'nottingham': { lat: 52.9548, lng: -1.1581 },
    'leicester': { lat: 52.6369, lng: -1.1398 },
    'coventry': { lat: 52.4068, lng: -1.5197 },
    'bradford': { lat: 53.7938, lng: -1.7524 },
    'stoke': { lat: 53.0027, lng: -2.1794 },
    'wolverhampton': { lat: 52.5869, lng: -2.1286 },
    'plymouth': { lat: 50.3755, lng: -4.1427 },
    'southampton': { lat: 50.9097, lng: -1.4044 },
    'portsmouth': { lat: 50.8198, lng: -1.1139 },
    'swansea': { lat: 51.6214, lng: -3.9436 },
    'aberdeen': { lat: 57.1497, lng: -2.0943 },
    'dundee': { lat: 56.4620, lng: -2.9707 },
    'inverness': { lat: 57.4778, lng: -4.2247 },
    'perth': { lat: 56.3950, lng: -3.4308 },
    'stirling': { lat: 56.1165, lng: -3.9369 },
    'dunfermline': { lat: 56.0719, lng: -3.4523 },
    'ayr': { lat: 55.4586, lng: -4.6292 },
    'kilmarnock': { lat: 55.6117, lng: -4.4957 },
    'greenock': { lat: 55.9489, lng: -4.7619 },
    'paisley': { lat: 55.8473, lng: -4.4406 },
    'hamilton': { lat: 55.7772, lng: -4.0397 },
    'east kilbride': { lat: 55.7642, lng: -4.1776 },
    'cumbernauld': { lat: 55.9469, lng: -3.9905 },
    'livingston': { lat: 55.8844, lng: -3.5226 },
    'glenrothes': { lat: 56.1951, lng: -3.1758 },
    'falkirk': { lat: 56.0019, lng: -3.7839 }
  };
  
  const locationKey = location.toLowerCase().split(',')[0].trim();
  return coordinates[locationKey] || { lat: 0, lng: 0 }; // Default to null island instead of Paris
}

// Helper function to get specific attraction coordinates
function getAttractionCoordinates(attraction: string, city: string): { lat: number; lng: number } {
  const allAttractions: { [key: string]: { lat: number; lng: number } } = {
    // Dubai attractions
    'burj khalifa': { lat: 25.197197, lng: 55.274376 },
    'dubai mall': { lat: 25.197197, lng: 55.274376 },
    'palm jumeirah': { lat: 25.116667, lng: 55.133333 },
    'dubai marina': { lat: 25.073611, lng: 55.1375 },
    'dubai miracle garden': { lat: 25.058611, lng: 55.243056 },
    'global village': { lat: 25.058611, lng: 55.243056 },
    'dubai desert conservation reserve': { lat: 24.933333, lng: 55.75 },
    'ski dubai': { lat: 25.116667, lng: 55.2 },
    'jumeirah mosque': { lat: 25.233333, lng: 55.266667 },
    'the dubai fountain': { lat: 25.197197, lng: 55.274376 },
    'dubai frame': { lat: 25.233333, lng: 55.266667 },
    'dubai museum': { lat: 25.265511, lng: 55.297155 },
    'dubai marina walk': { lat: 25.073611, lng: 55.1375 },
    'dubai creek': { lat: 25.265511, lng: 55.297155 },
    
    // Kuala Lumpur attractions
    'petronas towers': { lat: 3.1579, lng: 101.7116 },
    'kl tower': { lat: 3.1528, lng: 101.7038 },
    'batu caves': { lat: 3.2373, lng: 101.6835 },
    'merdeka square': { lat: 3.1486, lng: 101.6952 },
    'sultan abdul samad building': { lat: 3.1486, lng: 101.6952 },
    'masjid negara': { lat: 3.1412, lng: 101.6865 },
    'klcc park': { lat: 3.1579, lng: 101.7116 },
    'central market': { lat: 3.1447, lng: 101.6958 },
    'petaling street': { lat: 3.1447, lng: 101.6958 },
    'kl bird park': { lat: 3.1412, lng: 101.6865 },
    'aquaria klcc': { lat: 3.1579, lng: 101.7116 },
    'sunway lagoon': { lat: 3.0716, lng: 101.6054 },
    'genting highlands': { lat: 3.4244, lng: 101.7929 },
    'putrajaya': { lat: 2.9264, lng: 101.6964 },
    'kl sentral': { lat: 3.1340, lng: 101.6869 },
    'pavilion kl': { lat: 3.1496, lng: 101.7136 },
    'suria klcc': { lat: 3.1579, lng: 101.7116 },
    'times square': { lat: 3.1496, lng: 101.7136 },
    'berjaya times square': { lat: 3.1496, lng: 101.7136 },
    'mid valley megamall': { lat: 3.1171, lng: 101.6778 },
    'one utama': { lat: 3.1496, lng: 101.7136 },
    'klia': { lat: 2.7456, lng: 101.7072 },
    'klia2': { lat: 2.7456, lng: 101.7072 },
    
    // Stockholm attractions
    'gamla stan': { lat: 59.3251, lng: 18.0719 },
    'royal palace': { lat: 59.3269, lng: 18.0717 },
    'stockholm city hall': { lat: 59.3274, lng: 18.0543 },
    'vasa museum': { lat: 59.3280, lng: 18.0914 },
    'skansen': { lat: 59.3293, lng: 18.1054 },
    'djurgarden': { lat: 59.3293, lng: 18.1054 },
    'abba museum': { lat: 59.3240, lng: 18.0967 },
    'nobel museum': { lat: 59.3251, lng: 18.0719 },
    'stockholm archipelago': { lat: 59.3293, lng: 18.0686 },
    'drottningholm palace': { lat: 59.3219, lng: 17.8866 },
    'fotografiska': { lat: 59.3187, lng: 18.0815 },
    'moderna museet': { lat: 59.3251, lng: 18.0719 },
    'national museum': { lat: 59.3251, lng: 18.0719 },
    'kungstradgarden': { lat: 59.3293, lng: 18.0686 },
    'ostermalm': { lat: 59.3347, lng: 18.0762 },
    'sodermalm': { lat: 59.3150, lng: 18.0722 },
    'kungsholmen': { lat: 59.3293, lng: 18.0686 },
    'vasastan': { lat: 59.3417, lng: 18.0494 },
    'norrmalm': { lat: 59.3293, lng: 18.0686 },
    'ostermalmstorg': { lat: 59.3347, lng: 18.0762 },
    'stureplan': { lat: 59.3347, lng: 18.0762 },
    'biblioteksgatan': { lat: 59.3347, lng: 18.0762 },
    'kungsgatan': { lat: 59.3293, lng: 18.0686 },
    'drottninggatan': { lat: 59.3293, lng: 18.0686 },
    'sveavagen': { lat: 59.3293, lng: 18.0686 },
    'birger jarlsgatan': { lat: 59.3347, lng: 18.0762 },
    'strandvagen': { lat: 59.3293, lng: 18.0686 },
    'nybroviken': { lat: 59.3293, lng: 18.0686 },
    'stromkajen': { lat: 59.3251, lng: 18.0719 },
    'skeppsholmen': { lat: 59.3251, lng: 18.0719 },
    'kastellholmen': { lat: 59.3251, lng: 18.0719 },
    'langholmen': { lat: 59.3150, lng: 18.0722 },
    'reimersholme': { lat: 59.3150, lng: 18.0722 },
    'lilla essingen': { lat: 59.3293, lng: 18.0686 },
    'stora essingen': { lat: 59.3293, lng: 18.0686 },
    'lovon': { lat: 59.3293, lng: 18.0686 },
    'grinda': { lat: 59.3293, lng: 18.0686 },
    'sandhamn': { lat: 59.3293, lng: 18.0686 },
    'vaxholm': { lat: 59.4028, lng: 18.3515 },
    'mariefred': { lat: 59.3293, lng: 18.0686 },
    'sigtuna': { lat: 59.6174, lng: 17.7236 },
    'uppsala': { lat: 59.8586, lng: 17.6389 },
    
    // Paris attractions
    'eiffel tower': { lat: 48.8584, lng: 2.2945 },
    'louvre museum': { lat: 48.8606, lng: 2.3376 },
    'notre-dame cathedral': { lat: 48.8530, lng: 2.3499 },
    'arc de triomphe': { lat: 48.8738, lng: 2.2950 },
    'montmartre': { lat: 48.8867, lng: 2.3431 },
    'champs-élysées': { lat: 48.8698, lng: 2.3077 },
    'sacre-coeur': { lat: 48.8867, lng: 2.3431 },
    'musee d\'orsay': { lat: 48.8600, lng: 2.3266 },
    'palace of versailles': { lat: 48.8044, lng: 2.1232 },
    'centre pompidou': { lat: 48.8607, lng: 2.3522 },
    'luxembourg gardens': { lat: 48.8462, lng: 2.3376 },
    'pantheon paris': { lat: 48.8462, lng: 2.3464 },
    
    // London attractions
    'big ben': { lat: 51.4994, lng: -0.1245 },
    'british museum': { lat: 51.5194, lng: -0.1270 },
    'tower of london': { lat: 51.5081, lng: -0.0759 },
    'buckingham palace': { lat: 51.5014, lng: -0.1419 },
    'london eye': { lat: 51.5003, lng: -0.1247 },
    'westminster abbey': { lat: 51.4995, lng: -0.1273 },
    'tower bridge': { lat: 51.5055, lng: -0.0754 },
    'st. paul\'s cathedral': { lat: 51.5139, lng: -0.0984 },
    'hyde park': { lat: 51.5073, lng: -0.1657 },
    'natural history museum': { lat: 51.4967, lng: -0.1764 },
    'covent garden': { lat: 51.5122, lng: -0.1220 },
    'trafalgar square': { lat: 51.5080, lng: -0.1281 },
    'camden market': { lat: 51.5419, lng: -0.1456 },
    'regent\'s park': { lat: 51.5314, lng: -0.1518 },
    
    // Rome attractions
    'colosseum': { lat: 41.8902, lng: 12.4922 },
    'roman forum': { lat: 41.8925, lng: 12.4853 },
    'vatican museums': { lat: 41.9066, lng: 12.4533 },
    'st. peter\'s basilica': { lat: 41.9022, lng: 12.4539 },
    'trevi fountain': { lat: 41.9009, lng: 12.4833 },
    'pantheon rome': { lat: 41.8986, lng: 12.4768 },
    'piazza navona': { lat: 41.8992, lng: 12.4731 },
    'castel sant\'angelo': { lat: 41.9031, lng: 12.4663 },
    'villa borghese': { lat: 41.9142, lng: 12.4919 },
    'spanish steps': { lat: 41.9060, lng: 12.4828 },
    'catacombs': { lat: 41.8587, lng: 12.5014 },
    'appian way': { lat: 41.8587, lng: 12.5014 },
    'capitoline museums': { lat: 41.8934, lng: 12.4828 },
    'palatine hill': { lat: 41.8894, lng: 12.4869 },
    
    // Tokyo attractions
    'senso-ji temple': { lat: 35.7148, lng: 139.7967 },
    'tokyo skytree': { lat: 35.7100, lng: 139.8107 },
    'meiji shrine': { lat: 35.6762, lng: 139.6993 },
    'shibuya crossing': { lat: 35.6595, lng: 139.7004 },
    'tsukiji fish market': { lat: 35.6654, lng: 139.7704 },
    'tokyo tower': { lat: 35.6586, lng: 139.7454 },
    'ueno park': { lat: 35.7148, lng: 139.7710 },
    'akihabara': { lat: 35.7022, lng: 139.7745 },
    'imperial palace': { lat: 35.6852, lng: 139.7528 },
    'ginza district': { lat: 35.6720, lng: 139.7679 },
    'harajuku': { lat: 35.6702, lng: 139.7016 },
    'yoyogi park': { lat: 35.6720, lng: 139.6970 },
    'odaiba': { lat: 35.6300, lng: 139.7800 },
    'rainbow bridge': { lat: 35.6363, lng: 139.7633 },
    
    // Beijing attractions
    'great wall of china': { lat: 40.4319, lng: 116.5704 },
    'forbidden city': { lat: 39.9163, lng: 116.3972 },
    'temple of heaven': { lat: 39.8822, lng: 116.4066 },
    'tiananmen square': { lat: 39.9042, lng: 116.4074 },
    'summer palace': { lat: 39.9999, lng: 116.2755 },
    'lama temple': { lat: 39.9444, lng: 116.4167 },
    'beihai park': { lat: 39.9244, lng: 116.3906 },
    'jingshan park': { lat: 39.9244, lng: 116.3906 },
    'hutong tour': { lat: 39.9042, lng: 116.4074 },
    'wangfujing street': { lat: 39.9087, lng: 116.3975 },
    'olympic park': { lat: 40.0028, lng: 116.3873 },
    '798 art district': { lat: 39.9847, lng: 116.4828 },
    'ming tombs': { lat: 40.2556, lng: 116.2225 },
    'mutianyu great wall': { lat: 40.4319, lng: 116.5704 },
    
    // Shanghai attractions
    'the bund': { lat: 31.2337, lng: 121.4903 },
    'yu garden': { lat: 31.2271, lng: 121.4924 },
    'shanghai tower': { lat: 31.2340, lng: 121.5060 },
    'nanjing road': { lat: 31.2337, lng: 121.4758 },
    'tianzifang': { lat: 31.2099, lng: 121.4737 },
    'xintiandi': { lat: 31.2099, lng: 121.4737 },
    'shanghai museum': { lat: 31.2284, lng: 121.4758 },
    'people\'s square': { lat: 31.2337, lng: 121.4758 },
    'lujiazui': { lat: 31.2340, lng: 121.5060 },
    'century park': { lat: 31.2099, lng: 121.5500 },
    'french concession': { lat: 31.2099, lng: 121.4737 },
    'shanghai disneyland': { lat: 31.1433, lng: 121.6572 },
    'zhujiajiao water town': { lat: 31.1111, lng: 121.0500 },
    'shanghai circus': { lat: 31.2337, lng: 121.4903 },
    
    // Barcelona attractions
    'sagrada familia': { lat: 41.4036, lng: 2.1744 },
    'park guell': { lat: 41.4145, lng: 2.1527 },
    'la rambla': { lat: 41.3775, lng: 2.1750 },
    'gothic quarter': { lat: 41.3833, lng: 2.1833 },
    'casa batllo': { lat: 41.3917, lng: 2.1650 },
    'casa mila': { lat: 41.3954, lng: 2.1619 },
    'montjuic castle': { lat: 41.3633, lng: 2.1650 },
    'magic fountain': { lat: 41.3711, lng: 2.1497 },
    'barceloneta beach': { lat: 41.3688, lng: 2.1900 },
    'port vell': { lat: 41.3688, lng: 2.1900 },
    'tibidabo': { lat: 41.4225, lng: 2.1200 },
    'temple of the sacred heart': { lat: 41.4225, lng: 2.1200 },
    'camp nou': { lat: 41.3809, lng: 2.1228 },
    'poble espanyol': { lat: 41.3711, lng: 2.1497 },
    
    // Amsterdam attractions
    'anne frank house': { lat: 52.3752, lng: 4.8840 },
    'van gogh museum': { lat: 52.3584, lng: 4.8811 },
    'rijksmuseum': { lat: 52.3600, lng: 4.8852 },
    'vondelpark': { lat: 52.3567, lng: 4.8683 },
    'dam square': { lat: 52.3731, lng: 4.8926 },
    'red light district': { lat: 52.3721, lng: 4.8994 },
    'jordaan district': { lat: 52.3731, lng: 4.8833 },
    'heineken experience': { lat: 52.3584, lng: 4.8914 },
    'museumplein': { lat: 52.3584, lng: 4.8811 },
    'albert cuyp market': { lat: 52.3567, lng: 4.8926 },
    'de pijp': { lat: 52.3567, lng: 4.8926 },
    'zaanse schans': { lat: 52.4736, lng: 4.8167 },
    
    // Berlin attractions
    'brandenburg gate': { lat: 52.5163, lng: 13.3777 },
    'reichstag building': { lat: 52.5186, lng: 13.3762 },
    'berlin wall memorial': { lat: 52.5350, lng: 13.3900 },
    'checkpoint charlie': { lat: 52.5075, lng: 13.3904 },
    'museum island': { lat: 52.5200, lng: 13.4000 },
    'alexanderplatz': { lat: 52.5219, lng: 13.4132 },
    'east side gallery': { lat: 52.5050, lng: 13.4400 },
    'kreuzberg': { lat: 52.4977, lng: 13.3880 },
    'tiergarten': { lat: 52.5145, lng: 13.3500 },
    'victory column': { lat: 52.5145, lng: 13.3500 },
    'potsdamer platz': { lat: 52.5096, lng: 13.3756 },
    'sony center': { lat: 52.5096, lng: 13.3756 },
    'charlottenburg palace': { lat: 52.5200, lng: 13.2960 },
    'kurfurstendamm': { lat: 52.5042, lng: 13.3270 }
  };
  
  const attractionKey = attraction.toLowerCase();
  return allAttractions[attractionKey] || getLocationCoordinates(city);
} 