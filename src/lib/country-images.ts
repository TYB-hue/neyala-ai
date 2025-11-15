// Country-specific header images mapping
// These images will be used for any city within the specified country

export const countryHeaderImages: Record<string, string> = {
  // China - Great Wall and traditional architecture
  'china': 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?ixlib=rb-4.1.0&auto=format&fit=crop&w=1200&h=600&q=80',
  
  // Japan - Mount Fuji and traditional Japanese landscape
  'japan': 'https://images.unsplash.com/photo-1542052125323-e69ad37a47c2?ixlib=rb-4.1.0&auto=format&fit=crop&w=1200&h=600&q=80',
  
  // Kyoto - Traditional Japanese temples and architecture
  'kyoto': 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'kyoto, japan': 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'kyoto japan': 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // Singapore - Modern cityscape with Marina Bay Sands
  'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.1.0&auto=format&fit=crop&w=1200&h=600&q=80',
  
  // United Kingdom - London skyline and Big Ben
  'united kingdom': 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg',
  'uk': 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg',
  
  // United States - New York City skyline
  'united states': 'https://plus.unsplash.com/premium_photo-1721671634670-b1f3fcaf71a0?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'usa': 'https://plus.unsplash.com/premium_photo-1721671634670-b1f3fcaf71a0?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'us': 'https://plus.unsplash.com/premium_photo-1721671634670-b1f3fcaf71a0?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // New York City - NYC skyline and landmarks
  'new york': 'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'new york city': 'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'nyc': 'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'new york, usa': 'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'new york, united states': 'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'New York City, USA': 'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // Canada - Rocky Mountains and natural landscape
  'canada': 'https://plus.unsplash.com/premium_photo-1694475481348-7cbe417be129?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // Mexico - Mexico City and Mexican landmarks
  'mexico': 'https://images.unsplash.com/photo-1547995886-6dc09384c6e6?q=80&w=1452&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'mexico city': 'https://images.unsplash.com/photo-1547995886-6dc09384c6e6?q=80&w=1452&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // UAE - Modern Dubai skyline
  'uae': 'https://images.unsplash.com/photo-1546412414-8035e1776c9a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fFVBRXxlbnwwfHwwfHx8MA%3D%3D',
  'united arab emirates': 'https://images.unsplash.com/photo-1546412414-8035e1776c9a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fFVBRXxlbnwwfHwwfHx8MA%3D%3D',
  'dubai': 'https://images.unsplash.com/photo-1546412414-8035e1776c9a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fFVBRXxlbnwwfHwwfHx8MA%3D%3D',
  
  // Italy - Roman Colosseum and historic architecture
  'italy': 'https://images.unsplash.com/photo-1542820229-081e0c12af0b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHJvbWV8ZW58MHx8MHx8fDA%3D',
  'rome': 'https://images.unsplash.com/photo-1542820229-081e0c12af0b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHJvbWV8ZW58MHx8MHx8fDA%3D',
  
  // Turkey - Istanbul skyline and historic landmarks
  'turkey': 'https://images.unsplash.com/photo-1691446930608-98466a4bdd0f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'türkiye': 'https://images.unsplash.com/photo-1691446930608-98466a4bdd0f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'istanbul': 'https://images.unsplash.com/photo-1691446930608-98466a4bdd0f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // Spain - Barcelona and Spanish architecture
  'spain': 'https://plus.unsplash.com/premium_photo-1754251346629-cfd2c0b4a17b?q=80&w=1675&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'madrid': 'https://plus.unsplash.com/premium_photo-1754251346629-cfd2c0b4a17b?q=80&w=1675&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'barcelona': 'https://plus.unsplash.com/premium_photo-1754251346629-cfd2c0b4a17b?q=80&w=1675&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // Thailand - Bangkok temples and Thai architecture
  'thailand': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/%E0%B9%80%E0%B8%88%E0%B8%94%E0%B8%B5%E0%B8%A2%E0%B9%8C%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B8%A3%E0%B8%B8%E0%B8%932.jpg/2560px-%E0%B9%80%E0%B8%88%E0%B8%94%E0%B8%B5%E0%B8%A2%E0%B9%8C%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B8%A3%E0%B8%B8%E0%B8%932.jpg',
  'bangkok': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/%E0%B9%80%E0%B8%88%E0%B8%94%E0%B8%B5%E0%B8%A2%E0%B9%8C%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B8%A3%E0%B8%B8%E0%B8%932.jpg/2560px-%E0%B9%80%E0%B8%88%E0%B8%94%E0%B8%B5%E0%B8%A2%E0%B9%8C%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B8%A3%E0%B8%B8%E0%B8%932.jpg',
  
  // Morocco - Traditional Moroccan architecture and landscapes
  'morocco': 'https://plus.unsplash.com/premium_photo-1673415819362-c2ca640bfafe?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bW9yb2Njb3xlbnwwfHwwfHx8MA%3D%3D',
  'marrakech': 'https://plus.unsplash.com/premium_photo-1673415819362-c2ca640bfafe?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bW9yb2Njb3xlbnwwfHwwfHx8MA%3D%3D',
  'casablanca': 'https://plus.unsplash.com/premium_photo-1673415819362-c2ca640bfafe?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bW9yb2Njb3xlbnwwfHwwfHx8MA%3D%3D',
  
  // Netherlands - Amsterdam canals and Dutch architecture
  'netherlands': 'https://images.unsplash.com/photo-1581460436937-81f19e138de2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'amsterdam': 'https://images.unsplash.com/photo-1581460436937-81f19e138de2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'holland': 'https://images.unsplash.com/photo-1581460436937-81f19e138de2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // Greece - Santorini and Greek islands
  'greece': 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'athens': 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'santorini': 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // Portugal - Lisbon and Portuguese architecture
  'portugal': 'https://images.unsplash.com/photo-1612179587665-70b70e8adfbf?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fFBvcnR1Z2FsfGVufDB8MHwwfHww',
  'lisbon': 'https://images.unsplash.com/photo-1612179587665-70b70e8adfbf?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fFBvcnR1Z2FsfGVufDB8MHwwfHww',
  
  // Malaysia - Kuala Lumpur skyline
  'malaysia': 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'kuala lumpur': 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // Australia - Sydney Opera House and Australian landmarks
  'australia': 'https://plus.unsplash.com/premium_photo-1697730221799-f2aa87ab2c5d?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'sydney': 'https://plus.unsplash.com/premium_photo-1697730221799-f2aa87ab2c5d?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'melbourne': 'https://plus.unsplash.com/premium_photo-1697730221799-f2aa87ab2c5d?q=80&w=1674&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  
  // Costa Rica - Tropical rainforest and natural beauty
  'costa rica': 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4noleAbNyKd8xgY4DUaJLdOT8XUXs7OU67jdNOkjb0-Oe35bj6jd19TUtLny6w4R_S8o29BKLPcfcyG3Ei3TGtTqZd-rQw51O5ckG0MK2Ti_I8jwS6J6NDoChe9AS7EyncJaSgQu=w1080-h624-n-k-no',
  'san jose': 'https://lh3.googleusercontent.com/gps-cs-s/AC9h4noleAbNyKd8xgY4DUaJLdOT8XUXs7OU67jdNOkjb0-Oe35bj6jd19TUtLny6w4R_S8o29BKLPcfcyG3Ei3TGtTqZd-rQw51O5ckG0MK2Ti_I8jwS6J6NDoChe9AS7EyncJaSgQu=w1080-h624-n-k-no',
  
  // France - Eiffel Tower and French landmarks
  'france': 'https://images.unsplash.com/photo-1549144511-f099e773c147?ixlib=rb-4.1.0&auto=format&fit=crop&w=1200&h=600&q=80',
  'paris': 'https://images.unsplash.com/photo-1549144511-f099e773c147?ixlib=rb-4.1.0&auto=format&fit=crop&w=1200&h=600&q=80'
};

// Helper function to get header image for a destination
export function getHeaderImageForDestination(destination: string): string | null {
  if (!destination) return null;
  
  const normalizedDestination = destination.toLowerCase().trim();
  console.log('[getHeaderImageForDestination] Checking destination:', normalizedDestination);
  
  // First, check if the exact destination has a specific image
  if (countryHeaderImages[normalizedDestination]) {
    console.log('[getHeaderImageForDestination] Found exact match:', normalizedDestination);
    return countryHeaderImages[normalizedDestination];
  }
  
  // Also check with normalized spacing (remove extra spaces)
  const normalizedSpacing = normalizedDestination.replace(/\s+/g, ' ');
  if (countryHeaderImages[normalizedSpacing] && normalizedSpacing !== normalizedDestination) {
    console.log('[getHeaderImageForDestination] Found match with normalized spacing:', normalizedSpacing);
    return countryHeaderImages[normalizedSpacing];
  }
  
  // Extract parts from destination (e.g., "Beijing, China" -> ["beijing", "china"])
  const parts = normalizedDestination.split(/[,\s]+/).map(p => p.trim()).filter(p => p);
  console.log('[getHeaderImageForDestination] Extracted parts:', parts);
  
  // List of country-only keys (not cities) - cities should take priority
  const countryOnlyKeys = new Set(['japan', 'china', 'singapore', 'united kingdom', 'uk', 'united states', 'usa', 'us', 'canada', 'mexico', 'uae', 'united arab emirates', 'italy', 'turkey', 'türkiye', 'spain', 'thailand', 'morocco', 'netherlands', 'holland', 'greece', 'portugal', 'malaysia', 'australia', 'costa rica', 'france', 'saudi arabia', 'saudi']);
  
  // First, check for multi-word city matches (e.g., "new york city", "kyoto japan")
  // Build combinations of consecutive words to check for city names (check longer combinations first)
  for (let wordCount = 3; wordCount >= 2; wordCount--) {
    for (let i = 0; i <= parts.length - wordCount; i++) {
      const combination = parts.slice(i, i + wordCount).join(' ');
      console.log(`[getHeaderImageForDestination] Checking combination (${wordCount} words):`, combination);
      if (countryHeaderImages[combination] && !countryOnlyKeys.has(combination)) {
        // This is a city-specific image, return it
        console.log('[getHeaderImageForDestination] Found city-specific match:', combination);
        return countryHeaderImages[combination];
      }
      // Also check with comma between first and second word
      if (wordCount === 2) {
        const combinationComma = parts.slice(i, i + wordCount).join(', ');
        console.log(`[getHeaderImageForDestination] Checking combination with comma:`, combinationComma);
        if (countryHeaderImages[combinationComma] && !countryOnlyKeys.has(combinationComma)) {
          console.log('[getHeaderImageForDestination] Found city-specific match with comma:', combinationComma);
          return countryHeaderImages[combinationComma];
        }
      }
    }
  }
  
  // Check 2-word combinations with comma in different positions
  for (let i = 0; i < parts.length - 1; i++) {
    for (let j = i + 1; j < parts.length && j <= i + 2; j++) {
      const combinationComma = parts.slice(i, j + 1).join(', ');
      if (countryHeaderImages[combinationComma] && !countryOnlyKeys.has(combinationComma)) {
        return countryHeaderImages[combinationComma];
      }
    }
  }
  
  // Then check for single-word city matches (non-country keys)
  for (const part of parts) {
    const cleanPart = part.toLowerCase().trim();
    if (countryHeaderImages[cleanPart] && !countryOnlyKeys.has(cleanPart)) {
      // This is a city-specific image, return it
      return countryHeaderImages[cleanPart];
    }
  }
  
  // Finally check for country matches
  for (const part of parts) {
    const cleanPart = part.toLowerCase().trim();
    if (countryHeaderImages[cleanPart]) {
      return countryHeaderImages[cleanPart];
    }
  }
  
  // Try common country variations
  const variations: Record<string, string> = {
    'america': 'united states',
    'england': 'united kingdom',
    'great britain': 'united kingdom',
    'britain': 'united kingdom'
  };
  
  for (const part of parts) {
    const cleanPart = part.toLowerCase().trim();
    if (variations[cleanPart] && countryHeaderImages[variations[cleanPart]]) {
      return countryHeaderImages[variations[cleanPart]];
    }
  }
  
  return null;
}

// Function to get a fallback image for destinations without specific images
export function getFallbackHeaderImage(): string {
  // Return a generic travel image as fallback
  return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
}
