'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { StarIcon, MapPinIcon, MessageSquareIcon } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  placeName: string;
  placeType: string;
  placeId: string;
}

interface ReviewsContentProps {
  userId: string;
}

export default function ReviewsContent({ userId }: ReviewsContentProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/reviews?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        setReviews(data.reviews || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">⭐</div>
        <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
        <p className="text-gray-600 mb-4">Share your experiences with other travelers!</p>
        <a 
          href="/plan" 
          className="inline-block px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Plan a Trip & Leave Reviews
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Reviews</h2>
        <a 
          href="/plan" 
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Plan & Review More
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold">{review.placeName}</h3>
                <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                  <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{review.rating}/5</span>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  <span className="capitalize">{review.placeType.toLowerCase()}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MessageSquareIcon className="w-4 h-4 mr-2" />
                  <span>{format(new Date(review.createdAt), 'MMM dd, yyyy')}</span>
                </div>
              </div>
              
              {review.comment && (
                <div className="border-t pt-3">
                  <h4 className="font-medium mb-2">Your Review</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


