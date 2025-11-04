import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Pizza,
  Check,
  ShoppingCart,
  ArrowLeft,
  ArrowRight,
  Loader,
  Plus,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import Cart from "../components/Cart";
const URL = import.meta.env.VITE_BACKEND_URL

const PizzaBuilder = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [ingredients, setIngredients] = useState({
    base: [],
    sauce: [],
    cheese: [],
    veggie: [],
    meat: [],
  });
  const [loading, setLoading] = useState(false);
  const [fetchingIngredients, setFetchingIngredients] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [pizza, setPizza] = useState({
    base: "",
    sauce: "",
    cheese: "",
    veggies: [],
    meat: [],
    price: 199,
  });

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const { data } = await axios.get(`${URL}/api/ingredients`);
      const categorized = {
        base: data.ingredients?.filter((ing) => ing.category === "base") || [],
        sauce:
          data.ingredients?.filter((ing) => ing.category === "sauce") || [],
        cheese:
          data.ingredients?.filter((ing) => ing.category === "cheese") || [],
        veggie:
          data.ingredients?.filter((ing) => ing.category === "veggie") || [],
        meat: data.ingredients?.filter((ing) => ing.category === "meat") || [],
      };
      setIngredients(categorized);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    } finally {
      setFetchingIngredients(false);
    }
  };

  const calculatePrice = (selections) => {
    let price = 199;

    if (selections.base) {
      const baseIngredient = ingredients.base.find(
        (b) => b.name === selections.base
      );
      price += baseIngredient?.price || 0;
    }

    if (selections.sauce) {
      const sauceIngredient = ingredients.sauce.find(
        (s) => s.name === selections.sauce
      );
      price += sauceIngredient?.price || 0;
    }

    if (selections.cheese) {
      const cheeseIngredient = ingredients.cheese.find(
        (c) => c.name === selections.cheese
      );
      price += cheeseIngredient?.price || 0;
    }

    selections.veggies.forEach((veggie) => {
      const veggieIngredient = ingredients.veggie.find(
        (v) => v.name === veggie
      );
      price += veggieIngredient?.price || 0;
    });

    selections.meat.forEach((meat) => {
      const meatIngredient = ingredients.meat.find((m) => m.name === meat);
      price += meatIngredient?.price || 0;
    });

    return price;
  };

  const handleBaseSelect = (base) => {
    const updatedPizza = { ...pizza, base };
    setPizza({ ...updatedPizza, price: calculatePrice(updatedPizza) });
    setCurrentStep(2);
  };

  const handleSauceSelect = (sauce) => {
    const updatedPizza = { ...pizza, sauce };
    setPizza({ ...updatedPizza, price: calculatePrice(updatedPizza) });
    setCurrentStep(3);
  };

  const handleCheeseSelect = (cheese) => {
    const updatedPizza = { ...pizza, cheese };
    setPizza({ ...updatedPizza, price: calculatePrice(updatedPizza) });
    setCurrentStep(4);
  };

  const handleVeggieToggle = (veggie) => {
    const updatedVeggies = pizza.veggies.includes(veggie)
      ? pizza.veggies.filter((v) => v !== veggie)
      : [...pizza.veggies, veggie];
    const updatedPizza = { ...pizza, veggies: updatedVeggies };
    setPizza({ ...updatedPizza, price: calculatePrice(updatedPizza) });
  };

  const handleMeatToggle = (meat) => {
    const updatedMeat = pizza.meat.includes(meat)
      ? pizza.meat.filter((m) => m !== meat)
      : [...pizza.meat, meat];
    const updatedPizza = { ...pizza, meat: updatedMeat };
    setPizza({ ...updatedPizza, price: calculatePrice(updatedPizza) });
  };

  const handleAddToCart = () => {
    setLoading(true);

    try {
      const cartItem = {
        pizzaId: null,
        name: "Custom Pizza",
        price: pizza.price,
        image: "/custom-pizza.jpg",
        selectedOptions: {
          base: pizza.base,
          sauce: pizza.sauce,
          cheese: pizza.cheese,
          veggies: pizza.veggies,
          meat: pizza.meat,
          price: pizza.price,
        },
      };

      addToCart(cartItem);

      setAddedToCart(true);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add pizza to cart");
    } finally {
      setLoading(false);
    }
  };

  const handleContinueBuilding = () => {
    setPizza({
      base: "",
      sauce: "",
      cheese: "",
      veggies: [],
      meat: [],
      price: 199,
    });
    setCurrentStep(1);
    setAddedToCart(false);
  };

 

  const handleContinueShopping = () => {

    navigate("/menu", { replace: true });
  };

  const renderIngredientButtons = (items, onSelect, selected) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((item) => (
        <button
          key={item._id}
          onClick={() => onSelect(item.name)}
          className={`p-4 rounded-lg text-left border-2 transition-all duration-300 hover:shadow-md ${
            selected === item.name
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex items-center space-x-3">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="h-12 w-12 object-cover rounded-lg"
              />
            )}
            <div>
              <h4 className="font-semibold text-gray-800">{item.name}</h4>
              <p className="text-blue-600 font-semibold">+₹{item.price}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );

  const renderToggleIngredientButtons = (items, selectedList, onToggle) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {items.map((item) => (
        <button
          key={item._id}
          onClick={() => onToggle(item.name)}
          className={`p-4 rounded-lg text-center border-2 transition-all duration-300 hover:shadow-md ${
            selectedList.includes(item.name)
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="h-10 w-10 object-cover rounded-lg"
              />
            )}
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold text-gray-800 text-sm">
                {item.name}
              </span>
              {selectedList.includes(item.name) && (
                <Check className="h-4 w-4 text-blue-600" />
              )}
            </div>
            <p className="text-blue-600 font-semibold text-sm">
              +₹{item.price}
            </p>
          </div>
        </button>
      ))}
    </div>
  );

  const renderContent = () => {
    if (fetchingIngredients) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader className="h-8 w-8 text-blue-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading ingredients...</span>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Choose Your Base
            </h3>
            {ingredients.base.length > 0 ? (
              renderIngredientButtons(
                ingredients.base,
                handleBaseSelect,
                pizza.base
              )
            ) : (
              <p className="text-gray-500 text-center py-8">
                No bases available
              </p>
            )}
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Choose Your Sauce
            </h3>
            {ingredients.sauce.length > 0 ? (
              renderIngredientButtons(
                ingredients.sauce,
                handleSauceSelect,
                pizza.sauce
              )
            ) : (
              <p className="text-gray-500 text-center py-8">
                No sauces available
              </p>
            )}
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Choose Your Cheese
            </h3>
            {ingredients.cheese.length > 0 ? (
              renderIngredientButtons(
                ingredients.cheese,
                handleCheeseSelect,
                pizza.cheese
              )
            ) : (
              <p className="text-gray-500 text-center py-8">
                No cheeses available
              </p>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Add Vegetables
              </h3>
              {ingredients.veggie.length > 0 ? (
                renderToggleIngredientButtons(
                  ingredients.veggie,
                  pizza.veggies,
                  handleVeggieToggle
                )
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No vegetables available
                </p>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Add Meat
              </h3>
              {ingredients.meat.length > 0 ? (
                renderToggleIngredientButtons(
                  ingredients.meat,
                  pizza.meat,
                  handleMeatToggle
                )
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No meat available
                </p>
              )}
            </div>


            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Your Custom Pizza
              </h3>
              <div className="space-y-2 text-gray-700 mb-6">
                <p>
                  <strong>Base:</strong> {pizza.base || "Not selected"}
                </p>
                <p>
                  <strong>Sauce:</strong> {pizza.sauce || "Not selected"}
                </p>
                <p>
                  <strong>Cheese:</strong> {pizza.cheese || "Not selected"}
                </p>
                {pizza.veggies.length > 0 && (
                  <p>
                    <strong>Veggies:</strong> {pizza.veggies.join(", ")}
                  </p>
                )}
                {pizza.meat.length > 0 && (
                  <p>
                    <strong>Meat:</strong> {pizza.meat.join(", ")}
                  </p>
                )}
                <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-blue-600">₹{pizza.price}</span>
                </div>
              </div>


              {addedToCart && (
                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                  <p className="font-semibold text-center">
                    ✓ Pizza added to cart!
                  </p>
                </div>
              )}


              <div className="space-y-4">
                {!addedToCart ? (
                  <>
                    <button
                      onClick={handleAddToCart}
                      disabled={
                        loading || !pizza.base || !pizza.sauce || !pizza.cheese
                      }
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>
                        {loading ? "Adding to Cart..." : "Add to Cart"}
                      </span>
                    </button>

                    <button
                      onClick={handleContinueShopping}
                      className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                      Continue Shopping
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={handleContinueBuilding}
                      className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Build Another</span>
                    </button>
                    <button
                      onClick={()=> setIsCartOpen(true)}
                      className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>View Cart</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const steps = ["Base", "Sauce", "Cheese", "Toppings"];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 flex justify-center items-center">
            <Pizza className="h-8 w-8 text-blue-600 mr-2" />
            Build Your Pizza
          </h1>
          <p className="text-gray-600">
            Create your perfect pizza step by step
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                    currentStep >= step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  } font-semibold`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-8 sm:w-12 h-1 ${
                      currentStep > step ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex justify-between mb-6 text-sm text-gray-600 px-4">
          {steps.map((label, i) => (
            <span
              key={i}
              className={`${
                currentStep >= i + 1 ? "text-blue-600 font-semibold" : ""
              }`}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          {renderContent()}
        </div>

        {currentStep > 1 && currentStep < 4 && (
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={
                (currentStep === 1 && !pizza.base) ||
                (currentStep === 2 && !pizza.sauce) ||
                (currentStep === 3 && !pizza.cheese)
              }
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2 disabled:opacity-50"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default PizzaBuilder;
