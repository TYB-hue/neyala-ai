import { NextRequest, NextResponse } from 'next/server';
import { searchHotels } from '@/lib/expedia';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location') || 'Tokyo, Japan';
    
    console.log(`API: Searching hotels for location: ${location}`);
    console.log('Using Expedia scraper for hotel search');
    
    // Use the Expedia-based hotel search
    const hotels = await searchHotels({ 
      location,
      checkIn: '2024-11-16',
      checkOut: '2024-11-20'
    });
    
    return NextResponse.json({
      success: true,
      location,
      hotels,
      count: hotels.length,
      message: `Found ${hotels.length} hotels for ${location}`
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch hotels',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { location, checkInDate, checkOutDate } = body;
    
    if (!location) {
      return NextResponse.json(
        { success: false, error: 'Location is required' },
        { status: 400 }
      );
    }
    
    console.log(`API: Searching hotels for location: ${location}`);
    
    const hotels = await searchHotels({ 
      location,
      checkIn: checkInDate || '2024-11-16',
      checkOut: checkOutDate || '2024-11-20'
    });
    
    return NextResponse.json({
      success: true,
      location,
      hotels,
      count: hotels.length,
      message: `Found ${hotels.length} hotels for ${location}`
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch hotels',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
