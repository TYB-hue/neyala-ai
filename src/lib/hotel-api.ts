import { z } from 'zod';
import { NextResponse } from 'next/server';
import { apiError, readJson } from './api-response';
import { searchLiteHotels } from './liteapi';
import { dateOnly } from './itinerary-request';
const hotelSchema = z.object({
  destination: z.string().trim().min(2).max(200),
  startDate: dateOnly, endDate: dateOnly,
  adults: z.number().int().min(1).max(6).default(2),
  guestNationality: z.string().regex(/^[A-Z]{2}$/).or(z.literal('')).optional(),
  travelGroup: z.string().max(100).optional(),
}).refine(v => (!v.startDate && !v.endDate) || (!!v.startDate && !!v.endDate && v.endDate > v.startDate), 'Supply check-in and check-out dates in chronological order');
export async function hotelResponse(request: Request) {
  try {
    const raw = request.method === 'GET' ? Object.fromEntries(new URL(request.url).searchParams) : await readJson(request, z.object({}).passthrough());
    const input = hotelSchema.parse({ ...raw, destination: raw.destination || raw.location, startDate: raw.startDate || raw.checkInDate, endDate: raw.endDate || raw.checkOutDate });
    const { hotels, sandbox } = await searchLiteHotels({ ...input, guestNationality: input.guestNationality || '' });
    return NextResponse.json({ success: true, hotels, count: hotels.length, source: 'LiteAPI', sandbox, availabilityVerified: !sandbox, message: sandbox ? 'Sandbox test rates — no real reservations.' : 'Rates may change. Booking is not yet enabled.' }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return apiError(error); }
}
