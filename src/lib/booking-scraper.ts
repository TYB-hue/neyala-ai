import { execFile } from 'child_process';
import { promisify } from 'util';
import { ApiError } from './api-response';

const execFileAsync = promisify(execFile);

export interface BookingScraperOptions {
  destination: string;
  startDate?: string;
  endDate?: string;
  travelGroup?: string;
  maxHotels?: number;
  useScraperApi?: boolean;
}

export interface BookingHotelData {
  id: string;
  name: string;
  price: number;
  currency: string;
  rating: number;
  stars: number;
  reviewCount: number;
  avgReview: string;
  images: string[];
  bookingUrl: string;
  address: string;
  location: { lat: number; lng: number };
  amenities: string[];
  description: string;
  scrapedAt: string;
  source: string;
}

export async function searchHotelsWithBooking(options: BookingScraperOptions): Promise<BookingHotelData[]> {
  if (process.env.ENABLE_HOTEL_SCRAPING === 'false') return [];
  const { destination, startDate = '', endDate = '', travelGroup = '', maxHotels = 10 } = options;
  try {
    const { stdout } = await execFileAsync(process.execPath, [
      'scripts/hotel_scraper_booking.js', destination, String(Math.min(maxHotels, 10)),
      'true', String(!!process.env.SCRAPER_API_KEY), startDate, endDate, travelGroup,
    ], { timeout: 27000, maxBuffer: 2 * 1024 * 1024, env: { ...process.env, BOOKING_WRITE_CACHE: 'false' } });
    const line = stdout.trim().split('\n').reverse().find(line => line.startsWith('['));
    if (!line) return [];
    const data: BookingHotelData[] = JSON.parse(line);
    return Array.isArray(data) ? data.filter(h => h && typeof h.name === 'string' && /^https:\/\//.test(h.bookingUrl || '') && !/fallback|generated/i.test(h.source || '')).slice(0, 10) : [];
  } catch (error) {
    const blocked = /BOOKING_BLOCKED/.test(String((error as { stderr?: string }).stderr || ''));
    throw new ApiError(503, blocked ? 'HOTEL_SEARCH_BLOCKED' : 'HOTEL_SEARCH_UNAVAILABLE', blocked ? 'Booking.com is asking for a browser verification. Open the search directly to see current offers.' : 'Booking.com could not return live offers. Open the search directly to check prices and availability.');
  }
}

