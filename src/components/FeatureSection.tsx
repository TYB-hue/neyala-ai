'use client';

import React from 'react'
import { 
  SparklesIcon, 
  CalendarRangeIcon, 
  MapIcon, 
  HeartIcon 
} from 'lucide-react'
import Link from 'next/link'

export function FeatureSection() {
  const features = [
    {
      icon: <SparklesIcon className="h-8 w-8 text-blue-600" />,
      title: "AI-Powered Recommendations",
      description: "Our AI understands your preferences to suggest destinations and activities you'll love."
    },
    {
      icon: <CalendarRangeIcon className="h-8 w-8 text-blue-600" />,
      title: "Smart Itinerary Planning",
      description: "Create detailed day-by-day plans optimized for your travel style and interests."
    },
    {
      icon: <MapIcon className="h-8 w-8 text-blue-600" />,
      title: "Interactive Maps",
      description: "Visualize your trip with interactive maps showing attractions, restaurants, and transportation."
    },
    {
      icon: <HeartIcon className="h-8 w-8 text-blue-600" />,
      title: "Personalized Experience",
      description: "The more you use Neyala, the better it gets at recommending places you'll enjoy."
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How Neyala Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Planning your perfect trip has never been easier with our AI-powered travel assistant
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow">
              <div className="bg-blue-100 p-3 rounded-full w-fit mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="text-2xl font-bold mb-2">Ready to plan your dream vacation?</h3>
              <p className="text-blue-100">Let our AI create a personalized itinerary just for you.</p>
            </div>
            <Link 
              href="/plan"
              className="whitespace-nowrap bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-full shadow-lg"
            >
              Start Planning Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
} 