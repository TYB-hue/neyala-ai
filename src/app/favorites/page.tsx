'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { MapPinIcon, StarIcon, HeartIcon, Trash2Icon } from 'lucide-react';

interface SavedFavorite {
  id: string;
  itemId: string | null;
  name: string;
  location: string;
  description: string | null;
  imageUrl: string; // Exact URL saved at like time - never changes
  meta: any | null;
  createdAt: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<SavedFavorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from new favorites API first
        try {
          const response = await fetch('/api/favorites');
          if (response.ok) {
            const data = await response.json();
            if (data.success && Array.isArray(data.favorites) && data.favorites.length > 0) {
              console.log('[FavoritesPage] Loaded', data.favorites.length, 'favorites from API');
              setFavorites(data.favorites);
              setLoading(false);
              return;
            }
          }
        } catch (apiError) {
          console.log('[FavoritesPage] API fetch failed, using localStorage:', apiError);
        }
        
        // Fallback to localStorage for guests/backward compatibility
        const savedFavorites = JSON.parse(localStorage.getItem('savedFavorites') || '[]');
        const favoritesData: SavedFavorite[] = savedFavorites.map((item: any) => {
          const attractionData = item.attractionData || {};
          return {
            id: item.attractionId || `local-${Date.now()}-${Math.random()}`,
            itemId: item.attractionId || null,
            name: attractionData.activity || attractionData.name || 'Unknown',
            location: attractionData.destination || attractionData.location || 'Unknown',
            description: attractionData.description || null,
            imageUrl: attractionData.image || '', // Use saved image URL
            meta: {
              type: attractionData.type || 'attraction',
              ...attractionData
            },
            createdAt: item.savedAt || new Date().toISOString(),
          };
        });
        
        console.log('[FavoritesPage] Loaded', favoritesData.length, 'favorites from localStorage');
        setFavorites(favoritesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch favorites');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();

    // Add event listener for real-time updates from other components
    window.addEventListener('favoritesUpdated', fetchFavorites);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('favoritesUpdated', fetchFavorites);
    };
  }, []);

  const removeFromFavorites = async (favoriteId: string) => {
    try {
      // Try new favorites API first
      try {
        const response = await fetch(`/api/favorites/${favoriteId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setFavorites(favorites.filter(item => item.id !== favoriteId));
          return;
        }
      } catch (apiError) {
        console.log('[FavoritesPage] API remove failed, using localStorage:', apiError);
      }
      
      // Fallback to localStorage
      const savedFavorites = JSON.parse(localStorage.getItem('savedFavorites') || '[]');
      const updated = savedFavorites.filter((item: any) => item.attractionId !== favoriteId);
      localStorage.setItem('savedFavorites', JSON.stringify(updated));
      
      setFavorites(favorites.filter(item => item.id !== favoriteId));
      window.dispatchEvent(new Event('favoritesUpdated'));
    } catch (error) {
      console.error('[FavoritesPage] Failed to remove favorite:', error);
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

  if (favorites.length === 0) {
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
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((favorite) => (
          <div key={favorite.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Display exact saved imageUrl - no re-fetching */}
            {favorite.imageUrl ? (
              <div className="h-48 relative">
                <img 
                  src={favorite.imageUrl} 
                  alt={favorite.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback placeholder if saved image fails to load (CDN change, etc.)
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
                  }}
                />
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {favorite.meta?.type || 'attraction'}
                  </span>
                </div>
                <button
                  onClick={() => removeFromFavorites(favorite.id)}
                  className="absolute top-3 left-3 p-2 bg-white bg-opacity-90 rounded-full hover:bg-red-100 transition-colors"
                  title="Remove from favorites"
                >
                  <Trash2Icon className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ) : (
              // Placeholder if no imageUrl saved
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3">{favorite.name}</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  <span>{favorite.location}</span>
                </div>
                
                {favorite.meta?.rating && (
                  <div className="flex items-center text-gray-600">
                    <StarIcon className="w-4 h-4 mr-2 text-yellow-500" />
                    <span>{favorite.meta.rating}/5</span>
                  </div>
                )}
                
                {favorite.meta?.priceRange && (
                  <div className="flex items-center text-gray-600">
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {favorite.meta.priceRange}
                    </span>
                  </div>
                )}
              </div>
              
              {favorite.description && (
                <div className="border-t pt-3">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {favorite.description}
                  </p>
                </div>
              )}
              
              <div className="mt-4 text-xs text-gray-500">
                Added {format(new Date(favorite.createdAt), 'MMM dd, yyyy')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
