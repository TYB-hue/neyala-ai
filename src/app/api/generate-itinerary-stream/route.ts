import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { getDestinationHeaderImage, getAirportImage, getActivityImage, generateESIMLink } from '@/lib/unsplash';
import { getTransportationIcon } from '@/lib/transportation-icons';
import { getGroqChatCompletion } from '@/lib/groq';
import { searchHotels, getHotelImage } from '@/lib/booking';

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
    // Allow unauthenticated users for testing, but log it
    if (!userId) {
      console.log('Warning: Unauthenticated user attempting to generate itinerary');
    }

    const requestData: ItineraryRequest = await req.json();

    // Create a ReadableStream for real-time updates
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial status
          controller.enqueue(new TextEncoder().encode('data: {"status": "started", "message": "Starting itinerary generation..."}\n\n'));

          // Generate itinerary with DeepSeek
          controller.enqueue(new TextEncoder().encode('data: {"status": "generating", "message": "Creating your personalized itinerary..."}\n\n'));

          const completion = await getGroqChatCompletion([
            {
              role: "system",
              content: `You are an expert travel planner. Create detailed, realistic travel itineraries in JSON format. 
              The response must be valid JSON only - no markdown, no explanations, no extra text.
              Include specific details like hotel names, activity descriptions, and realistic costs.
              Use this exact JSON structure:
              {
                "destination": "City, Country",
                "dates": {"start": "YYYY-MM-DD", "end": "YYYY-MM-DD"},
                "headerImage": "URL",
                "overview": {"history": "text", "culture": "text"},
                "airport": {"name": "Airport Name", "image": "URL", "info": "text"},
                "hotels": [{"name": "Hotel Name", "image": "URL", "rating": 4.5, "price": 150, "link": "URL", "location": {"lat": 0, "lng": 0}}],
                "activities": [{"name": "Activity", "description": "text", "image": "URL", "day": 1, "time": "09:00", "location": {"lat": 0, "lng": 0}}],
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
              
              Respond with ONLY valid JSON.`
            }
          ]);

          if (!completion.choices[0]?.message?.content) {
            throw new Error('No content received from DeepSeek API');
          }

          let itineraryData;
          try {
            itineraryData = JSON.parse(completion.choices[0].message.content);
          } catch (parseError) {
            throw new Error('Failed to parse itinerary data from DeepSeek');
          }

          // Send status update
          controller.enqueue(new TextEncoder().encode('data: {"status": "processing", "message": "Enhancing with high-quality images..."}\n\n'));

          // Parallel image fetching for speed
          const [headerImage, airportImage] = await Promise.all([
            getDestinationHeaderImage(itineraryData.destination),
            getAirportImage(itineraryData.airport.name)
          ]);

          itineraryData.headerImage = headerImage;
          itineraryData.airport.image = airportImage;

          // Process hotels with real booking data
          const hotelSearchParams = {
            location: requestData.destination,
            checkIn: requestData.startDate,
            checkOut: requestData.endDate,
            adults: 1,
            rooms: 1
          };

          const realHotels = await searchHotels(hotelSearchParams);
          
          // Always use real hotels if available, otherwise create a fallback
          if (realHotels.length > 0) {
            console.log('Using real hotels from RapidAPI:', realHotels.length);
            itineraryData.hotels = realHotels;
          } else {
            console.log('No real hotels found, creating fallback hotels');
            // Create fallback hotels with better variety
            itineraryData.hotels = [
              {
                id: 'fallback_1',
                name: `Premium Hotel in ${itineraryData.destination}`,
                image: await getHotelImage(`Premium Hotel ${itineraryData.destination}`, itineraryData.destination),
                rating: 4.5,
                price: 180,
                currency: 'USD',
                stars: 4,
                location: { lat: 0, lng: 0 },
                amenities: ['WiFi', 'Spa', 'Restaurant', 'Pool'],
                description: `Luxury accommodation in ${itineraryData.destination}`,
                bookingUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(`Premium Hotel ${itineraryData.destination}`)}&aid=1234567&utm_source=neyalaAI&utm_medium=travel_planner&selected_currency=USD&nflt=review_score%3D80`
              },
              {
                id: 'fallback_2',
                name: `Comfort Inn ${itineraryData.destination}`,
                image: await getHotelImage(`Comfort Inn ${itineraryData.destination}`, itineraryData.destination),
                rating: 4.2,
                price: 120,
                currency: 'USD',
                stars: 3,
                location: { lat: 0, lng: 0 },
                amenities: ['WiFi', 'Breakfast', 'Parking'],
                description: `Comfortable mid-range hotel in ${itineraryData.destination}`,
                bookingUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(`Comfort Inn ${itineraryData.destination}`)}&aid=1234567&utm_source=neyalaAI&utm_medium=travel_planner&selected_currency=USD&nflt=review_score%3D80`
              },
              {
                id: 'fallback_3',
                name: `Budget Hostel ${itineraryData.destination}`,
                image: await getHotelImage(`Hostel ${itineraryData.destination}`, itineraryData.destination),
                rating: 3.8,
                price: 45,
                currency: 'USD',
                stars: 2,
                location: { lat: 0, lng: 0 },
                amenities: ['WiFi', 'Kitchen', 'Common Room'],
                description: `Affordable hostel accommodation in ${itineraryData.destination}`,
                bookingUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(`Hostel ${itineraryData.destination}`)}&aid=1234567&utm_source=neyalaAI&utm_medium=travel_planner&selected_currency=USD&nflt=review_score%3D80`
              }
            ];
          }

          if (itineraryData.activities && Array.isArray(itineraryData.activities)) {
            const activityPromises = itineraryData.activities.map(async (activity: any) => {
              activity.image = await getActivityImage(activity.name);
              return activity;
            });
            await Promise.all(activityPromises);
          }

          // Process transportation icons
          if (itineraryData.transportation && Array.isArray(itineraryData.transportation)) {
            for (const transport of itineraryData.transportation) {
              const iconData = getTransportationIcon(transport.type);
              transport.icon = iconData.icon;
              transport.type = iconData.name;
            }
          }

          // Add eSIM section
          itineraryData.eSIM = {
            provider: "Airalo",
            description: "Get a global eSIM for seamless connectivity during your trip",
            link: generateESIMLink(itineraryData.destination),
            price: "$5-15"
          };

          // Send final result
          controller.enqueue(new TextEncoder().encode(`data: {"status": "completed", "data": ${JSON.stringify(itineraryData)}}\n\n`));
          controller.close();

        } catch (error: any) {
          controller.enqueue(new TextEncoder().encode(`data: {"status": "error", "error": "${error.message}"}\n\n`));
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

  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
} 