import { NextRequest, NextResponse } from "next/server";

const PEXELS_KEY = process.env.PEXELS_API_KEY!;
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY!;

async function fetchPexels(query: string) {
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
      headers: { Authorization: PEXELS_KEY },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    const photo = data?.photos?.[0];
    return photo?.src?.large || photo?.src?.original || null;
  } catch (error) {
    console.error('Pexels API error:', error);
    return null;
  }
}

async function fetchUnsplash(query: string) {
  try {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&content_filter=high&orientation=landscape`, {
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    const photo = data?.results?.[0];
    return photo?.urls?.regular || photo?.urls?.full || null;
  } catch (error) {
    console.error('Unsplash API error:', error);
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = (searchParams.get("name") || "").trim();
  const city = (searchParams.get("city") || "").trim();
  const type = (searchParams.get("type") || "place").trim(); // "place" | "restaurant" | "airport"

  if (!name) return NextResponse.json({ error: "Missing name" }, { status: 400 });

  // Build a stricter airport query to avoid random photos
  const query = [
    name,
    city,
    type === "restaurant"
      ? "restaurant food exterior"
      : type === "airport"
        ? "airport terminal building exterior signage runway"
        : "landmark"
  ]
    .filter(Boolean)
    .join(" ");

  // Priority: Pexels first, then Unsplash
  let url = await fetchPexels(query);
  if (!url) url = await fetchUnsplash(query);

  if (!url) {
    return NextResponse.json({ url: null, source: null }, { status: 200 });
  }
  
  // Additional protection: if somehow we got a Wikipedia URL, filter it out
  if (/upload\.wikimedia\.org/i.test(url)) {
    return NextResponse.json({ url: null, source: null }, { status: 200 });
  }
  
  return NextResponse.json({ url, source: url.includes("pexels") ? "pexels" : "unsplash" });
}


