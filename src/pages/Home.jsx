import Hero from './components/Hero';
import Card from './components/Card';

export default function Home() {
  return (
    <div>
      <Hero />
      
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Why Choose Our Platform?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card
              title="AI-Powered Advice"
              description="Get personalized recommendations based on your crop type, location, and weather patterns."
              image="🤖"
              action="Learn More"
            />
            <Card
              title="Real-Time Monitoring"
              description="Track weather conditions and pest alerts in real-time for your farm."
              image="📊"
              action="Learn More"
            />
            <Card
              title="Expert Support"
              description="Connect with agricultural experts and get answers to your farming questions."
              image="👨‍🌾"
              action="Learn More"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
