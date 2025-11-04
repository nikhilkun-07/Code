import { Link } from 'react-router-dom';
import { 
  Shield, 
  BarChart3, 
  Users, 
  Award, 
  Target,
  Globe,
  Heart
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Target className="h-8 w-8 text-blue-600" />,
      title: "Our Mission",
      description: "To provide pizza store owners with the most efficient and intuitive management platform that drives growth and operational excellence."
    },
    {
      icon: <Globe className="h-8 w-8 text-green-600" />,
      title: "Our Vision",
      description: "To become the leading pizza store management platform globally, empowering thousands of businesses to thrive in the digital age."
    },
    {
      icon: <Heart className="h-8 w-8 text-red-600" />,
      title: "Our Values",
      description: "We believe in innovation, reliability, and building lasting partnerships with our customers through exceptional service."
    }
  ];

  const milestones = [
    { year: "2020", event: "Platform Launch", description: "Started with basic inventory management" },
    { year: "2021", event: "100+ Stores", description: "Onboarded over 100 pizza stores nationwide" },
    { year: "2022", event: "Advanced Analytics", description: "Launched real-time business intelligence" },
    { year: "2023", event: "Mobile App", description: "Released iOS and Android management apps" },
    { year: "2024", event: "AI Integration", description: "Integrated predictive analytics and AI insights" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About PizzaDeliver Management
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              We're revolutionizing how pizza stores operate, providing powerful tools that simplify management while maximizing profitability.
            </p>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6 text-lg">
                Founded by restaurant industry veterans, PizzaDeliver Management was born from a simple observation: 
                pizza store owners were spending more time on administrative tasks than on what they do best - creating amazing food.
              </p>
              <p className="text-gray-600 mb-6 text-lg">
                We set out to change that by building a comprehensive platform that handles everything from inventory management 
                to customer analytics, allowing store owners to focus on growth and customer satisfaction.
              </p>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Trusted by 500+ Stores</p>
                  <p className="text-gray-600">Across 3 countries</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <Shield className="h-5 w-5" />
                  <span>Enterprise-grade security</span>
                </li>
                <li className="flex items-center space-x-3">
                  <BarChart3 className="h-5 w-5" />
                  <span>Real-time analytics</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Users className="h-5 w-5" />
                  <span>Dedicated support team</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values & Mission</h2>
            <p className="text-gray-600 text-lg">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-gray-600 text-lg">Milestones in our growth story</p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-blue-200 h-full"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center w-full ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="w-1/2 pr-8">
                    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.event}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full border-4 border-white z-10"></div>
                  <div className="w-1/2 pl-8">
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Join the hundreds of pizza store owners who trust us with their business operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
            >
              Start Free Trial
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;