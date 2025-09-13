import React, { Suspense } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

// Loading component for Suspense fallback
function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}

export const metadata = {
  title: 'Nyala - Your AI Travel Companion',
  description: 'Personalized travel itineraries powered by AI',
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