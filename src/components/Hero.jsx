import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-green-50 to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Smart Crop Advisory for Mountain Farmers
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get AI-powered personalized farming advice tailored to Uttarakhand's unique mountain climate and terrain.
            </p>
            <Link
              to="/dashboard"
              className="inline-block px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-lg"
            >
              Get Started →
            </Link>
          </div>

          {/* Image/Icon */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-sm h-64 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-6xl">🌱</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
