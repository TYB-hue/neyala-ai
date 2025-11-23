export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Help Center</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">How do I create a travel itinerary with the AI travel planner?</h3>
                <p className="text-gray-600">
                  Simply go to the "Plan Trip" page, enter your destination, travel dates, and preferences. 
                  Our AI travel planner will generate a personalized AI travel itinerary for you in seconds.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Can I save my itineraries?</h3>
                <p className="text-gray-600">
                  Yes! You can save your itineraries by clicking the "Save Itinerary" button on any itinerary page. 
                  Your saved trips will appear in your profile history.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">How do I add attractions to my collections?</h3>
                <p className="text-gray-600">
                  Click the heart icon on any attraction card to add it to your collections. 
                  You can view your saved attractions in your profile.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Is my data secure?</h3>
                <p className="text-gray-600">
                  Absolutely. We use industry-standard encryption to protect your personal information 
                  and travel data. Your privacy is our top priority.
                </p>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Still need help?</h3>
              <p className="text-blue-700">
                Contact us at <a href="mailto:nyala.trip@gmail.com" className="underline hover:text-blue-900">nyala.trip@gmail.com</a> 
                and we'll get back to you within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
