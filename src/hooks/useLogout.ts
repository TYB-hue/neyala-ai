'use client';

import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

export function useLogout() {
  const router = useRouter();
  const { signOut } = useClerk();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout: authLogout } = useAuth();

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    
    setIsLoggingOut(true);
    
    try {
    try {
      // Try to use Clerk's signOut if available
      if (signOut) {
        await signOut();
      }
    } catch (error) {
      console.log('Clerk signOut failed, using fallback logout');
    }
    
    try {
      // Call logout API route
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
      console.log('Logout API call failed');
    }
    
    // Clear auth context
    authLogout();
    
    // Show success message
    toast.success('Successfully logged out!');
    
    // Force a complete page refresh to clear all state
    window.location.href = '/';
  } finally {
    setIsLoggingOut(false);
  }
  };

  return { handleLogout, isLoggingOut };
}
