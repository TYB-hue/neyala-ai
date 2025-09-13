import { NextRequest, NextResponse } from 'next/server';
import { getAffiliateLink } from '@/lib/breezesim-config';

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

// Function to generate destination-specific eSIM data
function generateESimData(destination?: string): ESimData {
  return {
    provider: 'BreezeSim',
    plans: [
      {
        id: 'global-1gb-7days',
        name: 'Global 1GB',
        data: '1GB',
        validity: '7 days',
        price: 9.99,
        coverage: ['Global', '200+ Countries'],
        features: ['Instant activation', 'No physical SIM'],
        affiliateLink: getAffiliateLink('https://breezesim.com?sca_ref=9513707.18mF6FIHVI', destination, 'neyala-ai')
      },
      {
        id: 'global-3gb-30days',
        name: 'Global 3GB',
        data: '3GB',
        validity: '30 days',
        price: 24.99,
        coverage: ['Global', '200+ Countries'],
        features: ['Instant activation', 'No physical SIM', '24/7 support'],
        affiliateLink: getAffiliateLink('https://breezesim.com?sca_ref=9513707.18mF6FIHVI', destination, 'neyala-ai')
      },
      {
        id: 'global-5gb-30days',
        name: 'Global 5GB',
        data: '5GB',
        validity: '30 days',
        price: 34.99,
        coverage: ['Global', '200+ Countries'],
        features: ['Instant activation', 'No physical SIM', '24/7 support', 'Priority customer service'],
        affiliateLink: getAffiliateLink('https://breezesim.com?sca_ref=9513707.18mF6FIHVI', destination, 'neyala-ai')
      }
    ],
  globalFeatures: [
    'No physical SIM required',
    'Instant activation',
    '24/7 customer support',
    'Flexible data plans',
    'Secure connection',
    'Works in 200+ countries',
    'No roaming fees',
    'Easy setup'
  ],
  supportEmail: 'affiliates@breezesim.com'
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get('destination');
    const planId = searchParams.get('plan');

    // Track the request for analytics
    const trackingData = {
      destination,
      planId,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    };

    console.log('eSIM API request:', trackingData);

    // Generate destination-specific eSIM data
    const eSimData = generateESimData(destination || undefined);
    
    // Return filtered data based on parameters
    let responseData = {
      ...eSimData,
      plans: planId 
        ? eSimData.plans.filter(plan => plan.id === planId)
        : eSimData.plans
    };

    return NextResponse.json({
      success: true,
      data: responseData,
      tracking: trackingData
    });

  } catch (error) {
    console.error('eSIM API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch eSIM data'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, destination, planId, userAgent, referer } = body;

    // Track affiliate actions
    const trackingData = {
      action, // 'click', 'copy', 'view'
      destination,
      planId,
      timestamp: new Date().toISOString(),
      userAgent,
      referer,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    };

    console.log('eSIM affiliate action:', trackingData);

    // In production, you would send this to your analytics service
    // For now, we'll just log it
    if (action === 'click') {
      console.log('Affiliate link clicked:', trackingData);
    }

    return NextResponse.json({
      success: true,
      message: 'Action tracked successfully',
      tracking: trackingData
    });

  } catch (error) {
    console.error('eSIM tracking error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to track action'
      },
      { status: 500 }
    );
  }
}
