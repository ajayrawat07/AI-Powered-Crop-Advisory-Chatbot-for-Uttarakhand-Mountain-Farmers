export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-8">About Us</h1>
        
        <div className="prose prose-lg text-gray-600 space-y-6">
          <p>
            The AI Crop Advisory Chatbot is designed specifically for mountain farmers in Uttarakhand. 
            We leverage cutting-edge artificial intelligence and local agricultural expertise to provide 
            personalized farming recommendations.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-10">Our Mission</h2>
          <p>
            To empower mountain farmers with accessible, AI-driven agricultural intelligence that helps them 
            make better crop decisions while respecting local traditions and environmental sustainability.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-10">Why Uttarakhand?</h2>
          <p>
            Mountain agriculture faces unique challenges - altitude, terrain, and climate variations require 
            specialized knowledge. We've built our system with deep understanding of Uttarakhand's agricultural 
            ecosystem to provide truly relevant advice.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-10">Our Team</h2>
          <p>
            We're a dedicated team of agricultural scientists, software engineers, and local farming experts 
            committed to supporting farmers in mountain regions.
          </p>
        </div>
      </div>
    </div>
  );
}
