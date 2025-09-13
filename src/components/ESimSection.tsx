'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Wifi, Globe, Smartphone, Zap, CheckCircle, Star, ExternalLink } from 'lucide-react';
import { getAffiliateLink } from '@/lib/breezesim-config';

interface ESimData {
  provider: string;
  name: string;
  description: string;
  price: string;
  data: string;
  validity: string;
  coverage: string[];
  features: string[];
  affiliateLink: string;
  image?: string;
  rating?: number;
  reviews?: number;
}

interface ESimSectionProps {
  destination: string;
  eSimData?: ESimData;
  className?: string;
}

const defaultESimData: ESimData = {
  provider: 'BreezeSim',
  name: 'Global eSIM',
  description: 'Stay connected worldwide with our reliable eSIM service. Instant activation, no physical SIM needed.',
  price: '$9.99',
  data: '1GB',
  validity: '7 days',
  coverage: ['Global', '200+ Countries', 'Instant Activation'],
  features: [
    'No physical SIM required',
    'Instant activation',
    '24/7 customer support',
    'Flexible data plans',
    'Secure connection'
  ],
  affiliateLink: 'https://breezesim.com?sca_ref=9513707.18mF6FIHVI',
  rating: 4.8,
  reviews: 1247
};

export default function ESimSection({ destination, eSimData = defaultESimData, className = '' }: ESimSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate destination-specific affiliate link
  const destinationSpecificLink = getAffiliateLink(eSimData.affiliateLink, destination, 'neyala-ai');

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(destinationSpecificLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleGetESim = () => {
    // Track affiliate click
    const trackingData = {
      destination,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };
    
    // You can send this to your analytics service
    console.log('eSIM affiliate click:', trackingData);
    
    // Open destination-specific affiliate link
    window.open(destinationSpecificLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className={`bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Wifi className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Stay Connected</h2>
            <p className="text-gray-600">Get reliable internet access for {destination}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-semibold">{eSimData.rating}</span>
          </div>
          <span className="text-sm text-gray-500">({eSimData.reviews} reviews)</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Smartphone className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{eSimData.provider}</h3>
                <p className="text-blue-100">{eSimData.name}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{eSimData.price}</div>
              <div className="text-blue-100 text-sm">Starting from</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">{eSimData.description}</p>
          
          {/* Data and Validity */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="font-semibold">Data</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{eSimData.data}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="w-5 h-5 text-green-600" />
                <span className="font-semibold">Validity</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{eSimData.validity}</p>
            </div>
          </div>

          {/* Coverage */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Coverage</h4>
            <div className="flex flex-wrap gap-2">
              {eSimData.coverage.map((item, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Features</h4>
            <div className="space-y-2">
              {eSimData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGetESim}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Get eSIM for {destination}</span>
            </button>
            <button
              onClick={handleCopyLink}
              className={`px-4 py-3 rounded-lg border transition-colors flex items-center justify-center space-x-2 ${
                copied
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          {/* Expandable Details */}
          <div className="mt-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
            >
              <span>{isExpanded ? 'Hide' : 'Show'} affiliate details</span>
              <svg
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isExpanded && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-semibold text-gray-800 mb-2">Affiliate Information</h5>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Provider:</strong> {eSimData.provider}</p>
                  <p><strong>Destination:</strong> {destination}</p>
                  <p><strong>Affiliate Link:</strong> {destinationSpecificLink}</p>
                  <p><strong>Commission:</strong> Earn rewards on every purchase</p>
                  <p><strong>Support:</strong> affiliates@breezesim.com</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
