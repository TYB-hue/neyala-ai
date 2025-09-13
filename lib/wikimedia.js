// Minimal Wikimedia Commons photo fetcher
// Usage: getAirportPhotos('Heathrow Airport', 5)

/**
 * Fetches image URLs from Wikimedia Commons related to an airport name.
 * @param {string} airportName - e.g., "Heathrow Airport"
 * @param {number} limit - number of results to request (1-50 typical)
 * @returns {Promise<string[]>} array of image URLs (jpg/jpeg/png/gif/webp)
 */
export async function getAirportPhotos(airportName, limit = 5) {
  const endpoint = 'https://commons.wikimedia.org/w/api.php';

  try {
    if (!airportName || typeof airportName !== 'string') return [];

    // 1) Try Category search first (more reliable for airports)
    const searchParams = new URLSearchParams({
      action: 'query',
      format: 'json',
      origin: '*',
      list: 'search',
      srsearch: `Category:${airportName}`,
      srnamespace: '14', // Category namespace
      srlimit: '1'
    });
    const searchUrl = `${endpoint}?${searchParams.toString()}`;
    const searchRes = await fetch(searchUrl, { cache: 'no-store' });
    const searchData = await searchRes.json();
    const categoryTitle = searchData?.query?.search?.[0]?.title;

    let urls = [];
    const validExt = /\.(jpe?g|png|gif|webp)(\?.*)?$/i;

    if (categoryTitle) {
      const imagesParams = new URLSearchParams({
        action: 'query',
        format: 'json',
        origin: '*',
        generator: 'categorymembers',
        gcmtitle: categoryTitle,
        gcmtype: 'file',
        gcmlimit: String(limit),
        prop: 'imageinfo',
        iiprop: 'url'
      });
      const imagesUrl = `${endpoint}?${imagesParams.toString()}`;
      const imagesRes = await fetch(imagesUrl, { cache: 'no-store' });
      const imagesData = await imagesRes.json();
      const pages = imagesData?.query?.pages || {};
      urls = Object.values(pages)
        .flatMap((p) => (Array.isArray(p?.imageinfo) ? p.imageinfo : []))
        .map((ii) => ii?.url)
        .filter((u) => typeof u === 'string' && validExt.test(u));
    }

    // 2) Fallback to generator=search if category not found/empty
    if (urls.length === 0) {
      const params = new URLSearchParams({
        action: 'query',
        format: 'json',
        origin: '*',
        generator: 'search',
        gsrsearch: airportName,
        gsrlimit: String(limit),
        prop: 'imageinfo',
        iiprop: 'url'
      });
      const url = `${endpoint}?${params.toString()}`;
      const res = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const pages = data?.query?.pages || {};
        urls = Object.values(pages)
          .flatMap((p) => (Array.isArray(p?.imageinfo) ? p.imageinfo : []))
          .map((ii) => ii?.url)
          .filter((u) => typeof u === 'string' && validExt.test(u));
      }
    }

    // Deduplicate while preserving order
    const seen = new Set();
    const unique = [];
    for (const u of urls) {
      if (!seen.has(u)) { seen.add(u); unique.push(u); }
    }
    return unique;
  } catch (err) {
    console.error('wikimedia.getAirportPhotos error:', err);
    return [];
  }
}

export default getAirportPhotos;


