import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — AI Travel Planner | Nyala',
  description: 'Terms of service for Nyala AI travel planner. Read our terms and conditions for using our free AI travel planner and travel planning app.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Acceptance of Terms</h2>
                <p className="text-gray-600">
                  By accessing and using Nyala, you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, 
                  please do not use this service.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Use License</h2>
                <p className="text-gray-600 mb-4">
                  Permission is granted to temporarily use Nyala for personal, non-commercial 
                  transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained on the website</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Service Description</h2>
                <p className="text-gray-600">
                  Nyala provides AI-powered travel planning services, including itinerary generation, 
                  attraction recommendations, and travel guidance. Our services are provided "as is" 
                  and we make no warranties regarding their accuracy or completeness.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Responsibilities</h2>
                <p className="text-gray-600 mb-4">As a user of our service, you agree to:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Use the service only for lawful purposes</li>
                  <li>Not interfere with or disrupt the service</li>
                  <li>Respect the intellectual property rights of others</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Limitation of Liability</h2>
                <p className="text-gray-600">
                  In no event shall Nyala or its suppliers be liable for any damages (including, 
                  without limitation, damages for loss of data or profit, or due to business interruption) 
                  arising out of the use or inability to use the materials on Nyala.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Modifications</h2>
                <p className="text-gray-600">
                  Nyala may revise these terms of service at any time without notice. By using this 
                  website, you are agreeing to be bound by the then current version of these terms of service.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
                <p className="text-gray-600">
                  If you have any questions about these Terms of Service, please contact us at{' '}
                  <a href="mailto:nyala.trip@gmail.com" className="text-blue-600 hover:underline">
                    nyala.trip@gmail.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
