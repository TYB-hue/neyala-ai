export interface PopularAirport {
  icao: string; // 4-letter ICAO
  iata: string; // 3-letter IATA (if known)
  name: string; // Official/common name
  city: string;
  country: string;
  wikipedia?: string; // Canonical Wikipedia page (when known)
  aliases?: string[]; // Common alt spellings/names
}

// Hand-picked set of major, high-traffic airports around the world.
// This list is intentionally compact and fast to scan for instant lookups.
export const popularAirports: PopularAirport[] = [
  { icao: 'EGLL', iata: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom', wikipedia: 'https://en.wikipedia.org/wiki/Heathrow_Airport', aliases: ['London Heathrow'] },
  { icao: 'KJFK', iata: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York City', country: 'United States', wikipedia: 'https://en.wikipedia.org/wiki/John_F._Kennedy_International_Airport', aliases: ['JFK Airport', 'New York JFK'] },
  { icao: 'KLAX', iata: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States', wikipedia: 'https://en.wikipedia.org/wiki/Los_Angeles_International_Airport' },
  { icao: 'LFPG', iata: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', wikipedia: 'https://en.wikipedia.org/wiki/Charles_de_Gaulle_Airport' },
  { icao: 'OMDB', iata: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', wikipedia: 'https://en.wikipedia.org/wiki/Dubai_International_Airport', aliases: ['Dubai Airport'] },
  { icao: 'LTFM', iata: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', wikipedia: 'https://en.wikipedia.org/wiki/Istanbul_Airport' },
  { icao: 'RJTT', iata: 'HND', name: 'Haneda Airport', city: 'Tokyo', country: 'Japan', wikipedia: 'https://en.wikipedia.org/wiki/Haneda_Airport', aliases: ['Tokyo Haneda'] },
  { icao: 'RJAA', iata: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', wikipedia: 'https://en.wikipedia.org/wiki/Narita_International_Airport', aliases: ['Tokyo Narita'] },
  { icao: 'WSSS', iata: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', wikipedia: 'https://en.wikipedia.org/wiki/Singapore_Changi_Airport', aliases: ['Changi Airport'] },
  { icao: 'VHHH', iata: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'China', wikipedia: 'https://en.wikipedia.org/wiki/Hong_Kong_International_Airport' },
  { icao: 'EDDF', iata: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', wikipedia: 'https://en.wikipedia.org/wiki/Frankfurt_Airport' },
  { icao: 'EHAM', iata: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', wikipedia: 'https://en.wikipedia.org/wiki/Amsterdam_Airport_Schiphol', aliases: ['Schiphol'] },
  { icao: 'LEMD', iata: 'MAD', name: 'Adolfo Suárez Madrid–Barajas Airport', city: 'Madrid', country: 'Spain', wikipedia: 'https://en.wikipedia.org/wiki/Adolfo_Su%C3%A1rez_Madrid%E2%80%93Barajas_Airport' },
  { icao: 'LEBL', iata: 'BCN', name: 'Barcelona–El Prat Airport', city: 'Barcelona', country: 'Spain', wikipedia: 'https://en.wikipedia.org/wiki/Barcelona%E2%80%93El_Prat_Airport' },
  { icao: 'OTHH', iata: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar', wikipedia: 'https://en.wikipedia.org/wiki/Hamad_International_Airport' },
  { icao: 'OMAA', iata: 'AUH', name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', country: 'United Arab Emirates', wikipedia: 'https://en.wikipedia.org/wiki/Abu_Dhabi_International_Airport' },
  { icao: 'YSSY', iata: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia', wikipedia: 'https://en.wikipedia.org/wiki/Sydney_Airport' },
  { icao: 'CYYZ', iata: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada', wikipedia: 'https://en.wikipedia.org/wiki/Toronto_Pearson_International_Airport' },
  { icao: 'SBGR', iata: 'GRU', name: 'São Paulo/Guarulhos International Airport', city: 'São Paulo', country: 'Brazil', wikipedia: 'https://en.wikipedia.org/wiki/S%C3%A3o_Paulo/Guarulhos_International_Airport' },
  { icao: 'VABB', iata: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India', wikipedia: 'https://en.wikipedia.org/wiki/Chhatrapati_Shivaji_Maharaj_International_Airport' },
  { icao: 'VIDP', iata: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', country: 'India', wikipedia: 'https://en.wikipedia.org/wiki/Indira_Gandhi_International_Airport' },
  { icao: 'VTBS', iata: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', wikipedia: 'https://en.wikipedia.org/wiki/Suvarnabhumi_Airport' },
  { icao: 'WMKK', iata: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Sepang', country: 'Malaysia', wikipedia: 'https://en.wikipedia.org/wiki/Kuala_Lumpur_International_Airport' },
  { icao: 'RKSI', iata: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea', wikipedia: 'https://en.wikipedia.org/wiki/Incheon_International_Airport' },
  { icao: 'MMMX', iata: 'MEX', name: 'Mexico City International Airport', city: 'Mexico City', country: 'Mexico', wikipedia: 'https://en.wikipedia.org/wiki/Mexico_City_International_Airport' },
  { icao: 'KSFO', iata: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'United States', wikipedia: 'https://en.wikipedia.org/wiki/San_Francisco_International_Airport' },
  { icao: 'KSEA', iata: 'SEA', name: 'Seattle–Tacoma International Airport', city: 'Seattle', country: 'United States', wikipedia: 'https://en.wikipedia.org/wiki/Seattle%E2%80%93Tacoma_International_Airport' },
  { icao: 'KMIA', iata: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'United States', wikipedia: 'https://en.wikipedia.org/wiki/Miami_International_Airport' },
  { icao: 'KORD', iata: 'ORD', name: 'O’Hare International Airport', city: 'Chicago', country: 'United States', wikipedia: 'https://en.wikipedia.org/wiki/O%27Hare_International_Airport' },
  { icao: 'KDFW', iata: 'DFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas–Fort Worth', country: 'United States', wikipedia: 'https://en.wikipedia.org/wiki/Dallas/Fort_Worth_International_Airport' },
];

// Simple lookup by ICAO
export function getPopularAirportByICAO(icao: string): PopularAirport | undefined {
  const code = (icao || '').toUpperCase();
  return popularAirports.find(a => a.icao === code);
}

// Lightweight name lookup (checks aliases and common fields). Not fuzzy.
export function findPopularAirportByName(name: string): PopularAirport | undefined {
  const q = (name || '').toLowerCase();
  return popularAirports.find(a =>
    a.name.toLowerCase() === q ||
    a.city.toLowerCase() === q ||
    a.aliases?.some(al => al.toLowerCase() === q)
  );
}












