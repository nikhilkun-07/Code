import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Pizza, Plus, Star, ShoppingCart } from "lucide-react";
import { URL } from "../service/url";
import { useCart } from "../context/CartContext";

const Dashboard = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchPizzas();
  }, []);

  const fetchPizzas = async () => {
    try {
      const { data } = await axios.get(`${URL}/api/pizzas`);
      setPizzas(data.pizzas || []);
    } catch (error) {
      console.error("Error fetching pizzas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (pizza) => {
    addToCart({
      pizzaId: pizza._id,
      name: pizza.name,
      price: pizza.price,
      image: pizza.image,
      selectedOptions: {
        base: pizza.base,
        sauce: pizza.sauce,
        cheese: pizza.cheese,
        veggies: pizza.veggies,
        meat: pizza.meat
      }
    });
  };

  const popularPizzas = pizzas.slice(0, 3).map(pizza => ({
    ...pizza,
    image: pizza.image || "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&h=400&fit=crop"
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Delicious Pizzas 🍕
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Choose from our menu or build your own perfect pizza.
          </p>
          <Link
            to="/build-pizza"
            className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-5 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Build Custom Pizza</span>
          </Link>
        </header>

        {popularPizzas.length > 0 && (
          <section className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 text-center sm:text-left">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center sm:justify-start">
                <Star className="h-8 w-8 text-yellow-500 mr-2" />
                Popular Choices
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularPizzas.map((pizza) => (
                <div
                  key={pizza._id}
                  className="bg-white rounded-lg shadow hover:shadow-lg border border-gray-100 transition-transform transform hover:-translate-y-1 duration-300"
                >
                  <img
                    src={pizza.image}
                    alt={pizza.name}
                    className="w-full h-56 object-cover rounded-t-lg"
                  />
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {pizza.name}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">{pizza.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">
                        ₹{pizza.price}
                      </span>
                      <button 
                        onClick={() => handleAddToCart(pizza)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center sm:text-left">
            All Pizzas
          </h2>

          {pizzas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {pizzas.map((pizza) => (
                <div
                  key={pizza._id}
                  className="bg-white rounded-lg shadow hover:shadow-lg border border-gray-100 transition-transform transform hover:-translate-y-1 duration-300 p-6"
                >
                  {pizza.image ? (
                    <img 
                      src={pizza.image} 
                      alt={pizza.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="flex justify-center mb-4">
                      <Pizza className="h-20 w-20 text-blue-600" />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                    {pizza.name}
                  </h3>
                  {pizza.description && (
                    <p className="text-gray-600 text-sm mb-4 text-center">{pizza.description}</p>
                  )}
                  <div className="text-sm text-gray-600 mb-4 space-y-1 text-center">
                    <p>
                      <strong>Base:</strong> {pizza.base}
                    </p>
                    <p>
                      <strong>Sauce:</strong> {pizza.sauce}
                    </p>
                    <p>
                      <strong>Cheese:</strong> {pizza.cheese}
                    </p>
                    {pizza.veggies && pizza.veggies.length > 0 && (
                      <p>
                        <strong>Veggies:</strong> {pizza.veggies.join(", ")}
                      </p>
                    )}
                    {pizza.meat && pizza.meat.length > 0 && (
                      <p>
                        <strong>Meat:</strong> {pizza.meat.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{pizza.price}
                    </span>
                    <button 
                      onClick={() => handleAddToCart(pizza)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Pizza className="h-24 w-24 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">
                No pizzas available at the moment.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;