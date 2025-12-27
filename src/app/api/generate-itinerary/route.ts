                                                                                                                import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { auth } from '@clerk/nextjs';
import { getDestinationHeaderImage, getAirportImage, getAirportPhotos, getActivityImage, generateESIMLink, validateAndFixHeaderImage } from '@/lib/unsplash';
import { getTransportationIcon } from '@/lib/transportation-icons';
import { getGroqChatCompletion } from '@/lib/groq';
// Removed getConfig import as it can cause clientModules issues in newer Next.js versions

// Debug logging
console.log('Environment check:', {
  nodeEnv: process.env.NODE_ENV
});

// Type definitions
interface ItineraryRequest {
  destination: string;
  startDate: string;
  endDate: string;
  travelGroup: string;
  requirements?: string[];
  budget?: string;
  travelStyle?: string;
  activities?: string[];
  userId: string;
}



// Constants
const API_TIMEOUT = 15000; // Reduced to 15 seconds for faster response

// Utility function to clean and parse JSON
const cleanAndParseJSON = (content: string): any => {
  // Log the raw content for debugging
  console.log('Raw content:', content);

  // First attempt: Try parsing as-is
  try {
    return JSON.parse(content);
  } catch (error) {
    console.log('Initial parse failed, attempting to clean content');
  }

  // Clean the content
  let cleanContent = content;
  
  // Remove markdown code blocks
  cleanContent = cleanContent.replace(/```json\s*([\s\S]*?)\s*```/g, '$1');
  cleanContent = cleanContent.replace(/```\s*([\s\S]*?)\s*```/g, '$1');
  
  // Basic cleanup
  cleanContent = cleanContent
    // Remove comments
    .replace(/\/\/.*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove whitespace
    .replace(/^\s+|\s+$/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    // Remove newlines
    .replace(/\n/g, ' ');

  console.log('After basic cleanup:', cleanContent);

  // Try parsing after basic cleanup
  try {
    return JSON.parse(cleanContent);
  } catch (error) {
    console.log('Basic cleanup parse failed, attempting advanced cleaning');
  }

  // Advanced cleanup
  cleanContent = cleanContent
    // Handle unquoted property names
    .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":')
    // Convert single quotes to double quotes
    .replace(/'([^']*?)'/g, '"$1"')
    // Remove trailing commas
    .replace(/,(\s*[}\]])/g, '$1')
    // Fix escaped quotes
    .replace(/\\"/g, '_QUOTE_')
    .replace(/"/g, '\\"')
    .replace(/_QUOTE_/g, '\\"')
    // Handle nested quotes
    .replace(/([^\\])"([^"]*?)\\?"([^"]*?)([^\\])"/g, '$1"$2\\"$3$4"');

  console.log('After advanced cleanup:', cleanContent);

  try {
    return JSON.parse(cleanContent);
  } catch (error) {
    console.log('Advanced cleanup parse failed, attempting final fixes');
  }

  // Final fixes
  cleanContent = cleanContent
    // Ensure all property names are quoted
    .replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3')
    // Remove quotes around objects/arrays
    .replace(/"{/g, '{')
    .replace(/}"/g, '}')
    .replace(/"\[/g, '[')
    .replace(/\]"/g, ']')
    // Fix boolean values
    .replace(/"(true|false)"/g, '$1')
    // Fix numeric values
    .replace(/"(\d+(\.\d+)?)"/g, '$1');

  console.log('After final fixes:', cleanContent);

  // Final attempt
  try {
    return JSON.parse(cleanContent);
  } catch (finalError: any) {
    console.error('All parsing attempts failed');
    console.error('Final error:', finalError);
    console.error('Final content:', cleanContent);
    throw new Error(`Failed to parse itinerary data: ${finalError.message}`);
  }
};



export async function POST(req: Request) {
  try {
    // Verify Groq API key
    if (!process.env.GROQ_API_KEY) {
      console.error('Groq API key not found');
      return NextResponse.json(
        { success: false, error: 'Groq API configuration error: Missing API key. Please configure GROQ_API_KEY in your .env.local file.' },
        { status: 500 }
      );
    }

    // Verify user authentication - optional, allow unauthenticated users
    const { userId } = auth();
    
    // Authentication is optional - allow users to generate itineraries without signing in
    // userId will be undefined if not signed in, which is fine for generating itineraries
    // Users can still use the service, but won't be able to save itineraries to their account

    // Parse and validate request data
    const requestData: ItineraryRequest = await req.json();
    if (!requestData.destination || !requestData.startDate || !requestData.endDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create an AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const completion: any = await getGroqChatCompletion([
          {
            role: "system",
            content: `You are a professional travel planner AI. Your task is to create detailed and realistic itineraries with SPECIFIC, REAL attractions and restaurants.  

CRITICAL REQUIREMENTS:  
1. You must use ONLY real, specific, and verifiable attractions, landmarks, and restaurants that exist in the chosen city/country.  
2. Never invent or use placeholders such as "Main Attraction", "Local Market", "Historical District", or "Cultural Experience".  
3. If no valid attractions are found, leave the itinerary shorter instead of using generic terms.  
4. For restaurants: choose real, popular places that are actually in the destination city.  
5. Each activity must be a specific, well-known landmark, attraction, or cultural site that tourists genuinely visit.  
6. Do not repeat the same attraction across multiple days unless it is a multi-day site.  
7. Never default to another city (e.g. Dubai) if the requested city is not known. Use only what is relevant to the actual destination.  

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
            content: `Create a detailed travel itinerary for ${requestData.destination} from ${requestData.startDate} to ${requestData.endDate} for ${requestData.travelGroup}.
${requestData.requirements?.length ? `Requirements: ${requestData.requirements.join(', ')}` : ''}
${requestData.budget ? `Budget: ${requestData.budget}` : ''}
${requestData.travelStyle ? `Travel Style: ${requestData.travelStyle}` : ''}
${requestData.activities?.length ? `Preferred Activities: ${requestData.activities.join(', ')}` : ''}

CRITICAL: Your response must be a single, valid JSON object. Do NOT use markdown formatting, code blocks, or any other formatting. Return pure JSON only. No comments, no explanations - just valid JSON.`
          }
      ]);

      clearTimeout(timeoutId);

      if (!completion || !completion.choices || completion.choices.length === 0 || !completion.choices[0]?.message?.content) {
        throw new Error('No content received from Groq API');
      }

      let itineraryData;
      try {
        itineraryData = JSON.parse(completion.choices[0].message.content);
      } catch (parseError) {
        console.error('Failed to parse Groq response:', completion.choices[0].message.content);
        throw new Error('Failed to parse itinerary data from Groq AI');
      }

      // Validate the parsed data structure
      if (!itineraryData || typeof itineraryData !== 'object') {
        console.error('Invalid data structure:', itineraryData);
        throw new Error('Invalid itinerary data structure');
      }

      // Validate required fields
      const requiredFields = ['destination', 'dates', 'headerImage', 'overview', 'airport', 'hotels', 'itineraries', 'transportation', 'estimatedCost'];
      const missingFields = requiredFields.filter(field => !(field in itineraryData));
      
      if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
        throw new Error(`Invalid itinerary data: missing required fields (${missingFields.join(', ')})`);
      }

      // Get real, accurate images for the destination - PARALLEL FETCHING
      const [headerImage, airportImage, airportPhotos] = await Promise.all([
        getDestinationHeaderImage(itineraryData.destination),
        getAirportImage(itineraryData.airport.name, itineraryData.destination),
        getAirportPhotos(itineraryData.airport.name, itineraryData.destination)
      ]);

      // Fix header image - validate and use Google Places Photos API if current image is invalid (map/placeholder)
      // Only replace if the current image is invalid (map, placeholder, default), otherwise keep it
      const currentHeaderImage = itineraryData.headerImage;
      // Validate header image - will replace if invalid (map, placeholder, default)
      itineraryData.headerImage = await validateAndFixHeaderImage(currentHeaderImage, itineraryData.destination);
      
      // If validation didn't find a better image (still using fallback), try the fetched headerImage
      // But only if the original was a placeholder/invalid
      if ((!currentHeaderImage || 
           currentHeaderImage === "URL to a representative image of the destination" || 
           currentHeaderImage === "placeholder") &&
          itineraryData.headerImage && 
          itineraryData.headerImage.includes('photo-1502602898536-47ad22581b52')) {
        // Only use the fetched headerImage if validation returned default fallback
        itineraryData.headerImage = headerImage;
      }

      // Fix airport image
      if (!itineraryData.airport.image || itineraryData.airport.image === "URL to airport image") {
        itineraryData.airport.image = airportImage;
      }

      // Add airport photos
      itineraryData.airport.photos = airportPhotos;

      // Hotels will be loaded separately by the AsyncHotelOffers component
      // Initialize with empty array - hotels will be loaded asynchronously
      itineraryData.hotels = [];

      // Fix activity images - PARALLEL PROCESSING
          if (itineraryData.itineraries && Array.isArray(itineraryData.itineraries)) {
      const itineraryPromises = itineraryData.itineraries.map(async (day: any) => {
        // Process morning activity
        if (day.morning && (!day.morning.image || day.morning.image === "Activity image URL")) {
          day.morning.image = await getActivityImage(day.morning.activity, itineraryData.destination);
        }
        
        // Process afternoon activity
        if (day.afternoon && (!day.afternoon.image || day.afternoon.image === "Activity image URL")) {
          day.afternoon.image = await getActivityImage(day.afternoon.activity, itineraryData.destination);
        }
        
        return day;
      });
      await Promise.all(itineraryPromises);
    }

      // Fix transportation icons
      if (itineraryData.transportation && Array.isArray(itineraryData.transportation)) {
        for (const transport of itineraryData.transportation) {
          const iconData = getTransportationIcon(transport.type);
          transport.icon = iconData.icon;
          transport.type = iconData.name; // Use the standardized name
        }
      }

      // Add eSIM section
      itineraryData.eSIM = {
        provider: "Airalo",
        description: "Get a global eSIM for seamless connectivity during your trip",
        link: generateESIMLink(itineraryData.destination),
        price: "$5-15"
      };

      // Try to save to Supabase, but only if user is authenticated
      let savedItineraryId = null;
      if (userId) {
        try {
          const supabase = getSupabaseClient();
          
          console.log('Attempting to save itinerary to Supabase:', {
            clerk_user_id: userId,
            destination: itineraryData.destination,
            start_date: itineraryData.dates.start,
            end_date: itineraryData.dates.end
          });

          const { data: savedItinerary, error: saveError } = await supabase
            .from('itineraries')
            .insert([{
              clerk_user_id: userId,
              created_at: new Date().toISOString(),
              data: itineraryData, // Store the entire itinerary as a JSON object
              destination: itineraryData.destination, // Store destination separately for easy querying
              start_date: itineraryData.dates.start, // Store dates separately for easy querying
              end_date: itineraryData.dates.end
            }])
            .select()
            .single();

          if (saveError) {
            console.error('Error saving itinerary:', {
              error: saveError,
              code: saveError.code,
              details: saveError.details,
              hint: saveError.hint,
              message: saveError.message
            });
            // Don't throw error, just log it and continue
            console.log('Continuing without saving to database');
          } else if (savedItinerary) {
            savedItineraryId = savedItinerary.id;
            console.log('Successfully saved itinerary:', savedItineraryId);
          }
        } catch (dbError) {
          console.error('Database connection error:', dbError);
          console.log('Continuing without saving to database');
        }
      } else {
        console.log('User not authenticated - skipping database save');
      }

    return NextResponse.json({
        success: true,
        itinerary: {
          id: savedItineraryId || `temp_${Date.now()}`,
          ...itineraryData
        },
        // Include the full itinerary data for immediate display
        fullItinerary: itineraryData
      });

    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out after 30 seconds');
      }
      throw error;
    }

  } catch (error: any) {
    console.error('API Route Error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { 
          details: error.stack,
          timestamp: new Date().toISOString()
        })
      },
      { status: error.name === 'AbortError' ? 408 : (error.status || 500) }
    );
  }
} 