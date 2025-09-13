const WIKI_API = 'https://en.wikipedia.org/w/api.php';

export interface WikipediaResolveResult {
  title: string | null;
  url: string | null;
}

// Resolve exact Wikipedia page using an external ICAO→Wikipedia resolver
export async function resolveWikipediaByICAO(
  icao: string,
  resolverBaseUrl: string,
  apiKey?: string
): Promise<WikipediaResolveResult> {
  if (!icao || !resolverBaseUrl) return { title: null, url: null };
  const url = `${resolverBaseUrl}?icao=${encodeURIComponent(icao)}`;
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {})
    },
    cache: 'no-store'
  });
  if (!res.ok) return { title: null, url: null };
  const data = await res.json();

  const pageUrl: string | null = data?.url || null;
  const titleFromApi: string | null = data?.title || (pageUrl ? decodeURIComponent((pageUrl.split('/wiki/')[1] || '').replaceAll('_', ' ')) : null);
  const title = titleFromApi || null;
  const finalUrl = pageUrl || (title ? `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s+/g, '_'))}` : null);
  return { title, url: finalUrl };
}

// AirportDB resolver (https://airportdb.io) using apiToken query param
export async function resolveWikipediaByICAOFromAirportDB(
  icao: string,
  apiToken: string
): Promise<WikipediaResolveResult> {
  if (!icao || !apiToken) return { title: null, url: null };
  const url = `https://airportdb.io/api/v1/airport/${encodeURIComponent(icao)}?apiToken=${encodeURIComponent(apiToken)}`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' }, cache: 'no-store' });
  if (!res.ok) return { title: null, url: null };
  const data = await res.json();
  // Try a few common keys for the wikipedia page (AirportDB returns wikipedia_link)
  const pageUrl: string | null = data?.wikipedia || data?.wikipediaUrl || data?.wikipedia_url || data?.wikipedia_link || null;
  const title = pageUrl ? decodeURIComponent((pageUrl.split('/wiki/')[1] || '').replaceAll('_', ' ')) : null;
  return { title, url: pageUrl };
}

// Fallback: opensearch title resolution
export async function resolveAirportTitle(airportName: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: 'opensearch',
    format: 'json',
    origin: '*',
    search: airportName,
    limit: '1',
    namespace: '0'
  });
  const res = await fetch(`${WIKI_API}?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.[1]?.[0] || null;
}

export function buildWikipediaPageUrl(title: string): string {
  return `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s+/g, '_'))}`;
}

export async function fetchImageTitlesForPage(title: string): Promise<string[]> {
  const params = new URLSearchParams({
    action: 'parse',
    format: 'json',
    origin: '*',
    prop: 'images',
    page: title
  });
  const res = await fetch(`${WIKI_API}?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  const images: string[] = data?.parse?.images || [];
  return images.filter(t => typeof t === 'string' && !/logo|map|icon|seal|flag|coat|svg/i.test(t));
}

export async function fetchImageUrls(imageTitles: string[] = [], limit = 6): Promise<string[]> {
  if (!imageTitles.length) return [];
  const titlesParam = imageTitles.slice(0, limit).map(t => `File:${t}`).join('|');
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    titles: titlesParam,
    prop: 'imageinfo',
    iiprop: 'url|mime|size'
  });
  const res = await fetch(`${WIKI_API}?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  const pages = data?.query?.pages || {};
  const valid = /(\.jpe?g|\.png|\.gif|\.webp)(\?.*)?$/i;
  const urls: string[] = Object.values(pages as any)
    .flatMap((p: any) => Array.isArray(p?.imageinfo) ? p.imageinfo : [])
    .map((ii: any) => ii?.url)
    .filter((u: any) => typeof u === 'string' && valid.test(u));
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const u of urls) if (!seen.has(u)) { seen.add(u); unique.push(u); }
  return unique;
}

export async function getWikipediaAirportImagesByICAO(
  icao: string,
  opts: { resolverBaseUrl: string; apiKey?: string; limit?: number }
): Promise<{ pageUrl: string | null; images: string[] }> {
  const { resolverBaseUrl, apiKey, limit = 6 } = opts;
  const { title, url } = await resolveWikipediaByICAO(icao, resolverBaseUrl, apiKey);
  if (!title) return { pageUrl: null, images: [] };
  const imageTitles = await fetchImageTitlesForPage(title);
  const images = await fetchImageUrls(imageTitles, limit);
  return { pageUrl: url, images };
}

export async function getWikipediaAirportImagesByAirportDB(
  icao: string,
  apiToken: string,
  limit = 6
): Promise<{ pageUrl: string | null; images: string[] }> {
  const { title, url } = await resolveWikipediaByICAOFromAirportDB(icao, apiToken);
  if (!title) return { pageUrl: null, images: [] };
  const imageTitles = await fetchImageTitlesForPage(title);
  const images = await fetchImageUrls(imageTitles, limit);
  return { pageUrl: url, images };
}


