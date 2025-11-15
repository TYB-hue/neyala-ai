'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { MapPinIcon, StarIcon, HeartIcon, Trash2Icon } from 'lucide-react';

interface SavedAttraction {
  id: string;
  createdAt: string;
  attraction: {
    id: string;
    name: string;
    type: string;
    location: string;
    description?: string;
    image?: string;
    rating?: number;
    priceRange?: string;
    category?: string;
  };
}

interface CollectionsContentProps {
  userId: string;
}

export default function CollectionsContent({ userId }: CollectionsContentProps) {
  const [collections, setCollections] = useState<SavedAttraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from API first
        try {
          const response = await fetch('/api/user/collections');
          if (response.ok) {
            const data = await response.json();
            setCollections(data);
            setLoading(false);
            return;
          }
        } catch (apiError) {
          console.log('API fetch failed, using localStorage:', apiError);
        }
        
        // Fallback to localStorage for testing
        const savedFavorites = JSON.parse(localStorage.getItem('savedFavorites') || '[]');
        const collectionsData = savedFavorites.map((item: any) => ({
          id: item.attractionId,
          createdAt: item.savedAt,
          attraction: {
            ...item.attractionData,
            // Handle both attractions and restaurants
            name: item.attractionData.activity || item.attractionData.name,
            location: item.attractionData.destination || item.attractionData.location,
            type: item.attractionData.type || 'attraction'
          }
        }));
        
        setCollections(collectionsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch collections');
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [userId]);

  const removeFromCollections = async (attractionId: string) => {
    try {
      // Try API first
      try {
        const response = await fetch(`/api/user/collections?attractionId=${attractionId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setCollections(collections.filter(item => item.attraction.id !== attractionId));
          return;
        }
      } catch (apiError) {
        console.log('API remove failed, using localStorage:', apiError);
      }
      
      // Fallback to localStorage
      const savedFavorites = JSON.parse(localStorage.getItem('savedFavorites') || '[]');
      const updated = savedFavorites.filter((item: any) => item.attractionId !== attractionId);
      localStorage.setItem('savedFavorites', JSON.stringify(updated));
      
      setCollections(collections.filter(item => item.id !== attractionId));
    } catch (error) {
      console.error('Failed to remove from collections:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">💚</div>
        <h3 className="text-xl font-semibold mb-2">Your favorites are empty</h3>
        <p className="text-gray-600 mb-4">Start building your collection by hearting attractions, hotels, and places!</p>
        <a 
          href="/favorites" 
          className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Explore Favorites
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Favorites</h2>
        <a 
          href="/favorites" 
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Explore More
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {item.attraction.image && (
              <div className="h-48 relative">
                <img 
                  src={item.attraction.image} 
                  alt={item.attraction.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {item.attraction.type}
                  </span>
                </div>
                <button
                  onClick={() => removeFromCollections(item.attraction.id)}
                  className="absolute top-3 left-3 p-2 bg-white bg-opacity-90 rounded-full hover:bg-red-100 transition-colors"
                  title="Remove from collections"
                >
                  <Trash2Icon className="w-4 h-4 text-red-600" />
                </button>
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">{item.attraction.name}</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  <span>{item.attraction.location}</span>
                </div>
                
                {item.attraction.rating && (
                  <div className="flex items-center text-gray-600">
                    <StarIcon className="w-4 h-4 mr-2 text-yellow-500" />
                    <span>{item.attraction.rating}/5</span>
                  </div>
                )}
                
                {item.attraction.priceRange && (
                  <div className="flex items-center text-gray-600">
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {item.attraction.priceRange}
                    </span>
                  </div>
                )}
              </div>
              
              {item.attraction.description && (
                <div className="border-t pt-3">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {item.attraction.description}
                  </p>
                </div>
              )}
              
              <div className="mt-4 text-xs text-gray-500">
                Added {format(new Date(item.createdAt), 'MMM dd, yyyy')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
