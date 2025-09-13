'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Globe, Activity, BarChart3, Info, ExternalLink } from 'lucide-react';
import { breezesimConfig, marketStats } from '@/lib/breezesim-config';

interface AffiliateStats {
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  conversionRate: number;
  topDestinations: Array<{
    destination: string;
    clicks: number;
    conversions: number;
  }>;
  recentActivity: Array<{
    timestamp: string;
    action: string;
    destination: string;
    planId: string;
  }>;
}

export default function ESimDashboard() {
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in production, this would fetch from your analytics service
    const mockStats: AffiliateStats = {
      totalClicks: 1247,
      totalConversions: 89,
      totalRevenue: 1247.50,
      conversionRate: 7.1,
      topDestinations: [
        { destination: 'Paris, France', clicks: 156, conversions: 12 },
        { destination: 'Tokyo, Japan', clicks: 134, conversions: 9 },
        { destination: 'New York, USA', clicks: 98, conversions: 7 },
        { destination: 'London, UK', clicks: 87, conversions: 6 },
        { destination: 'Rome, Italy', clicks: 76, conversions: 5 }
      ],
      recentActivity: [
        {
          timestamp: '2024-01-15T10:30:00Z',
          action: 'click',
          destination: 'Paris, France',
          planId: 'global-3gb-30days'
        },
        {
          timestamp: '2024-01-15T09:15:00Z',
          action: 'conversion',
          destination: 'Tokyo, Japan',
          planId: 'global-1gb-7days'
        },
        {
          timestamp: '2024-01-15T08:45:00Z',
          action: 'click',
          destination: 'New York, USA',
          planId: 'global-5gb-30days'
        }
      ]
    };

    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6 w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Affiliate Dashboard</h2>
          <p className="text-gray-600">Unable to load statistics at the moment.</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{breezesimConfig.programName}</h2>
            <p className="text-gray-600">Performance Overview & Analytics</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Market Growth Alert */}
      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
        <div className="flex items-start space-x-3">
          <div className="bg-green-100 p-2 rounded-full">
            <span className="text-green-600 text-sm font-bold">📈</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-1">Market Opportunity</p>
            <p className="text-xs text-gray-600">{marketStats.growthPrediction}</p>
            <p className="text-xs text-gray-500 mt-1">Source: {marketStats.source}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Clicks</p>
              <p className="text-2xl font-bold text-blue-800">{stats.totalClicks.toLocaleString()}</p>
            </div>
            <div className="bg-blue-600 p-2 rounded-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Conversions</p>
              <p className="text-2xl font-bold text-green-800">{stats.totalConversions}</p>
            </div>
            <div className="bg-green-600 p-2 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Revenue</p>
              <p className="text-2xl font-bold text-purple-800">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="bg-purple-600 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Conversion Rate</p>
              <p className="text-2xl font-bold text-orange-800">{stats.conversionRate}%</p>
            </div>
            <div className="bg-orange-600 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Destinations */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-blue-600" />
            Top Destinations
          </h3>
          <div className="space-y-3">
            {stats.topDestinations.map((dest, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{dest.destination}</p>
                  <p className="text-sm text-gray-500">{dest.clicks} clicks</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{dest.conversions} conversions</p>
                  <p className="text-sm text-gray-500">
                    {((dest.conversions / dest.clicks) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-600" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="bg-white p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.action === 'conversion' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {activity.action}
                  </span>
                  <span className="text-sm text-gray-500">{formatDate(activity.timestamp)}</span>
                </div>
                <p className="font-medium text-gray-800">{activity.destination}</p>
                <p className="text-sm text-gray-500">Plan: {activity.planId}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Commission Options */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <Info className="w-4 h-4 mr-2 text-yellow-600" />
          Commission Options
        </h4>
        <div className="space-y-2">
          {Object.entries(breezesimConfig.commissionOptions).map(([key, option]) => (
            <div key={key} className="flex items-center justify-between p-2 bg-white rounded border">
              <span className="text-sm font-medium text-gray-800">{option.name}</span>
              <span className="text-sm text-blue-600 font-semibold">
                {option.commission}% commission
                {option.discount > 0 && `, ${option.discount}% discount`}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Configure your preferred commission structure in your BreezeSim dashboard
        </p>
      </div>

      {/* Affiliate Link */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Your Affiliate Link</h4>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value="https://breezesim.com?sca_ref=9513707.18mF6FIHVI"
            readOnly
            className="flex-1 p-2 border border-gray-300 rounded text-sm bg-white"
          />
          <button
            onClick={() => navigator.clipboard.writeText('https://breezesim.com?sca_ref=9513707.18mF6FIHVI')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
          >
            Copy
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Share this link to earn commissions on eSIM sales
        </p>
        <div className="mt-3 flex items-center space-x-4">
          <a 
            href={breezesimConfig.dashboardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-blue-600 hover:text-blue-700"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            BreezeSim Dashboard
          </a>
          <a 
            href={breezesimConfig.paymentInfo.paymentSettingsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-blue-600 hover:text-blue-700"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Payment Settings
          </a>
        </div>
      </div>
    </div>
  );
}
