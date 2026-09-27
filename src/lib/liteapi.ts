import { ApiError } from './api-response';

export function normalizeLiteRates(payload: any) {
  const metadata = new Map((payload.hotels || []).map((h: any) => [h.id, h]));
  return (payload.data || []).flatMap((entry: any) => {
    const hotel: any = metadata.get(entry.hotelId);
    const offers = (entry.roomTypes || []).filter((o: any) => Number.isFinite(o.offerRetailRate?.amount) && o.offerRetailRate.amount > 0 && o.offerRetailRate.currency === 'USD' && o.rateType !== 'package')
      .sort((a: any, b: any) => a.offerRetailRate.amount - b.offerRetailRate.amount);
    const offer = offers[0];
    if (!hotel || !offer) return [];
    const rate = offer.rates?.[0];
    const fees = (rate?.retailRate?.taxesAndFees || []).filter((f: any) => !f.included);
    return [{ id: entry.hotelId, name: hotel.name, price: offer.offerRetailRate.amount, totalPrice: offer.offerRetailRate.amount,
      currency: offer.offerRetailRate.currency, rating: hotel.rating || 0, stars: hotel.stars || 0,
      images: hotel.main_photo ? [hotel.main_photo] : [], location: { lat: hotel.latitude, lng: hotel.longitude },
      amenities: [], description: [rate?.name, rate?.boardName, rate?.cancellationPolicies?.refundableTag === 'NRFN' ? 'Non-refundable' : null].filter(Boolean).join(' · '),
      taxNote: fees.length ? fees.map((f: any) => `${f.description}: ${f.amount} ${f.currency} extra`).join('; ') : 'Review all taxes and conditions before booking.',
      bookingUrl: '', source: 'LiteAPI', sandbox: payload.sandbox === true, scrapedAt: new Date().toISOString() }];
  });
}
export async function searchLiteHotels(input: {destination: string; startDate: string; endDate: string; adults: number; guestNationality: string}) {
  const key = process.env.LITEAPI_API_KEY;
  if (!key) throw new ApiError(503, 'HOTEL_PROVIDER_MISSING', 'Hotel search is not configured.');
  if (!key.startsWith('prod_')) throw new ApiError(503, 'HOTEL_PRODUCTION_REQUIRED', 'Live hotel prices are not connected yet. Search your dates on Booking.com below.');
  const nationality = input.guestNationality || process.env.LITEAPI_GUEST_NATIONALITY;
  if (!nationality || !/^[A-Z]{2}$/.test(nationality)) throw new ApiError(400, 'HOTEL_NATIONALITY_REQUIRED', 'Guest nationality is needed to quote accurate rates. You can still search your dates on Booking.com below.');
  let response: Response;
  try {
    response = await fetch('https://api.liteapi.travel/v3.0/hotels/rates', {
      method: 'POST', cache: 'no-store', signal: AbortSignal.timeout(20000),
      headers: { 'X-API-Key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ aiSearch: `Hotels in ${input.destination}`, checkin: input.startDate, checkout: input.endDate,
        currency: 'USD', guestNationality: nationality, occupancies: [{ adults: input.adults }],
        limit: 10, maxRatesPerHotel: 5, includeHotelData: true, timeout: 8 }),
    });
  } catch { throw new ApiError(504, 'HOTEL_TIMEOUT', 'Hotel search timed out. Please try again.'); }
  if (response.status === 204) return {hotels: [], sandbox: /^(sand_|sandbox_)/.test(key)};
  if (!response.ok) throw new ApiError(503, 'HOTEL_PROVIDER_ERROR', response.status === 401 || response.status === 403 ? 'The hotel provider rejected the configured key. Check the account and API key.' : 'The hotel provider could not complete this search. Please try again.');
  const data = await response.json();
  if (data.error || !Array.isArray(data.data)) throw new ApiError(503, 'HOTEL_PROVIDER_ERROR', 'The hotel provider returned an invalid response.');
  if (data.sandbox === true) throw new ApiError(503, 'HOTEL_PRODUCTION_REQUIRED', 'Live hotel prices are not connected yet. Test rates are not displayed.');
  return {hotels: normalizeLiteRates(data), sandbox: data.sandbox === true || /^(sand_|sandbox_)/.test(key)};
}
