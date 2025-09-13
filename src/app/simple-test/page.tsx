'use client';

import React, { useState, useEffect } from 'react';

export default function SimpleTestPage() {
  const [testData, setTestData] = useState({
    destination: 'Shanghai',
    startDate: '2025-09-01',
    endDate: '2025-09-05',
    travelGroup: '2 adults'
  });

  const [apiResult, setApiResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    try {
      console.log('Testing API with data:', testData);
      
      const response = await fetch('/api/hotels-async', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const data = await response.json();
      console.log('API Result:', data);
      setApiResult(data);
    } catch (error) {
      console.error('API Error:', error);
      setApiResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testApi();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Simple API Test</h1>
        
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Data:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm">
            {JSON.stringify(testData, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">API Result:</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Testing API...</p>
            </div>
          ) : (
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {JSON.stringify(apiResult, null, 2)}
            </pre>
          )}
        </div>

        <div className="mt-6">
          <button 
            onClick={testApi}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Test API Again
          </button>
        </div>
      </div>
    </div>
  );
}
