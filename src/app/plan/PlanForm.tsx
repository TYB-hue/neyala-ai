'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { readItineraryStream } from '@/lib/itinerary-stream';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useUser } from '@clerk/nextjs';
import SpecialRequirements from '@/components/SpecialRequirements';
import { usePlanContext } from './PlanContext';

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
  const { setPlanData } = usePlanContext();
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Initialize suggestions with all destinations
  useEffect(() => {
    setSuggestions(popularDestinations);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      try {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error('Error handling click outside:', error);
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
    setError(null);
    setLoading(true);

    try {
      // DEMO MODE: Create a sample itinerary for testing collections
      if (formData.destination.toLowerCase().includes('demo') || formData.destination.toLowerCase().includes('test')) {
        console.log('Demo mode activated - creating sample itinerary');
        
        const demoItinerary = {
          id: `demo_${Date.now()}`,
          destination: formData.destination,
          dates: {
            start: formData.startDate,
            end: formData.endDate
          },
          headerImage: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800",
          overview: {
            history: `Discover the rich history of ${formData.destination}`,
            culture: `Immerse yourself in the vibrant culture of ${formData.destination}`
          },
          airport: {
            name: `${formData.destination} International Airport`,
            image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800",
            photos: [
              "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800",
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
            ],
            info: "Modern international airport with excellent facilities"
          },
          hotels: [
            {
              name: "Demo Luxury Hotel",
              image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
              rating: 4.8,
              price: 300,
              link: "#",
              location: {
                lat: 48.8566,
                lng: 2.3522
              }
            }
          ],
          itineraries: [
            {
              day: 1,
              date: formData.startDate,
              title: "Day 1 - Arrival & Exploration",
              morning: {
                activity: "Visit Demo Museum",
                description: "Start your journey with a visit to the famous Demo Museum",
                image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800",
                time: "9:00 AM - 12:00 PM",
                location: {
                  lat: 48.8566,
                  lng: 2.3522
                }
              },
              afternoon: {
                activity: "Explore Demo Park",
                description: "Relax and enjoy the beautiful Demo Park",
                image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
                time: "2:00 PM - 5:00 PM",
                location: {
                  lat: 48.8566,
                  lng: 2.3522
                }
              },
              restaurant: {
                name: "Demo Fine Dining",
                cuisine: "International",
                description: "Elegant restaurant with city views",
                location: {
                  lat: 48.8566,
                  lng: 2.3522
                }
              }
            },
            {
              day: 2,
              date: formData.endDate,
              title: "Day 2 - City Tour & Shopping",
              morning: {
                activity: "Demo City Tour",
                description: "Take a guided tour of the city's highlights",
                image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
                time: "9:00 AM - 12:00 PM",
                location: {
                  lat: 48.8566,
                  lng: 2.3522
                }
              },
              afternoon: {
                activity: "Shopping at Demo Mall",
                description: "Shop for souvenirs and local products",
                image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
                time: "2:00 PM - 5:00 PM",
                location: {
                  lat: 48.8566,
                  lng: 2.3522
                }
              },
              restaurant: {
                name: "Demo Bistro",
                cuisine: "Local",
                description: "Authentic local cuisine in a cozy setting",
                location: {
                  lat: 48.8566,
                  lng: 2.3522
                }
              }
            }
          ],
          transportation: [
            {
              type: "Public Transport",
              description: "Efficient metro and bus system",
              icon: "🚇"
            },
            {
              type: "Walking",
              description: "Most attractions are within walking distance",
              icon: "🚶"
            }
          ],
          estimatedCost: {
            accommodation: 400,
            activities: 150,
            transportation: 50,
            food: 200,
            total: 800
          }
        };

        // Store demo itinerary
        localStorage.setItem(`itinerary_${demoItinerary.id}`, JSON.stringify(demoItinerary));
        router.push(`/itinerary/${demoItinerary.id}`);
        return;
      }

      const response = await fetch('/api/generate-itinerary-stream', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), signal: AbortSignal.timeout(120000),
      });
      const itinerary = await readItineraryStream(response);
      const id = itinerary.id || `temp_${crypto.randomUUID()}`;
      localStorage.setItem(`itinerary_${id}`, JSON.stringify(itinerary));
      router.push(`/itinerary/${id}`);
    } catch (err) {
      setError(err instanceof Error && err.name === 'TimeoutError'
        ? 'Generation timed out. Please try again.'
        : err instanceof Error ? err.message : 'Unable to generate your itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full p-6 md:p-8 overflow-y-auto bg-gradient-to-br from-blue-50 to-indigo-100">
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-8 flex items-center space-x-4 max-w-md mx-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="text-lg font-medium text-gray-800">Generating your perfect itinerary...</p>
          </div>
        </div>
      )}
      <div className="text-center mb-8">
        <h1 className="heading-responsive font-bold text-gradient mb-4">Plan Your Perfect Trip</h1>
        <p className="text-responsive text-secondary-600 max-w-lg mx-auto">Tell us about your travel preferences and we'll create a personalized itinerary just for you.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div ref={searchRef} className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Destination</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleDestinationChange}
              onFocus={handleDestinationFocus}
              placeholder="Where do you want to go?"
              className="input-field text-lg"
              required
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-2 card max-h-60 overflow-auto">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <span className="text-gray-800 font-medium">{suggestion.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="input-field"
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

        <div className="mt-10">
          <button
            type="submit"
            className={`w-full py-4 px-6 btn-primary text-lg font-semibold transition-smooth ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-medium'
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating...</span>
              </div>
            ) : (
              'Generate My Perfect Itinerary'
            )}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg shadow-soft">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

      </form>
    </div>
  );
}
