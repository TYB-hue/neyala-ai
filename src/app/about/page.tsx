import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center mb-12">About Nyala</h1>
        
        <div className="max-w-3xl mx-auto space-y-8">
          <section className="prose max-w-none">
            <p className="text-xl leading-relaxed">
              Named after one of Sudan&apos;s largest cities, Nyala is an innovative travel planning platform 
              that combines artificial intelligence with deep cultural understanding to create personalized 
              travel experiences for everyone.
            </p>
          </section>

          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-semibold mb-6">Our Mission</h2>
            <p className="text-lg leading-relaxed">
              We believe that travel should be accessible and enjoyable for everyone, regardless of their 
              specific needs or requirements. Our AI-powered platform takes into account various factors 
              such as dietary restrictions, accessibility needs, and cultural preferences to create the 
              perfect itinerary for your journey.
            </p>
          </section>

          <section className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">What Makes Us Different</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Personalized itineraries based on your specific needs
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Special consideration for halal food requirements
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Accessibility-focused recommendations
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Family-friendly travel options
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">Our Features</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  AI-powered travel recommendations
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Detailed day-by-day itineraries
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Restaurant and accommodation suggestions
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Budget-conscious planning options
                </li>
              </ul>
            </div>
          </section>

          <div className="text-center pt-8">
            <Link
              href="/plan"
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Start Planning Your Trip
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 