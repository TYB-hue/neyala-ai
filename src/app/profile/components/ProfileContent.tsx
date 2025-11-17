'use client';

import { useState } from "react";
import { format } from "date-fns";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import type { UserProfile, UserStats } from "@/types";
import CollectionsContent from "./CollectionsContent";
import ReviewsContent from "./ReviewsContent";

interface ProfileContentProps {
  user: UserProfile;
  stats: UserStats;
}

type ActiveTab = 'overview' | 'collections' | 'reviews';

export default function ProfileContent({ user, stats }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

  const renderTabContent = () => {
    switch (activeTab) {
      case 'collections':
        return <CollectionsContent userId={user.id} />;
      case 'reviews':
        return <ReviewsContent userId={user.id} />;
      default:
        return (
          <>
            <div className="space-y-3">
              <Link 
                href="/profile/history"
                className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-all duration-200 active:bg-gray-50 block"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5V3a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">Trips Planned</h2>
                      <p className="text-sm text-gray-500">Click to view details</p>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </Link>

              <div 
                className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-all duration-200 active:bg-gray-50"
                onClick={() => setActiveTab('collections')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">Collections</h2>
                      <p className="text-sm text-gray-500">Click to view details</p>
                      <div className="mt-1">
                        <a 
                          href="/favorites" 
                          className="text-sm text-green-600 hover:text-green-700 font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Explore Favorites →
                        </a>
                      </div>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </div>

              <div 
                className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-all duration-200 active:bg-gray-50"
                onClick={() => setActiveTab('reviews')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">Reviews</h2>
                      <p className="text-sm text-gray-500">Click to view details</p>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Favorite Destinations</h2>
              <div className="flex flex-wrap gap-2">
                {stats.favoriteDestinations.map((destination) => (
                  <span 
                    key={destination}
                    className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {destination}
                  </span>
                ))}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden flex-shrink-0 bg-blue-600 flex items-center justify-center">
              {user.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt={fullName || "Profile"} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-600 flex items-center justify-center text-3xl sm:text-4xl text-white font-bold">
                  {user.firstName?.[0] || user.emailAddress?.[0]?.toUpperCase()}
                  {user.lastName?.[0] || ''}
                </div>
              )}
            </div>
            <div className="text-center space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{fullName || "User"}</h1>
              <p className="text-sm text-gray-600 break-words">{user.emailAddress}</p>
              <p className="text-sm text-gray-600">{user.phoneNumber || "No phone number"}</p>
              <p className="text-sm text-gray-500">Member since {format(user.createdAt, "MMMM yyyy")}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        {activeTab !== 'overview' && (
          <div className="mb-4">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center text-blue-600 hover:text-blue-700 active:text-blue-800 transition-colors text-sm py-2"
            >
              <ChevronRightIcon className="w-4 h-4 rotate-180 mr-2" />
              Back to Overview
            </button>
          </div>
        )}

        {/* Tab Content */}
        <div className="space-y-4">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
} 