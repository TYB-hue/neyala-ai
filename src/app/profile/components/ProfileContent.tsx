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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Link 
                href="/profile/history"
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] block"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5V3a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                    <h2 className="text-xl font-semibold">Trips Planned</h2>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mt-2">Click to view details</p>
              </Link>

              <div 
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                onClick={() => setActiveTab('collections')}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h2 className="text-xl font-semibold">Collections</h2>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mt-2">Click to view details</p>
                <div className="mt-3">
                  <a 
                    href="/favorites" 
                    className="text-sm text-green-600 hover:text-green-800 font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Explore Favorites →
                  </a>
                </div>
              </div>

              <div 
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                onClick={() => setActiveTab('reviews')}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <h2 className="text-xl font-semibold">Reviews</h2>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 mt-2">Click to view details</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Favorite Destinations</h2>
              <div className="flex flex-wrap gap-2">
                {stats.favoriteDestinations.map((destination) => (
                  <span 
                    key={destination}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
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
    <div className="p-6 max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 rounded-full overflow-hidden">
            {user.imageUrl ? (
              <img 
                src={user.imageUrl} 
                alt={fullName || "Profile"} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-600 flex items-center justify-center text-4xl text-white">
                {user.firstName?.[0] || user.emailAddress?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">{fullName || "User"}</h1>
            <p className="text-gray-600 mb-1">{user.emailAddress}</p>
            <p className="text-gray-600 mb-1">{user.phoneNumber || "No phone number"}</p>
            <p className="text-gray-600">Member since {format(user.createdAt, "MMMM yyyy")}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      {activeTab !== 'overview' && (
        <div className="mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ChevronRightIcon className="w-4 h-4 rotate-180 mr-2" />
            Back to Overview
          </button>
        </div>
      )}

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
} 