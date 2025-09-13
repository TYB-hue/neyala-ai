'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, Globe, Smartphone, Zap, CheckCircle, Star, ExternalLink, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { breezesimConfig, marketStats } from '@/lib/breezesim-config';

interface ESimPlan {
  id: string;
  name: string;
  data: string;
  validity: string;
  price: number;
  coverage: string[];
  features: string[];
  affiliateLink: string;
}

interface ESimData {
  provider: string;
  plans: ESimPlan[];
  globalFeatures: string[];
  supportEmail: string;
}

interface ESimPlansSectionProps {
  destination: string;
  className?: string;
}

export default function ESimPlansSection({ destination, className = '' }: ESimPlansSectionProps) {
  const [eSimData, setESimData] = useState<ESimData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchESimData();
  }, [destination]);

  const fetchESimData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/esim?destination=${encodeURIComponent(destination)}`);
      const result = await response.json();
      
      if (result.success) {
        setESimData(result.data);
        setSelectedPlan(result.data.plans[0]?.id || null);
      } else {
        setError('Failed to fetch eSIM data');
      }
    } catch (err) {
      setError('Failed to load eSIM plans');
      console.error('Error fetching eSIM data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!selectedPlan || !eSimData) return;
    
    const plan = eSimData.plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    try {
      await navigator.clipboard.writeText(plan.affiliateLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      // Track copy action
      await fetch('/api/esim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'copy',
          destination,
          planId: selectedPlan,
          userAgent: navigator.userAgent,
          referer: document.referrer
        })
      });
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleGetESim = async (planId: string) => {
    const plan = eSimData?.plans.find(p => p.id === planId);
    if (!plan) return;

    // Track affiliate click
    try {
      await fetch('/api/esim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'click',
          destination,
          planId,
          userAgent: navigator.userAgent,
          referer: document.referrer
        })
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }
    
    // Open affiliate link
    window.open(plan.affiliateLink, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <section className={`bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
          <div className="h-4 bg-gray-200 rounded mb-6 w-2/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !eSimData) {
    return (
      <section className={`bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-4">📱</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">eSIM Plans</h2>
          <p className="text-gray-600">Unable to load eSIM plans at the moment.</p>
        </div>
      </section>
    );
  }

  const selectedPlanData = eSimData.plans.find(p => p.id === selectedPlan);

  return (
    <section className={`bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Wifi className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Stay Connected</h2>
            <p className="text-gray-600">Get reliable internet access for {destination}</p>
            <div className="flex items-center mt-1">
              <Info className="w-4 h-4 text-blue-600 mr-1" />
              <span className="text-xs text-blue-600 font-medium">
                {breezesimConfig.programName} - We earn commission on purchases
              </span>
            </div>
            <div className="mt-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                📍 Destination-specific plans for {destination}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-semibold">4.8</span>
          </div>
          <span className="text-sm text-gray-500">(1,247 reviews)</span>
        </div>
      </div>

      {/* Market Statistics */}
      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
        <div className="flex items-start space-x-3">
          <div className="bg-green-100 p-2 rounded-full">
            <span className="text-green-600 text-sm font-bold">📈</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-1">Market Growth</p>
            <p className="text-xs text-gray-600">{marketStats.growthPrediction}</p>
            <p className="text-xs text-gray-500 mt-1">Source: {marketStats.source}</p>
          </div>
        </div>
      </div>

      {/* Plan Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Choose Your Plan for {destination}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {eSimData.plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-lg p-4 border-2 cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? 'border-blue-500 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <div className="text-center">
                <div className="mb-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    🌍 Perfect for {destination}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">{plan.name}</h4>
                <div className="text-2xl font-bold text-blue-600 mb-2">${plan.price}</div>
                <div className="text-sm text-gray-600 mb-3">
                  {plan.data} • {plan.validity}
                </div>
                <div className="space-y-1">
                  {plan.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Plan Details */}
      {selectedPlanData && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Smartphone className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{eSimData.provider}</h3>
                  <p className="text-blue-100">{selectedPlanData.name}</p>
                  <p className="text-blue-100 text-sm">📍 Optimized for {destination}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">${selectedPlanData.price}</div>
                <div className="text-blue-100 text-sm">One-time payment</div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Data and Validity */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">Data</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{selectedPlanData.data}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Globe className="w-5 h-5 text-green-600" />
                  <span className="font-semibold">Validity</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{selectedPlanData.validity}</p>
              </div>
            </div>

            {/* Coverage */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Coverage</h4>
              <div className="flex flex-wrap gap-2">
                {selectedPlanData.coverage.map((item, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Global Features */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {eSimData.globalFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleGetESim(selectedPlanData.id)}
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

            {/* Support Info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-center text-sm text-gray-500">
                <p>Need help? Contact us at {eSimData.supportEmail}</p>
                <p className="mt-1">24/7 customer support available</p>
              </div>
            </div>

            {/* Affiliate Disclosure */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-gray-600">
                  <p className="font-medium mb-1">Affiliate Disclosure</p>
                  <p>This page contains affiliate links to BreezeSim. We may earn a commission when you purchase through our links, at no additional cost to you. This helps support our travel planning services.</p>
                  <p className="mt-2">
                    <a 
                      href={breezesimConfig.brandGuidelinesUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      View BreezeSim Brand Guidelines
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
