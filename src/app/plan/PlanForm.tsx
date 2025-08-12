'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useUser } from '@clerk/nextjs';
import SpecialRequirements from '@/components/SpecialRequirements';

interface PlanFormState {
  destination: string;
  startDate: string;
  endDate: string;
  travelGroup: string;
  requirements: string[];
  budget: string;
  travelStyle: string;
  activities: string[];
}

interface Suggestion {
  id: string;
  name: string;
}

export default function PlanForm() {
  const router = useRouter();
  const { user } = useUser();
  const [formData, setFormData] = useState<PlanFormState>({
    destination: '',
    startDate: '',
    endDate: '',
    travelGroup: 'solo',
    requirements: [],
    budget: 'moderate',
    travelStyle: 'balanced',
    activities: [],
  });

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Initialize suggestions with all destinations
  useEffect(() => {
    setSuggestions(popularDestinations);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Sample destinations (replace with API call to your backend)
  const popularDestinations = [
    // Europe
    { id: '1', name: 'Paris, France' },
    { id: '2', name: 'London, UK' },
    { id: '3', name: 'Rome, Italy' },
    { id: '4', name: 'Barcelona, Spain' },
    { id: '5', name: 'Amsterdam, Netherlands' },
    { id: '6', name: 'Prague, Czech Republic' },
    { id: '7', name: 'Vienna, Austria' },
    { id: '8', name: 'Berlin, Germany' },
    { id: '9', name: 'Venice, Italy' },
    { id: '10', name: 'Santorini, Greece' },
    { id: '11', name: 'Istanbul, Turkey' },
    { id: '12', name: 'Zurich, Switzerland' },
    { id: '13', name: 'Dublin, Ireland' },
    { id: '14', name: 'Stockholm, Sweden' },
    { id: '15', name: 'Copenhagen, Denmark' },

    // Asia
    { id: '16', name: 'Tokyo, Japan' },
    { id: '17', name: 'Kyoto, Japan' },
    { id: '18', name: 'Seoul, South Korea' },
    { id: '19', name: 'Bangkok, Thailand' },
    { id: '20', name: 'Singapore' },
    { id: '21', name: 'Dubai, UAE' },
    { id: '22', name: 'Abu Dhabi, UAE' },
    { id: '23', name: 'Bali, Indonesia' },
    { id: '24', name: 'Hong Kong' },
    { id: '25', name: 'Shanghai, China' },
    { id: '26', name: 'Beijing, China' },
    { id: '27', name: 'Maldives' },
    { id: '28', name: 'Mumbai, India' },
    { id: '29', name: 'Hanoi, Vietnam' },
    { id: '30', name: 'Kuala Lumpur, Malaysia' },

    // Americas
    { id: '31', name: 'New York City, USA' },
    { id: '32', name: 'San Francisco, USA' },
    { id: '33', name: 'Los Angeles, USA' },
    { id: '34', name: 'Las Vegas, USA' },
    { id: '35', name: 'Miami, USA' },
    { id: '36', name: 'Vancouver, Canada' },
    { id: '37', name: 'Toronto, Canada' },
    { id: '38', name: 'Rio de Janeiro, Brazil' },
    { id: '39', name: 'Buenos Aires, Argentina' },
    { id: '40', name: 'Mexico City, Mexico' },
    { id: '41', name: 'Cancun, Mexico' },
    { id: '42', name: 'Machu Picchu, Peru' },
    { id: '43', name: 'Havana, Cuba' },
    { id: '44', name: 'Montreal, Canada' },
    { id: '45', name: 'Hawaii, USA' },

    // Africa & Middle East
    { id: '46', name: 'Cairo, Egypt' },
    { id: '47', name: 'Marrakech, Morocco' },
    { id: '48', name: 'Cape Town, South Africa' },
    { id: '49', name: 'Nairobi, Kenya' },
    { id: '50', name: 'Zanzibar, Tanzania' },
    { id: '51', name: 'Petra, Jordan' },
    { id: '52', name: 'Jerusalem, Israel' },
    { id: '53', name: 'Doha, Qatar' },
    { id: '54', name: 'Muscat, Oman' },
    { id: '55', name: 'Victoria Falls, Zimbabwe' },

    // Oceania
    { id: '56', name: 'Sydney, Australia' },
    { id: '57', name: 'Melbourne, Australia' },
    { id: '58', name: 'Gold Coast, Australia' },
    { id: '59', name: 'Auckland, New Zealand' },
    { id: '60', name: 'Queenstown, New Zealand' },
    { id: '61', name: 'Fiji Islands' },
    { id: '62', name: 'Bora Bora, French Polynesia' },
    { id: '63', name: 'Tahiti, French Polynesia' },

    // Other Popular Islands
    { id: '64', name: 'Phuket, Thailand' },
    { id: '65', name: 'Seychelles Islands' },
    { id: '66', name: 'Mauritius' },
    { id: '67', name: 'Ibiza, Spain' },
    { id: '68', name: 'Mykonos, Greece' },
    { id: '69', name: 'Maldives Islands' },
    { id: '70', name: 'Bali, Indonesia' }
  ];

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, destination: value }));
    
    // Filter suggestions based on input
    const filtered = popularDestinations.filter((dest) =>
      dest.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleDestinationFocus = () => {
    // Don't show suggestions on focus - only show when user starts typing
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setFormData((prev) => ({ ...prev, destination: suggestion.name }));
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name !== 'destination') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (requirement: string) => {
    setFormData((prev) => {
      const requirements = prev.requirements.includes(requirement)
        ? prev.requirements.filter((r) => r !== requirement)
        : [...prev.requirements, requirement];
      return { ...prev, requirements };
    });
  };

  const activities = [
    { id: 'beaches', name: 'Beaches', icon: '🏖️' },
    { id: 'city-sightseeing', name: 'City sightseeing', icon: '🗼' },
    { id: 'outdoor-adventures', name: 'Outdoor adventures', icon: '🏃' },
    { id: 'festivals-events', name: 'Festivals/events', icon: '🎪' },
    { id: 'food-exploration', name: 'Food exploration', icon: '🍽️' },
    { id: 'nightlife', name: 'Nightlife', icon: '🌙' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' },
    { id: 'spa-wellness', name: 'Spa wellness', icon: '💆' },
  ];

  const handleActivityToggle = (activityId: string) => {
    setFormData((prev) => {
      const activities = prev.activities.includes(activityId)
        ? prev.activities.filter((a) => a !== activityId)
        : [...prev.activities, activityId];
      return { ...prev, activities };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setItinerary(null);

    try {
      if (!formData.destination || !formData.startDate || !formData.endDate) {
        throw new Error('Please fill in all required fields');
      }

      // Allow unauthenticated users for testing
      if (!user) {
        console.log('Warning: Unauthenticated user attempting to generate itinerary');
      }

      // Use streaming API for real-time updates
      const response = await fetch(`${window.location.origin}/api/generate-itinerary-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user?.id || 'anonymous'
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let itineraryData: any = null;
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.status === 'completed' && data.data) {
                itineraryData = data.data;
                const tempId = `temp_${Date.now()}`;
                
                // Store the full itinerary data in localStorage for immediate display
                localStorage.setItem(`itinerary_${tempId}`, JSON.stringify(itineraryData));
                
                setItinerary({ id: tempId, ...itineraryData });
                router.push(`/itinerary/${tempId}`);
                return;
              } else if (data.status === 'error') {
                throw new Error(data.error);
              }
            } catch (parseError) {
              // Ignore parse errors for non-JSON lines
            }
          }
        }
      }

      if (!itineraryData) {
        throw new Error('No itinerary was generated');
      }

    } catch (err) {
      console.error('Error generating itinerary:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full p-8 overflow-y-auto">
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-lg">Generating your perfect itinerary...</p>
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-8">Plan Your Trip</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <div ref={searchRef} className="relative">
            <label className="block text-sm font-medium mb-2">Destination</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleDestinationChange}
              onFocus={handleDestinationFocus}
              placeholder="Where do you want to go?"
              className="w-full p-2 border rounded-md"
              required
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Travel Group</label>
            <select
              name="travelGroup"
              value={formData.travelGroup}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="solo">Solo Travel</option>
              <option value="couple">Couple</option>
              <option value="family">Family</option>
              <option value="friends">Friends</option>
            </select>
          </div>
        </div>

        <SpecialRequirements
          selectedRequirements={formData.requirements}
          onRequirementChange={handleCheckboxChange}
        />

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Preferences</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">Budget Range</label>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="budget">Low</option>
              <option value="moderate">Medium</option>
              <option value="luxury">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Travel Style</label>
            <select
              name="travelStyle"
              value={formData.travelStyle}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="relaxed">Relaxed</option>
              <option value="balanced">Balanced</option>
              <option value="intensive">Intensive</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Which activities are you interested in?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                onClick={() => handleActivityToggle(activity.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 flex flex-col items-center text-center space-y-2 hover:border-blue-500 ${
                  formData.activities.includes(activity.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <span className="text-3xl">{activity.icon}</span>
                <span className="text-sm font-medium">{activity.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className={`w-full py-3 px-4 bg-blue-600 text-white rounded-md font-medium ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Generating Itinerary...' : 'Generate Itinerary'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {itinerary && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Your Itinerary</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Destination</h4>
                <p>{itinerary.destination}</p>
              </div>
              
              <div>
                <h4 className="font-semibold">Dates</h4>
                <p>{itinerary.dates.start} - {itinerary.dates.end}</p>
              </div>

              <div>
                <h4 className="font-semibold">Overview</h4>
                <div className="ml-4">
                  <p><strong>History:</strong> {itinerary.overview.history}</p>
                  <p><strong>Culture:</strong> {itinerary.overview.culture}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold">Airport Information</h4>
                <p>{itinerary.airport.name}</p>
                <p>{itinerary.airport.info}</p>
              </div>

              <div>
                <h4 className="font-semibold">Hotels</h4>
                <div className="space-y-2">
                  {itinerary.hotels.map((hotel: any, index: number) => (
                    <div key={index} className="ml-4">
                      <p><strong>{hotel.name}</strong></p>
                      <p>Rating: {hotel.rating} ⭐️ - ${Math.round(hotel.price)}/night</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold">Activities</h4>
                <div className="space-y-2">
                  {itinerary.activities.map((activity: any, index: number) => (
                    <div key={index} className="ml-4">
                      <p><strong>{activity.name}</strong> - Day {activity.day}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold">Transportation</h4>
                <div className="space-y-2">
                  {itinerary.transportation.map((transport: any, index: number) => (
                    <div key={index} className="ml-4">
                      <p><strong>{transport.type}</strong></p>
                      <p className="text-sm text-gray-600">{transport.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold">Estimated Costs</h4>
                <div className="ml-4">
                  <p>Accommodation: ${itinerary.estimatedCost.accommodation}</p>
                  <p>Activities: ${itinerary.estimatedCost.activities}</p>
                  <p>Transportation: ${itinerary.estimatedCost.transportation}</p>
                  <p>Food: ${itinerary.estimatedCost.food}</p>
                  <p className="font-bold mt-2">Total: ${itinerary.estimatedCost.total}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
