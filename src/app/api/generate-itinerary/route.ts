import { NextResponse } from 'next/server';
import { apiError, readJson } from '@/lib/api-response';
import { itineraryRequestSchema } from '@/lib/itinerary-request';
import { generateItinerary } from '@/lib/itinerary-service';
export async function POST(request: Request) {
  try {
    const input = await readJson(request, itineraryRequestSchema);
    const itinerary = await generateItinerary(input, request.signal);
    return NextResponse.json({ success: true, itinerary, fullItinerary: itinerary }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return apiError(error); }
}
