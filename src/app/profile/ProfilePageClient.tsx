'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import ProfileContent from './components/ProfileContent';
import type { UserProfile, UserStats } from '@/types';

export default function ProfilePageClient() {
  const { isSignedIn, user: clerkUser } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    if (isSignedIn && clerkUser) {
      // Use Clerk user
      const profile: UserProfile = {
        id: clerkUser.id,
        firstName: clerkUser.firstName || 'User',
        lastName: clerkUser.lastName || '',
        imageUrl: clerkUser.imageUrl || null,
        emailAddress: clerkUser.emailAddresses[0]?.emailAddress || 'user@example.com',
        phoneNumber: clerkUser.phoneNumbers[0]?.phoneNumber || null,
        createdAt: new Date(clerkUser.createdAt),
      };
      setUserProfile(profile);

      // Mock stats for demo
      const mockStats: UserStats = {
        tripsPlanned: 3,
        collections: 5,
        reviews: 2,
        favoriteDestinations: ['Paris', 'Tokyo', 'New York']
      };
      setStats(mockStats);
    } else {
      // Create demo profile for testing
      const demoProfile: UserProfile = {
        id: 'demo-user',
        firstName: 'Demo',
        lastName: 'User',
        imageUrl: null,
        emailAddress: 'demo@neyala.ai',
        phoneNumber: null,
        createdAt: new Date(),
      };
      setUserProfile(demoProfile);

      const demoStats: UserStats = {
        tripsPlanned: 3,
        collections: 5,
        reviews: 2,
        favoriteDestinations: ['Paris', 'Tokyo', 'New York']
      };
      setStats(demoStats);
    }
  }, [isSignedIn, clerkUser]);

  if (!userProfile || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <ProfileContent user={userProfile} stats={stats} />;
}
