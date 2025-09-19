import React, { Suspense } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
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
    default: 'Nyala – Your AI Travel Companion',
    template: '%s | Nyala'
  },
  description: 'Plan smarter trips with AI. Generate itineraries, explore attractions, and save your favorites with Nyala.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' }
    ],
    apple: [{ url: '/apple-touch-icon.png' }]
  },
  openGraph: {
    type: 'website',
    title: 'Nyala – Your AI Travel Companion',
    description: 'Create beautiful, detailed itineraries with real attractions and maps.',
    url: '/',
    siteName: 'Nyala',
    images: [
      { url: '/images/og-nyala.jpg', width: 1200, height: 630, alt: 'Nyala – AI Travel Planner' }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nyala – Your AI Travel Companion',
    description: 'Plan smarter trips with AI. Generate itineraries and explore real attractions.',
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