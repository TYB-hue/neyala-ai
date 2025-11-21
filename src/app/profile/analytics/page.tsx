'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Users, Eye, MousePointerClick, Globe, Calendar } from 'lucide-react';

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  pageViews: Array<{
    path: string;
    views: number;
  }>;
  topReferrers: Array<{
    source: string;
    views: number;
  }>;
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    // Note: In a real implementation, you would fetch this from Google Analytics API
    // For now, we'll show instructions on how to view analytics
    setLoading(false);
  }, [dateRange]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Website Analytics</h1>
          <p className="text-gray-600">
            Track your website traffic, visitor behavior, and performance metrics
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <BarChart3 className="h-6 w-6 text-blue-600 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                View Analytics in Google Analytics
              </h3>
              <p className="text-blue-800 mb-4">
                Your website is now tracking visitors with Google Analytics 4. To view detailed analytics:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <li>Go to <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">analytics.google.com</a></li>
                <li>Sign in with your Google account</li>
                <li>Select your property (your website)</li>
                <li>Navigate to <strong>Reports</strong> to see visitor data</li>
              </ol>
              <div className="mt-4 p-4 bg-white rounded border border-blue-200">
                <p className="text-sm text-gray-700">
                  <strong>Key Metrics You Can Track:</strong>
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-600">
                  <li>Total visitors and sessions</li>
                  <li>Page views and popular pages</li>
                  <li>Visitor demographics (location, device, browser)</li>
                  <li>Traffic sources (search, direct, social media)</li>
                  <li>User behavior flow and engagement</li>
                  <li>Conversion events (button clicks, form submissions)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Eye className="h-8 w-8 text-blue-600" />
              <span className="text-sm text-gray-500">Total Views</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">—</p>
            <p className="text-sm text-gray-500 mt-2">Check Google Analytics</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-green-600" />
              <span className="text-sm text-gray-500">Unique Visitors</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">—</p>
            <p className="text-sm text-gray-500 mt-2">Check Google Analytics</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <MousePointerClick className="h-8 w-8 text-purple-600" />
              <span className="text-sm text-gray-500">Click Events</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">—</p>
            <p className="text-sm text-gray-500 mt-2">Check Google Analytics</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Globe className="h-8 w-8 text-orange-600" />
              <span className="text-sm text-gray-500">Traffic Sources</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">—</p>
            <p className="text-sm text-gray-500 mt-2">Check Google Analytics</p>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Setup Instructions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">1. Create Google Analytics Account</h3>
              <p className="text-gray-600 text-sm mb-2">
                If you don't have a Google Analytics account yet:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-4">
                <li>Visit <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">analytics.google.com</a></li>
                <li>Click "Start measuring"</li>
                <li>Create an account (your website name)</li>
                <li>Set up a property (your website URL)</li>
                <li>Copy your <strong>Measurement ID</strong> (starts with G-)</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">2. Add Measurement ID to Environment</h3>
              <p className="text-gray-600 text-sm mb-2">
                Add your Google Analytics Measurement ID to your <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> file:
              </p>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">3. Restart Your Application</h3>
              <p className="text-gray-600 text-sm">
                After adding the environment variable, restart your development server or redeploy your VPS to start tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Alternative: Simple Analytics Dashboard */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Alternative: Simple Analytics</h2>
          <p className="text-gray-600 mb-4">
            For a simpler, privacy-friendly analytics solution, consider:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li><strong>Plausible Analytics</strong> - Privacy-friendly, GDPR compliant</li>
            <li><strong>Umami</strong> - Open-source, self-hosted analytics</li>
            <li><strong>Posthog</strong> - Product analytics with user tracking</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
