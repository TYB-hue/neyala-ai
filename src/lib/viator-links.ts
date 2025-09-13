// Viator affiliate link generator
// This generates affiliate links for attractions based on destination and attraction name

interface ViatorLinkParams {
  destination: string;
  attractionName: string;
  pid?: string;
  mcid?: string;
  medium?: string;
}

function sanitizeUrl(url: string): string {
  if (!url) return '';
  // Trim whitespace and common accidental prefixes like ':', '@', or ':@'
  const trimmed = url.trim().replace(/^[:@]+/, '');
  // If it already starts with http(s), keep as is
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // If it looks like a viator path without protocol, prepend https
  if (/^www\.|^viator\.com\//i.test(trimmed)) {
    return `https://${trimmed.replace(/^www\./i, '')}`;
  }
  return trimmed;
}

function buildQuery(params: Record<string, string | undefined>): string {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) sp.set(key, value);
  });
  return sp.toString();
}

export function generateViatorLink({
  destination,
  attractionName,
  pid = 'P00266583',
  mcid = '42383',
  medium = 'link'
}: ViatorLinkParams): string {
  // Pass-through if a full Viator tour URL is provided in attractionName
  const maybeUrl = attractionName.trim();
  if (/viator\.com\//i.test(maybeUrl)) {
    const normalized = sanitizeUrl(maybeUrl);
    try {
      const url = new URL(normalized);
      // Preserve existing query params and append affiliate params
      const qp = buildQuery({ pid, mcid, medium });
      if (qp) {
        qp.split('&').forEach(pair => {
          const [k, v] = pair.split('=');
          if (k && v) url.searchParams.set(k, decodeURIComponent(v));
        });
      }
      return url.toString();
    } catch {
      // fall back to search if malformed
    }
  }

  // Build a destination-scoped search using both attraction and destination as the keyword
  const keyword = [attractionName.trim(), destination.trim()]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  // If no keyword, fallback to homepage with affiliate params (avoid "all")
  if (!keyword) {
    const home = new URL('https://www.viator.com/');
    const qp = buildQuery({ pid, mcid, medium });
    qp.split('&').forEach(pair => {
      const [k, v] = pair.split('=');
      if (k && v) home.searchParams.set(k, decodeURIComponent(v));
    });
    return home.toString();
  }

  // Viator search respects `text` on searchResults/all; avoid the generic "all" route
  const baseUrl = 'https://www.viator.com/searchResults/all';
  const query = buildQuery({ text: keyword, pid, mcid, medium });
  return `${baseUrl}?${query}`;
}

// Alternative function for destination-specific pages
export function generateViatorDestinationLink({
  destination,
  pid = 'P00266583',
  mcid = '42383',
  medium = 'link'
}: Omit<ViatorLinkParams, 'attractionName'>): string {
  const cleanDestination = destination.trim();
  
  // Generate destination-specific URL
  const baseUrl = 'https://www.viator.com';
  const qp = buildQuery({ pid, mcid, medium });
  return `${baseUrl}/${cleanDestination}/d334-ttd?${qp}`;
}

// Helper function to get the most relevant link type
export function getViatorLink(destination: string, attractionName: string): string {
  const url = generateViatorLink({ destination, attractionName });
  return sanitizeUrl(url);
}

// Server-side: Resolve a precise Viator URL via unofficial autocomplete endpoints
export async function resolveViatorUrl({
  attractionName,
  country,
  destination,
  pid = 'P00266583',
  mcid = '42383',
  medium = 'link'
}: {
  attractionName: string;
  country?: string;
  destination?: string;
  pid?: string;
  mcid?: string;
  medium?: string;
}): Promise<string | null> {
  try {
    // Endpoint observed from site traffic; may change without notice
    const keyword = `${attractionName} ${destination || ''}`.trim();
    const query = buildQuery({ q: keyword });
    const url = `https://www.viator.com/api/v1/search/autocomplete?${query}`;
    const res = await fetch(url, {
      headers: {
        'accept': 'application/json, text/plain, */*'
      },
      // Avoid caching to keep results fresh
      cache: 'no-store'
    } as any);
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    if (!data || !Array.isArray(data.results || data)) return null;
    const items: any[] = data.results || data;

    // Prefer place-type items matching country if provided
    const normalizedCountry = (country || '').trim().toLowerCase();
    let best = items.find(i => (i.type === 'Place' || i.type === 'place') && i.country?.toLowerCase() === normalizedCountry);
    if (!best && normalizedCountry) {
      best = items.find(i => (i.countryName || i.country)?.toLowerCase() === normalizedCountry);
    }
    if (!best) {
      // Fallback: first item
      best = items[0];
    }
    if (!best) return null;

    // Build canonical URL if provided, else construct from slug
    let target: string | null = best.url || best.canonicalUrl || null;
    if (!target && best.slug && best.destinationSlug) {
      target = `https://www.viator.com/${best.destinationSlug}/d${best.destinationId || '0'}-${best.slug}`;
    }
    if (!target && best.slug) {
      target = `https://www.viator.com/${best.slug}`;
    }
    if (!target) return null;

    const resolved = sanitizeUrl(target);
    const u = new URL(resolved);
    const qp = buildQuery({ pid, mcid, medium });
    if (qp) {
      qp.split('&').forEach(pair => {
        const [k, v] = pair.split('=');
        if (k && v) u.searchParams.set(k, decodeURIComponent(v));
      });
    }
    return u.toString();
  } catch {
    return null;
  }
}
