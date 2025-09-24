import crypto from 'crypto';

// Generate placeId from place name and address using SHA256
export function generatePlaceId(placeName: string, address?: string): string {
  const input = `${placeName}${address ? `|${address}` : ''}`;
  return crypto.createHash('sha256').update(input).digest('hex');
}

// Extract address from location object
export function getAddressFromLocation(location: { lat: number; lng: number }): string {
  return `${location.lat},${location.lng}`;
}

// Get place type from itinerary context
export function getPlaceType(context: 'morning' | 'afternoon' | 'restaurant'): string {
  switch (context) {
    case 'morning':
    case 'afternoon':
      return 'ATTRACTION';
    case 'restaurant':
      return 'RESTAURANT';
    default:
      return 'PLACE';
  }
}









