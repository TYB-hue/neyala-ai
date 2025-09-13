'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { X, Star, MessageCircle, User, Calendar } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
}

interface ReviewSlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  placeId: string;
  placeName: string;
  placeType: string;
  address?: string;
}

export default function ReviewSlidePanel({
  isOpen,
  onClose,
  placeId,
  placeName,
  placeType,
  address
}: ReviewSlidePanelProps) {
  const { user, isSignedIn } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  // Fetch reviews when panel opens
  const fetchReviews = useCallback(async () => {
    if (!placeId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/reviews?placeId=${placeId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
        setAverageRating(data.averageRating || 0);
        setTotalReviews(data.totalReviews || 0);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [placeId]);

  useEffect(() => {
    if (isOpen && placeId) {
      fetchReviews();
    }
  }, [isOpen, placeId, fetchReviews]);

  const handleSubmitReview = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      alert('Please sign in to leave a review');
      return;
    }

    if (newRating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          placeName,
          placeType,
          rating: newRating,
          comment: newComment.trim() || undefined,
          address
        }),
      });

      if (response.ok) {
        // Refresh reviews
        await fetchReviews();
        // Reset form
        setNewRating(0);
        setNewComment('');
        setHoveredStar(0);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  }, [isSignedIn, newRating, newComment, placeName, placeType, address, fetchReviews]);

  const renderStars = useCallback((rating: number, interactive = false, onStarClick?: (rating: number) => void) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => onStarClick?.(star) : undefined}
            onMouseEnter={interactive ? () => setHoveredStar(star) : undefined}
            onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= (interactive ? hoveredStar || newRating : rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  }, [hoveredStar, newRating]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-150 ${
          isOpen ? 'bg-opacity-30 opacity-100' : 'bg-opacity-0 opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Slide Panel */}
      <div 
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[60] transform transition-transform duration-150 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          perspective: '1000px'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
              <p className="text-sm text-gray-600 font-medium">{placeName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              title="Close reviews"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Rating Summary */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {renderStars(averageRating)}
                  <span className="ml-2 text-xl font-bold text-blue-600">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-blue-600 font-medium">
                  {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Add Review Form */}
            {isSignedIn && (
              <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Write a Review</h3>
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating *
                    </label>
                    {renderStars(newRating, true, setNewRating)}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment (optional)
                    </label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your experience..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submitting || newRating === 0}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            )}

            {/* Reviews List */}
            <div>
              <h3 className="text-lg font-medium mb-4">Reviews</h3>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">No reviews yet</p>
                  <p className="text-gray-500 text-sm mt-1">Be the first to review this place!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {review.user.firstName && review.user.lastName
                                ? `${review.user.firstName} ${review.user.lastName}`
                                : 'Anonymous User'}
                            </p>
                            <div className="flex items-center">
                              {renderStars(review.rating)}
                              <span className="ml-2 text-sm text-gray-600">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {review.comment && (
                        <p className="text-gray-700 ml-11">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
