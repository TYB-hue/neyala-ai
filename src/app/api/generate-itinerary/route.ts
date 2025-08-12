import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { auth } from '@clerk/nextjs';
import { getDestinationHeaderImage, getAirportImage, getActivityImage, generateESIMLink } from '@/lib/unsplash';
import { getTransportationIcon } from '@/lib/transportation-icons';
import { getGroqChatCompletion } from '@/lib/groq';
import { searchHotels, getHotelImage } from '@/lib/booking';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

// Debug logging
console.log('Environment check:', {
  hasDeepSeekKey: !!process.env.DEEPSEEK_API_KEY,
  hasServerRuntimeDeepSeekKey: !!serverRuntimeConfig?.DEEPSEEK_API_KEY,
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

interface DeepSeekMessage {
  role: string;
  content: string;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// Constants
const API_TIMEOUT = 15000; // Reduced to 15 seconds for faster response
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

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

if (!DEEPSEEK_API_KEY) {
  throw new Error(
    'DEEPSEEK_API_KEY is not defined in environment variables. ' +
    'Please add it to your .env.local file'
  );
}

export async function POST(req: Request) {
  try {
    // Verify Groq API key
    if (!process.env.GROQ_API_KEY) {
      console.error('Groq API key not found');
      return NextResponse.json(
        { success: false, error: 'Groq API configuration error: Missing API key' },
        { status: 500 }
      );
    }

    // Verify user authentication
    const { userId } = auth();
    // Allow unauthenticated users for testing, but log it
    if (!userId) {
      console.log('Warning: Unauthenticated user attempting to generate itinerary');
    }

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
      const completion = await getGroqChatCompletion([
        {
          role: "system",
          content: `You are a travel planner that provides detailed, accurate travel itineraries. Follow these rules strictly:
1. Return ONLY a valid JSON object
2. Use double quotes for ALL property names and string values
3. Do not include any markdown formatting, comments, or explanations
4. Do not use trailing commas
5. Do not include any special characters or control characters
6. Ensure all numbers are valid (no NaN or Infinity)
7. Use proper JSON boolean values (true/false, not True/False)
8. Ensure all arrays and objects are properly closed
9. Do not include any line breaks in string values
10. Properly escape any quotes that appear within string values using backslash
11. Do not nest quotes without proper escaping
12. Do not include any formatting or indentation
13. The response should be a single line of valid JSON
14. All string values must be properly terminated

The JSON structure must be:
{
  "destination": "City, Country",
  "dates": {
    "start": "YYYY-MM-DD",
    "end": "YYYY-MM-DD"
  },
  "headerImage": "URL to a representative image of the destination",
  "overview": {
    "history": "Brief history of the destination",
    "culture": "Cultural highlights and important customs"
  },
  "airport": {
    "name": "Main arrival airport name",
    "image": "URL to airport image",
    "info": "Important arrival information"
  },
  "hotels": [
    {
      "name": "Hotel name",
      "image": "Hotel image URL",
      "rating": 4.5,
      "price": 150,
      "link": "Booking URL",
      "location": {
        "lat": 35.6762,
        "lng": 139.6503
      }
    }
  ],
  "activities": [
    {
      "name": "Activity name",
      "description": "Detailed description",
      "image": "Activity image URL",
      "day": 1,
      "time": "09:00",
      "location": {
        "lat": 35.6762,
        "lng": 139.6503
      }
    }
  ],
  "transportation": [
    {
      "type": "Metro",
      "description": "Metro system details",
      "icon": "URL to transportation icon"
    }
  ],
  "estimatedCost": {
    "accommodation": 500,
    "activities": 300,
    "transportation": 100,
    "food": 200,
    "total": 1100
  }
}`
        },
        {
          role: "user",
          content: `Create a detailed travel itinerary for ${requestData.destination} from ${requestData.startDate} to ${requestData.endDate} for ${requestData.travelGroup}.
${requestData.requirements?.length ? `Requirements: ${requestData.requirements.join(', ')}` : ''}
${requestData.budget ? `Budget: ${requestData.budget}` : ''}
${requestData.travelStyle ? `Travel Style: ${requestData.travelStyle}` : ''}
${requestData.activities?.length ? `Preferred Activities: ${requestData.activities.join(', ')}` : ''}

IMPORTANT: Your response must be a single, valid JSON object. No markdown, no comments, no explanations - just pure, escaped JSON in a single line.`
        }
      ]);

      clearTimeout(timeoutId);

      if (!completion.choices[0]?.message?.content) {
        throw new Error('No content received from DeepSeek API');
      }

      let itineraryData;
      try {
        itineraryData = JSON.parse(completion.choices[0].message.content);
      } catch (parseError) {
        console.error('Failed to parse DeepSeek response:', completion.choices[0].message.content);
        throw new Error('Failed to parse itinerary data from DeepSeek');
      }

      // Validate the parsed data structure
      if (!itineraryData || typeof itineraryData !== 'object') {
        console.error('Invalid data structure:', itineraryData);
        throw new Error('Invalid itinerary data structure');
      }

      // Validate required fields
      const requiredFields = ['destination', 'dates', 'headerImage', 'overview', 'airport', 'hotels', 'activities', 'transportation', 'estimatedCost'];
      const missingFields = requiredFields.filter(field => !(field in itineraryData));
      
      if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
        throw new Error(`Invalid itinerary data: missing required fields (${missingFields.join(', ')})`);
      }

      // Get real, accurate images for the destination - PARALLEL FETCHING
      const [headerImage, airportImage] = await Promise.all([
        getDestinationHeaderImage(itineraryData.destination),
        getAirportImage(itineraryData.airport.name)
      ]);

      // Fix header image
      if (!itineraryData.headerImage || itineraryData.headerImage === "URL to a representative image of the destination") {
        itineraryData.headerImage = headerImage;
      }

      // Fix airport image
      if (!itineraryData.airport.image || itineraryData.airport.image === "URL to airport image") {
        itineraryData.airport.image = airportImage;
      }

      // Process hotels with real booking data
      const hotelSearchParams = {
        location: requestData.destination,
        checkIn: requestData.startDate,
        checkOut: requestData.endDate,
        adults: 1,
        rooms: 1
      };

      const realHotels = await searchHotels(hotelSearchParams);
      
      // If we have real hotels, use them; otherwise use AI-generated ones
      if (realHotels.length > 0) {
        itineraryData.hotels = realHotels;
      } else if (itineraryData.hotels && Array.isArray(itineraryData.hotels)) {
        const hotelPromises = itineraryData.hotels.map(async (hotel: any) => {
          if (!hotel.image || hotel.image === "Hotel image URL") {
            hotel.image = await getHotelImage(hotel.name, itineraryData.destination);
          }
          // Add affiliate link if not present
          if (!hotel.link || hotel.link === "Booking URL") {
                            hotel.link = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.name + ' ' + itineraryData.destination)}&aid=1234567&utm_source=neyalaAI&utm_medium=travel_planner&selected_currency=USD&nflt=review_score%3D80`;
          }
          return hotel;
        });
        await Promise.all(hotelPromises);
      }

      // Fix activity images - PARALLEL PROCESSING
      if (itineraryData.activities && Array.isArray(itineraryData.activities)) {
        const activityPromises = itineraryData.activities.map(async (activity: any) => {
          if (!activity.image || activity.image === "Activity image URL") {
            activity.image = await getActivityImage(activity.name);
          }
          return activity;
        });
        await Promise.all(activityPromises);
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

      // Try to save to Supabase, but don't fail if it doesn't work
      let savedItineraryId = null;
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