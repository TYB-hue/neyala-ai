'use client';

import { format } from "date-fns";
import type { UserProfile, UserStats } from "@/types";

interface ProfileContentProps {
  user: UserProfile;
  stats: UserStats;
}

export default function ProfileContent({ user, stats }: ProfileContentProps) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return (
    <div className="p-6 max-w-6xl mx-auto">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l2-2m0 0l7-7 7 7M5 4v16M19 4v16" />
            </svg>
            <h2 className="text-xl font-semibold">Trips Planned</h2>
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.tripsPlanned}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h2 className="text-xl font-semibold">Hotels Booked</h2>
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.hotelsBooked}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <h2 className="text-xl font-semibold">Reviews</h2>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{stats.reviews}</p>
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
    </div>
  );
} 