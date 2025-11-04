import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  BarChart3, 
  Users, 
  Pizza, 
  Package, 
  DollarSign, 
  Shield,
  TrendingUp,
  CheckCircle2,
  Store,
  ChefHat
} from 'lucide-react'

const Home = () => {
  const { user } = useAuth()

  const features = [
    {
      icon: <Store className="h-12 w-12 text-blue-600" />,
      title: "Business Management",
      description: "Complete control over your pizza store operations and inventory"
    },
    {
      icon: <BarChart3 className="h-12 w-12 text-blue-600" />,
      title: "Real-time Analytics",
      description: "Monitor sales, track performance, and make data-driven decisions"
    },
    {
      icon: <Package className="h-12 w-12 text-blue-600" />,
      title: "Inventory Control",
      description: "Manage ingredients, track stock levels, and prevent shortages"
    },
    {
      icon: <Users className="h-12 w-12 text-blue-600" />,
      title: "Customer Insights",
      description: "Understand customer preferences and optimize your menu offerings"
    }
  ]

  const stats = [
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" },
    { number: "1000+", label: "Stores Managed" },
    { number: "₹10M+", label: "Monthly Revenue" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-gray-900 to-blue-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-3 rounded-full">
              <Shield className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Pizza Store Management
            <span className="block text-blue-400 text-3xl md:text-4xl mt-2">
              Professional Control Panel
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-4xl mx-auto">
            Streamline your pizza business operations with powerful management tools, real-time analytics, and complete inventory control.
          </p>
          {user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user.role === 'admin' ? (
                <Link
                  to="/admin"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition flex items-center shadow-lg"
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Open Admin Dashboard
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
                >
                  Browse Menu
                </Link>
              )}
              <Link
                to="/about"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-900 transition"
              >
                Learn More
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/login"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition flex items-center"
              >
                <Shield className="h-5 w-5 mr-2" />
                Admin Login
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-900 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Business Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to efficiently manage your pizza store, from inventory to customer relationships.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-center mb-6">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-blue-50 rounded-2xl p-8 md:p-12">
            <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of successful pizza store owners who use our platform to streamline operations and boost profitability.
            </p>
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
                >
                  Start Free Trial
                </Link>
                <Link
                  to="/contact"
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition"
                >
                  Schedule Demo
                </Link>
              </div>
            ) : user.role === 'admin' ? (
              <Link
                to="/admin"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg inline-flex items-center"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                Access Management Console
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
              >
                Continue to Store
              </Link>
            )}
          </div>
        </div>
      </section>


      <section className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 text-left">
              <h3 className="text-xl font-bold mb-2">Need Enterprise Solutions?</h3>
              <p className="text-gray-400">Custom integrations and dedicated support for multi-store operations.</p>
            </div>
            <Link
              to="/contact"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition whitespace-nowrap"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home