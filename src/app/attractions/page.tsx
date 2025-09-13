'use client';

import React from 'react';
import { getViatorLink } from '@/lib/viator-links';
import { MapPinIcon, StarIcon, ClockIcon } from 'lucide-react';

// Sample attractions data
const sampleAttractions = [
  {
    id: '1',
    name: 'Eiffel Tower',
    type: 'ATTRACTION',
    location: 'Paris, France',
    description: 'Iconic iron lattice tower on the Champ de Mars in Paris, France.',
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800',
    rating: 4.7,
    priceRange: '€26-€45',
    category: 'Landmark'
  },
  {
    id: '2',
    name: 'The Ritz Paris',
    type: 'HOTEL',
    location: 'Paris, France',
    description: 'Luxury hotel in the heart of Paris, known for its elegance and history.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    rating: 4.9,
    priceRange: '€800-€2000',
    category: 'Luxury'
  },
  {
    id: '3',
    name: 'Le Comptoir du Relais',
    type: 'RESTAURANT',
    location: 'Paris, France',
    description: 'Cozy bistro serving traditional French cuisine in Saint-Germain.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    rating: 4.6,
    priceRange: '€30-€80',
    category: 'French Bistro'
  },
  {
    id: '4',
    name: 'Taj Mahal',
    type: 'ATTRACTION',
    location: 'Agra, India',
    description: 'UNESCO World Heritage Site and iconic mausoleum built by Mughal emperor Shah Jahan.',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
    rating: 4.8,
    priceRange: '₹50-₹1300',
    category: 'Monument'
  },
  {
    id: '5',
    name: 'Hotel Plaza Athénée',
    type: 'HOTEL',
    location: 'Paris, France',
    description: 'Luxury hotel on Avenue Montaigne, known for its red awnings.',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    rating: 4.9,
    priceRange: '€1000-€3000',
    category: 'Luxury'
  },
  {
    id: '6',
    name: 'L\'Arpège',
    type: 'RESTAURANT',
    location: 'Paris, France',
    description: 'Three-Michelin-starred restaurant by chef Alain Passard.',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800',
    rating: 4.9,
    priceRange: '€200-€400',
    category: 'Fine Dining'
  }
];

export default function AttractionsPage() {
  // Check which attractions are already saved
  const [savedAttractions, setSavedAttractions] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedAttractions') || '[]');
    setSavedAttractions(saved.map((item: any) => item.attractionId));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Explore Attractions</h1>
              <p className="text-gray-600 mt-1">Discover amazing places, hotels, and restaurants</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Click the ❤️ to save to collections</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attractions Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleAttractions.map((attraction) => (
            <div key={attraction.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img 
                  src={attraction.image} 
                  alt={attraction.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Heart Button */}
                <div className="absolute top-3 right-3">
                  <button 
                    className="w-8 h-8 rounded-full bg-white text-gray-600 hover:bg-gray-100 border border-gray-300 flex items-center justify-center transition-all duration-200 cursor-pointer"
                    title="Add to collections"
                    onClick={async () => {
                      try {
                        const attractionId = `static-${attraction.id}`;
                        const res = await fetch('/api/user/collections', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            attractionId,
                            attractionData: {
                              id: attractionId,
                              name: attraction.name,
                              type: attraction.type,
                              location: attraction.location,
                              description: attraction.description,
                              image: attraction.image,
                              rating: attraction.rating,
                              priceRange: attraction.priceRange,
                              category: attraction.category
                            }
                          })
                        });
                        if (res.ok) {
                          alert(`Added ${attraction.name} to collections!`);
                        } else {
                          alert('Failed to save. Are you signed in?');
                        }
                      } catch (e) {
                        alert('Failed to save.');
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </button>
                </div>
                
                {/* Type Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-white bg-opacity-90 text-xs font-medium rounded-full">
                    {attraction.type}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{attraction.name}</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    <span className="text-sm">{attraction.location}</span>
                  </div>
                  
                  {attraction.rating && (
                    <div className="flex items-center text-gray-600">
                      <StarIcon className="w-4 h-4 mr-2 text-yellow-500" />
                      <span className="text-sm">{attraction.rating}/5</span>
                    </div>
                  )}
                  
                  {attraction.priceRange && (
                    <div className="flex items-center text-gray-600">
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {attraction.priceRange}
                      </span>
                    </div>
                  )}
                </div>
                
                {attraction.description && (
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {attraction.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {attraction.category}
                  </span>
                  
                  <a
                    href={getViatorLink(attraction.location, attraction.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                  >
                    Learn More →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
