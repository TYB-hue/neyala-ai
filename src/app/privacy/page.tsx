export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
                <p className="text-gray-600 mb-4">
                  We collect information you provide directly to us, such as when you create an account, 
                  plan a trip, or contact us for support.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Account information (name, email address)</li>
                  <li>Travel preferences and itinerary data</li>
                  <li>Communication preferences</li>
                  <li>Usage data and analytics</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Your Information</h2>
                <p className="text-gray-600 mb-4">We use the information we collect to:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Provide and improve our travel planning services</li>
                  <li>Generate personalized itineraries</li>
                  <li>Communicate with you about your account and our services</li>
                  <li>Analyze usage patterns to enhance user experience</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Security</h2>
                <p className="text-gray-600">
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. Your data is encrypted 
                  both in transit and at rest.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Rights</h2>
                <p className="text-gray-600 mb-4">You have the right to:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and data</li>
                  <li>Opt out of marketing communications</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
                <p className="text-gray-600">
                  If you have any questions about this Privacy Policy, please contact us at{' '}
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
