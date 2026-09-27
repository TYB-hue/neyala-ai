import { z } from 'zod';
import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { apiError, readJson } from './api-response';
import { dateOnly } from './itinerary-request';
const text = z.string().trim().min(1).max(200);
const optionalText = z.string().trim().max(200).optional();
const httpUrl = z.string().url().max(2048).refine(value => /^https?:\/\//.test(value), 'Use an HTTP(S) URL');
const savedItinerary = z.object({ destination: text, dates: z.object({ start: dateOnly, end: dateOnly }), itineraries: z.array(z.object({ date: dateOnly }).passthrough()).min(1).max(14) }).passthrough();
export const bodySchemas = {
  contact: z.object({ firstName: text, lastName: text, email: z.string().email().max(254), phone: optionalText, company: optionalText, subject: text, message: z.string().trim().min(1).max(10000) }),
  review: z.object({ placeName: text, placeType: text, rating: z.number().int().min(1).max(5), comment: z.string().max(5000).optional(), address: optionalText }),
  favorite: z.object({ itemId: optionalText.nullable(), name: text, location: text, description: z.string().max(2000).optional().nullable(), imageUrl: httpUrl, meta: z.unknown().optional(), userId: optionalText }),
  save: z.object({ title: optionalText, itineraryData: savedItinerary }),
  trip: z.object({ itinerary: savedItinerary }),
  collection: z.object({ attractionId: text, attractionData: z.object({ name: text, type: text, location: text, description: z.string().max(2000).optional(), image: httpUrl.optional(), rating: z.number().min(0).max(10).optional(), priceRange: optionalText, category: optionalText }) }),
  user: z.object({ firstName: optionalText, lastName: optionalText, username: optionalText }).refine(v => Object.values(v).some(x => x !== undefined), 'Supply at least one profile field'),
  esim: z.object({ action: z.enum(['click','copy','view']), destination: optionalText, planId: optionalText, userAgent: z.string().max(500).optional(), referer: z.string().max(2048).optional() }),
  hotelDetails: z.object({ hotelName: text, destination: text }),
};
export function withBodyValidation(handler: (request: NextRequest) => Promise<Response>, schema: z.ZodTypeAny, authenticated = false) {
  return async (request: NextRequest) => {
    try {
      if (authenticated && !auth().userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      await readJson(request.clone(), schema);
      return await handler(request);
    } catch (error) { return apiError(error); }
  };
}
