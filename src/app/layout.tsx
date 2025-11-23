import React, { Suspense } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { GoogleAnalytics } from '@/components/Analytics';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

// Loading component for Suspense fallback
function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'AI Travel Planner – Free Personalized Trip Itineraries | Nyala',
    template: '%s | Nyala'
  },
  description: 'Free AI travel planner that creates personalized travel itineraries in seconds. Plan your perfect trip with our AI travel assistant and travel planning app. Generate custom AI travel itineraries with real attractions, hotels, and activities.',
  keywords: 'travel planner ai, ai travel planner, ai travel itinerary, ai travel assistant, ai travel app, travel planning app, itinerary template, travel planning websites, best travel planning apps',
  verification: {
    google: 'aARyPYi7q-othGLSZGTdXnLmRBbmiYrD1EPI0uLMlkg',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' }
    ],
    apple: [{ url: '/apple-touch-icon.png' }]
  },
  openGraph: {
    type: 'website',
    title: 'AI Travel Planner – Free Personalized Trip Itineraries | Nyala',
    description: 'Free AI travel planner that creates personalized travel itineraries with real attractions, hotels, and activities. Plan your perfect trip with our AI travel assistant.',
    url: '/',
    siteName: 'Nyala',
    images: [
      { url: '/images/og-nyala.jpg', width: 1200, height: 630, alt: 'Nyala – AI Travel Planner' }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Travel Planner – Free Personalized Trip Itineraries | Nyala',
    description: 'Free AI travel planner that creates personalized travel itineraries. Plan your perfect trip with our AI travel assistant and travel planning app.',
    images: ['/images/og-nyala.jpg']
  },
  alternates: {
    canonical: '/' 
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* Google Analytics - Uses Next.js Script component which loads in <head> automatically */}
          <GoogleAnalytics />
          <AuthProvider>
            <Suspense fallback={<Loading />}>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                  <Suspense fallback={<Loading />}>
                    {children}
                  </Suspense>
                </main>
                <Footer />
              </div>
            </Suspense>
            <Toaster />
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
} 