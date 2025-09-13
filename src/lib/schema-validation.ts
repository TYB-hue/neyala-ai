import { z } from "zod";

const LocationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

const ItineraryDaySchema = z.object({
  day: z.number().int().positive(),
  date: z.string(), // ISO date
  title: z.string(),
  morning: z.object({
    activity: z.string(),
    description: z.string(),
    time: z.string(),
    location: LocationSchema,
  }),
  afternoon: z.object({
    activity: z.string(),
    description: z.string(),
    time: z.string(),
    location: LocationSchema,
  }),
  restaurant: z.object({
    name: z.string(),
    cuisine: z.string(),
    description: z.string(),
    location: LocationSchema,
  }),
});

const OutputSchema = z.object({
  destination: z.string(),
  dates: z.object({ start: z.string(), end: z.string() }),
  overview: z.object({ history: z.string(), culture: z.string() }),
  airport: z.object({ name: z.string(), info: z.string() }),
  hotels: z.array(z.object({
    name: z.string(),
    rating: z.number(),
    price: z.number(),
    link: z.string().url(), // Only URLs allowed here
    location: LocationSchema,
  })),
  itineraries: z.array(ItineraryDaySchema).min(1),
  transportation: z.array(z.object({ type: z.string(), description: z.string() })),
  estimatedCost: z.object({
    accommodation: z.number(),
    activities: z.number(),
    transportation: z.number(),
    food: z.number(),
    total: z.number(),
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
    if (/https?:\/\//i.test(obj) || FORBIDDEN_URL_RE.test(obj)) return "";
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
  console.log('Raw parsed data keys:', Object.keys(data));
  
  const sanitized = sanitizeUnknownUrls(data);
  console.log('Sanitized data keys:', Object.keys(sanitized));
  
  // Schema will reject any additional keys or URLs in unauthorized places
  try {
    const result = OutputSchema.parse(sanitized);
    console.log('Schema validation passed');
    return result;
  } catch (error) {
    console.error('Schema validation failed:', error);
    throw error;
  }
}

export function makePlaceId(name: string, address: string): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crypto = require("crypto");
  return crypto.createHash("sha256").update(`${name}|${address}`.toLowerCase().trim()).digest("hex");
}
