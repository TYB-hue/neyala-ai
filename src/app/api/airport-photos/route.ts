import { NextRequest, NextResponse } from 'next/server';
import { getAirportWithPhotos } from '@/lib/foursquare';
import { getWikipediaAirportImagesByICAO, resolveAirportTitle, fetchImageTitlesForPage, fetchImageUrls, buildWikipediaPageUrl, resolveWikipediaByICAOFromAirportDB, getWikipediaAirportImagesByAirportDB } from '@/lib/wikipedia-airport-images';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const airportName = searchParams.get('airport');
    const city = searchParams.get('city') || undefined;
    const country = searchParams.get('country') || undefined;

    console.log('Airport photos API called with:', { airportName, city, country });

    if (!airportName) {
      return NextResponse.json({ error: 'Missing airport name' }, { status: 400 });
    }

    // If client provided ICAO via query, try Wikipedia resolver first
    const icao = searchParams.get('icao') || undefined;

    // 1) Wikipedia via AirportDB by ICAO (if provided)
    if (icao && process.env.AIRPORTDB_API_TOKEN) {
      const wiki = await getWikipediaAirportImagesByAirportDB(icao, process.env.AIRPORTDB_API_TOKEN, 6);
      if (wiki.images.length > 0) {
        return NextResponse.json({ place: { name: icao, link: wiki.pageUrl }, photos: wiki.images }, { status: 200 });
      }
    }

    // 2) Wikipedia by name fallback
    const title = await resolveAirportTitle(airportName);
    if (title) {
      const titles = await fetchImageTitlesForPage(title);
      const urls = await fetchImageUrls(titles, 6);
      if (urls.length > 0) {
        return NextResponse.json({ place: { name: title, link: buildWikipediaPageUrl(title) }, photos: urls }, { status: 200 });
      }
    }

    // 3) Foursquare fallback
    const result = await getAirportWithPhotos(airportName, city, country);
    console.log('Airport photos API result (Foursquare fallback):', result);
    if (result && (result.photos?.length || 0) > 0) {
      return NextResponse.json({ place: result.place, photos: result.photos }, { status: 200 });
    }

    return NextResponse.json({ place: null, photos: [] }, { status: 200 });

  } catch (error) {
    console.error('Error in airport-photos API:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch airport photos' 
    }, { status: 500 });
  }
}
