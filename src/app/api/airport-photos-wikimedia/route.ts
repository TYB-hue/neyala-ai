import { NextRequest, NextResponse } from 'next/server';

const ENDPOINT = 'https://commons.wikimedia.org/w/api.php';

async function fetchCategoryTitle(airportName: string): Promise<string | null> {
  const candidates: string[] = [];
  const base = airportName.trim();
  const short = base.replace(/^\S+\s+/, ''); // drop first word (city) if present
  const ensureAirport = (s: string) => /airport/i.test(s) ? s : `${s} Airport`;
  const ensureIntl = (s: string) => /international/i.test(s) ? s : s;

  const push = (s: string) => { if (!candidates.includes(s)) candidates.push(s); };
  push(base);
  push(ensureAirport(base));
  push(ensureIntl(ensureAirport(base)));
  if (short && short !== base) {
    push(short);
    push(ensureAirport(short));
    push(ensureIntl(ensureAirport(short)));
  }

  for (const cand of candidates) {
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      origin: '*',
      list: 'search',
      srsearch: `Category:${cand}`,
      srnamespace: '14',
      srlimit: '1'
    });
    const res = await fetch(`${ENDPOINT}?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) continue;
    const data = await res.json();
    const title = data?.query?.search?.[0]?.title || null;
    if (title) return title;
  }
  return null;
}

function buildPredicate(name: string) {
  const tokens = name.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const banned = /(map|logo|icon|seal|flag|coat_of_arms|diagram|svg)/i;
  return (title: string, url: string) => {
    const t = title.toLowerCase();
    // Must look like an airport-related media
    const airportish = /airport|terminal|runway|apron|airfield|gate|control_tower|tarmac|arrival|departure|concourse/i.test(t);
    // At least one token from the airport name should appear
    const hasToken = tokens.some(tok => t.includes(tok));
    if (banned.test(url) || banned.test(t)) return false;
    return airportish && hasToken;
  };
}

async function fetchCategoryImages(categoryTitle: string, limit: number, airportName: string): Promise<string[]> {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    generator: 'categorymembers',
    gcmtitle: categoryTitle,
    gcmtype: 'file',
    gcmlimit: String(limit),
    prop: 'imageinfo',
    iiprop: 'url|mime|size'
  });
  const res = await fetch(`${ENDPOINT}?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  const pages = data?.query?.pages || {};
  const valid = /(\.jpe?g|\.png|\.gif|\.webp)(\?.*)?$/i;
  const predicate = buildPredicate(airportName);
  const urls = Object.values(pages)
    .flatMap((p: any) => (Array.isArray(p?.imageinfo) ? p.imageinfo.map((ii: any) => ({ title: p?.title || '', url: ii?.url, width: ii?.width })) : []))
    .filter((x: any) => x && typeof x.url === 'string' && valid.test(x.url))
    .filter((x: any) => (x.width ? x.width >= 600 : true))
    .filter((x: any) => predicate(x.title, x.url))
    .map((x: any) => x.url);
  return urls;
}

async function searchFallback(airportName: string, limit: number): Promise<string[]> {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    generator: 'search',
    gsrsearch: airportName,
    gsrlimit: String(limit),
    prop: 'imageinfo',
    iiprop: 'url|mime|size'
  });
  const res = await fetch(`${ENDPOINT}?${params.toString()}`, { cache: 'no-store', headers: { 'Accept': 'application/json' } });
  if (!res.ok) return [];
  const data = await res.json();
  const pages = data?.query?.pages || {};
  const valid = /(\.jpe?g|\.png|\.gif|\.webp)(\?.*)?$/i;
  const predicate = buildPredicate(airportName);
  const urls = Object.values(pages)
    .flatMap((p: any) => (Array.isArray(p?.imageinfo) ? p.imageinfo.map((ii: any) => ({ title: p?.title || '', url: ii?.url, width: ii?.width })) : []))
    .filter((x: any) => x && typeof x.url === 'string' && valid.test(x.url))
    .filter((x: any) => (x.width ? x.width >= 600 : true))
    .filter((x: any) => predicate(x.title, x.url))
    .map((x: any) => x.url);
  return urls;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = (searchParams.get('name') || '').trim();
    const limit = Number(searchParams.get('limit') || '5');
    if (!name) return NextResponse.json({ photos: [] }, { status: 200 });

    const categoryTitle = await fetchCategoryTitle(name);
    let photos: string[] = [];
    if (categoryTitle) {
      photos = await fetchCategoryImages(categoryTitle, limit, name);
    }
    if (photos.length === 0) {
      photos = await searchFallback(name, limit);
    }

    // Deduplicate
    const seen = new Set<string>();
    const unique = photos.filter((u) => (seen.has(u) ? false : (seen.add(u), true)));

    return NextResponse.json({ photos: unique }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ photos: [] }, { status: 200 });
  }
}


