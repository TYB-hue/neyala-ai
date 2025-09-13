export default function TestCSSPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          CSS Test Page
        </h1>
        <div className="space-y-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <p className="text-blue-800 font-medium">Blue background test</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-green-800 font-medium">Green background test</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg">
            <p className="text-red-800 font-medium">Red background test</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <p className="text-yellow-800 font-medium">Yellow background test</p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            If you can see colored boxes with proper styling, CSS is working!
          </p>
        </div>
      </div>
    </div>
  );
}
