// Lightweight Viator API client (Affiliate/Partner API v2)
// Requires env var VIATOR_API_KEY

const API_HOSTS = [
  'https://api.viator.com/partner',
  'https://api.sandbox.viator.com/partner'
];

interface ViatorAttraction {
  id?: string;
  attractionId?: string;
  name?: string;
  country?: string;
  countryCode?: string;
  destination?: string;
  destinationId?: string | number;
  destinationSlug?: string;
  canonicalUrl?: string;
  webUrl?: string;
  url?: string;
}

export async function viatorSearchAttractions(query: string): Promise<ViatorAttraction[] | null> {
  const apiKey = process.env.VIATOR_API_KEY;
  if (!apiKey) return null;

  const headers: Record<string, string> = {
    'exp-api-key': apiKey,
    'Accept': 'application/json;version=2.0',
    'Accept-Language': 'en-US'
  };

  for (const host of API_HOSTS) {
    try {
      const url = `${host}/attractions/search?q=${encodeURIComponent(query)}`;
      const res = await fetch(url, { headers, cache: 'no-store' } as any);
      if (!res.ok) continue;
      const data = await res.json().catch(() => null);
      const items = data?.results || data?.data || data;
      if (Array.isArray(items)) return items as ViatorAttraction[];
    } catch {
      // try next host
    }
  }
  return null;
}

export function buildViatorAttractionUrl(a: ViatorAttraction): string | null {
  const url = a.canonicalUrl || a.webUrl || a.url || null;
  return url || null;
}





