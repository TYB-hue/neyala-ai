'use client';

import React from 'react'
import Image from 'next/image'

export function GallerySection() {
  const images = [
    {
      url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      location: "Paris, France",
      description: "Iconic Eiffel Tower at sunset"
    },
    {
      url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      location: "Venice, Italy",
      description: "Scenic canal views"
    },
    {
      url: "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      location: "Santorini, Greece",
      description: "Beautiful white architecture"
    },
    {
      url: "https://images.unsplash.com/photo-1464746133101-a2c3f88e0dd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      location: "Tokyo, Japan",
      description: "Vibrant city life"
    },
    {
      url: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      location: "Bali, Indonesia",
      description: "Tropical paradise"
    },
    {
      url: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      location: "New York City, USA",
      description: "City that never sleeps"
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Discover Amazing Destinations
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get inspired by these breathtaking locations and start planning your next adventure
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div key={index} className="group relative overflow-hidden rounded-xl shadow-lg h-72">
              <Image
                src={image.url}
                alt={`${image.location} - ${image.description}`}
                fill
                className="object-cover transform transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-semibold mb-1">{image.location}</h3>
                  <p className="text-sm text-gray-200">{image.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 