'use client';

import React, { useState, useEffect } from 'react';
import { HeartIcon } from 'lucide-react';

interface HeartButtonProps {
  attractionId: string;
  attractionData: {
    name: string;
    type: string;
    location: string;
    description?: string;
    image?: string;
    rating?: number;
    priceRange?: string;
    category?: string;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function HeartButton({ 
  attractionId, 
  attractionData, 
  className = '',
  size = 'md'
}: HeartButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if attraction is already saved on mount
  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        // For testing, check localStorage first
        const savedFavorites = JSON.parse(localStorage.getItem('savedFavorites') || '[]');
        const saved = savedFavorites.some((item: any) => item.attractionId === attractionId);
        setIsSaved(saved);

        // Also try to check from API if authenticated
        try {
          const response = await fetch('/api/user/collections');
          if (response.ok) {
            const collections = await response.json();
            const apiSaved = collections.some((item: any) => item.attraction.id === attractionId);
            setIsSaved(apiSaved);
          }
        } catch (apiError) {
          console.log('API check failed, using localStorage:', apiError);
        }
      } catch (error) {
        console.error('Failed to check if saved:', error);
      }
    };

    checkIfSaved();
  }, [attractionId]);

  const toggleSave = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      if (isSaved) {
        // Remove from collections
        try {
          const response = await fetch(`/api/user/collections?attractionId=${attractionId}`, {
            method: 'DELETE'
          });
          
          if (response.ok) {
            setIsSaved(false);
            // Also update localStorage
            const savedFavorites = JSON.parse(localStorage.getItem('savedFavorites') || '[]');
            const updated = savedFavorites.filter((item: any) => item.attractionId !== attractionId);
            localStorage.setItem('savedFavorites', JSON.stringify(updated));
          }
        } catch (apiError) {
          console.log('API remove failed, using localStorage:', apiError);
          // Fallback to localStorage
          const savedFavorites = JSON.parse(localStorage.getItem('savedFavorites') || '[]');
          const updated = savedFavorites.filter((item: any) => item.attractionId !== attractionId);
          localStorage.setItem('savedFavorites', JSON.stringify(updated));
          setIsSaved(false);
        }
      } else {
        // Add to collections
        try {
          const response = await fetch('/api/user/collections', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              attractionId,
              attractionData
            })
          });
          
          if (response.ok) {
            setIsSaved(true);
            // Also update localStorage
            const savedFavorites = JSON.parse(localStorage.getItem('savedFavorites') || '[]');
            savedFavorites.push({ attractionId, attractionData, savedAt: new Date().toISOString() });
            localStorage.setItem('savedFavorites', JSON.stringify(savedFavorites));
          }
        } catch (apiError) {
          console.log('API add failed, using localStorage:', apiError);
          // Fallback to localStorage
          const savedFavorites = JSON.parse(localStorage.getItem('savedFavorites') || '[]');
          savedFavorites.push({ attractionId, attractionData, savedAt: new Date().toISOString() });
          localStorage.setItem('savedFavorites', JSON.stringify(savedFavorites));
          setIsSaved(true);
        }
      }
    } catch (error) {
      console.error('Failed to toggle save:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <button
      onClick={toggleSave}
      disabled={isLoading}
      className={`
        ${sizeClasses[size]}
        rounded-full flex items-center justify-center transition-all duration-200
        ${isSaved 
          ? 'bg-red-500 text-white hover:bg-red-600' 
          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      title={isSaved ? 'Remove from collections' : 'Add to collections'}
    >
      <HeartIcon 
        className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'}`}
        fill={isSaved ? 'currentColor' : 'none'}
      />
    </button>
  );
}
