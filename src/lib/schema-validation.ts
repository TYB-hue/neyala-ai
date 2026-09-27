import { z } from "zod";

const LocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

const ItineraryDaySchema = z.object({
  day: z.number().int().positive(),
  date: z.string(), // ISO date
  title: z.string(),
  morning: z.object({
    activity: z.string(),
    description: z.string(),
    time: z.string(),
    location: LocationSchema.optional(),
  }),
  afternoon: z.object({
    activity: z.string(),
    description: z.string(),
    time: z.string(),
    location: LocationSchema.optional(),
  }),
  restaurant: z.object({
    name: z.string(),
    cuisine: z.string(),
    description: z.string(),
    location: LocationSchema.optional(),
  }),
});

const OutputSchema = z.object({
  destination: z.string(),
  dates: z.object({ start: z.string(), end: z.string() }),
  overview: z.object({ history: z.string(), culture: z.string() }),
  airport: z.object({ name: z.string(), info: z.string() }),
  hotels: z.array(z.object({
    name: z.string(),
    rating: z.number().nonnegative(),
    price: z.number().nonnegative(),
    link: z.string().url(), // Only URLs allowed here
    location: LocationSchema.optional(),
  })),
  itineraries: z.array(ItineraryDaySchema).min(1),
  transportation: z.array(z.object({ type: z.string(), description: z.string() })),
  estimatedCost: z.object({
    accommodation: z.number().nonnegative(),
    activities: z.number().nonnegative(),
    transportation: z.number().nonnegative(),
    food: z.number().nonnegative(),
    total: z.number().nonnegative(),
  }),
}).strict(); // Prevents any additional keys (like headerImage or images...)

const FORBIDDEN_URL_RE = /(https?:\/\/)?(upload\.wikimedia\.org|images\.unsplash\.com|images\.pexels\.com)/i;

function sanitizeUnknownUrls(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sanitizeUnknownUrls);
  if (obj && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      // Remove forbidden image-related fields completely
      if (k === 'headerImage' || k === 'image' || k === 'icon' || k === 'photos') {
        continue; // Skip these fields entirely
      }
      out[k] = sanitizeUnknownUrls(v);
    }
    return out;
  }
  if (typeof obj === "string") {
    // Forbidden any URL in text fields — except hotels[].link which schema allows
    if (FORBIDDEN_URL_RE.test(obj)) return "";
  }
  return obj;
}

export function parseGroqJson(raw: string) {
  // Extract first { to last } to remove any text around JSON
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Invalid JSON boundaries");
  }
  const sliced = raw.slice(start, end + 1);

  const data = JSON.parse(sliced);
  
  const sanitized = sanitizeUnknownUrls(data);
  
  // Schema will reject any additional keys or URLs in unauthorized places
  try {
    const result = OutputSchema.parse(sanitized);
    return result;
  } catch (error) {
    throw error;
  }
}

export function makePlaceId(name: string, address: string): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crypto = require("crypto");
  return crypto.createHash("sha256").update(`${name}|${address}`.toLowerCase().trim()).digest("hex");
}
