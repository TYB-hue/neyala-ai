'use client';

import React, { useState } from 'react'
import { MapPinIcon, CalendarIcon, PlaneTakeoffIcon } from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export function HeroSection() {
  const { isSignedIn } = useUser()
  const router = useRouter()
  const [destination, setDestination] = useState('')
  const [travelDates, setTravelDates] = useState('')

  const handleStartPlanning = (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (!isSignedIn) {
      toast.error('Please sign in to start planning your trip!')
      router.push('/sign-in')
      return
    }
    
    // If user is signed in, navigate to plan page
    router.push('/plan')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isSignedIn) {
      toast.error('Please sign in to start planning your trip!')
      router.push('/sign-in')
      return
    }
    
    // If user is signed in, proceed with search logic
    // You can add actual search functionality here later
    toast.success('Search functionality coming soon!')
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center"></div>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
      </div>
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            AI Travel Planner for Effortless Trip Planning
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-100">
            Create personalized AI travel itineraries with our free AI travel planner. 
            Discover new destinations, plan your perfect trip with our AI travel assistant, and travel smarter.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <button 
              onClick={handleStartPlanning}
              className="bg-white text-blue-700 hover:bg-blue-50 font-bold py-3 px-8 rounded-full shadow-lg flex items-center justify-center"
            >
              <PlaneTakeoffIcon className="mr-2 h-5 w-5" />
              Start Planning
            </button>
            <Link
              href="/about" 
              className="bg-transparent border-2 border-white hover:bg-white/10 font-bold py-3 px-8 rounded-full flex items-center justify-center"
            >
              Learn More
            </Link>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium block mb-1 text-blue-100">Where to?</label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
                  <input 
                    type="text" 
                    placeholder="Destination" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-white/20 pl-10 pr-3 py-3 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium block mb-1 text-blue-100">When?</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
                  <input 
                    type="text" 
                    placeholder="Travel dates" 
                    value={travelDates}
                    onChange={(e) => setTravelDates(e.target.value)}
                    className="w-full bg-white/20 pl-10 pr-3 py-3 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
              </div>
              <div className="md:self-end">
                <button 
                  type="submit"
                  className="w-full md:w-auto bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-md"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
} 