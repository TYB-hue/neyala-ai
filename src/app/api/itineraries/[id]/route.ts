import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Handle temporary IDs (when Supabase is not available)
    if (id.startsWith('temp_')) {
      return NextResponse.json(
        { success: false, error: 'Temporary itinerary not found. Please regenerate your itinerary.' },
        { status: 404 }
      );
    }

    if (!id || !isValidUUID(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid itinerary ID' },
        { status: 400 }
      );
    }

    try {
      const supabase = getSupabaseClient();

    // Fetch the itinerary from Supabase
    const { data: itinerary, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('id', id)  // Supabase client handles UUID conversion
      .single();

    if (error) {
      console.error('Error fetching itinerary:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch itinerary' },
        { status: 500 }
      );
    }

    if (!itinerary) {
      return NextResponse.json(
        { success: false, error: 'Itinerary not found' },
        { status: 404 }
      );
    }

    // Format the data to match the expected structure
    const formattedItinerary = {
      ...itinerary.data, // Spread the stored JSON data which contains most of our fields
      destination: itinerary.destination,
      dates: {
        start: itinerary.start_date,
        end: itinerary.end_date
      }
    };

    return NextResponse.json(formattedItinerary);
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { success: false, error: 'Database connection failed. Please try regenerating your itinerary.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in itinerary route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// UUID validation function
function isValidUUID(uuid: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
} 