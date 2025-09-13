export async function getImageForCard({ 
  name, 
  city, 
  type 
}: { 
  name: string; 
  city?: string; 
  type: "place" | "restaurant" 
}): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      name,
      type,
      ...(city && { city })
    });
    
    const res = await fetch(`/api/image?${params}`, { 
      cache: "no-store" 
    });
    
    if (!res.ok) {
      console.error('Image API error:', res.status, res.statusText);
      return null;
    }
    
    const data = await res.json();
    return data.url as string | null;
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
}

export function makePlaceId(name: string, address: string): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crypto = require("crypto");
  return crypto.createHash("sha256").update(`${name}|${address}`.toLowerCase().trim()).digest("hex");
}
