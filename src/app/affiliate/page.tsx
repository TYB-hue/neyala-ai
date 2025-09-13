'use client';

import React from 'react';
import ESimDashboard from '@/components/ESimDashboard';
import { breezesimConfig, marketStats } from '@/lib/breezesim-config';

export default function AffiliatePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Affiliate Dashboard</h1>
          <p className="text-gray-600">
            Track your {breezesimConfig.programName} performance and earnings
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Market Opportunity:</strong> {marketStats.growthPrediction}
            </p>
            <p className="text-xs text-blue-600 mt-1">Source: {marketStats.source}</p>
          </div>
        </div>
        
        <ESimDashboard />
        
        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">How It Works</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Share Your Link</p>
                  <p className="text-sm text-gray-600">Use your unique affiliate link to promote BreezeSim eSIMs</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Track Performance</p>
                  <p className="text-sm text-gray-600">Monitor clicks, conversions, and earnings in real-time</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Earn Commissions</p>
                  <p className="text-sm text-gray-600">Get paid for every successful eSIM purchase</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Support & Resources</h3>
            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-800">Contact Support</p>
                <p className="text-sm text-gray-600">{breezesimConfig.supportEmail}</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">Commission Options</p>
                <div className="text-sm text-gray-600 space-y-1">
                  {Object.entries(breezesimConfig.commissionOptions).map(([key, option]) => (
                    <div key={key} className="flex justify-between">
                      <span>{option.name}</span>
                      <span className="font-medium">{option.commission}% commission</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-800">Payment Information</p>
                <p className="text-sm text-gray-600">
                  Payments: {breezesimConfig.paymentInfo.paymentDate}<br/>
                  Minimum: ${breezesimConfig.paymentInfo.minimumPayment}<br/>
                  Methods: {breezesimConfig.paymentInfo.paymentMethods.join(', ')}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-800">Marketing Guidelines</p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Do:</strong> Disclose affiliate relationship, follow brand guidelines</p>
                  <p><strong>Don't:</strong> Mislead customers, advertise directly on paid ads</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
