import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, X, Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import axios from 'axios';
import { URL } from '../service/url';
import toast from 'react-hot-toast';

const Cart = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isOpen) return null;

  const handleClearCart = () => {
    toast((t) => (
      <div className="text-center">
        <p className="font-semibold mb-3">Clear all items from cart?</p>
        <div className="flex justify-center space-x-3">
          <button
            onClick={() => {
              clearCart();
              toast.dismiss(t.id);
              toast.success('Cart cleared');
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Yes, Clear
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
    });
  };

  return (
    <div className="fixed inset-0  z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <ShoppingCart className="h-6 w-6" />
            <span>Your Cart ({cartItems.length})</span>
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-600">Your cart is empty</p>
            <button 
              onClick={onClose}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="p-4">
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-blue-600 font-bold">₹{item.price}</p>
                      {item.selectedOptions && (
                        <div className="text-sm text-gray-600 mt-1">
                          {item.selectedOptions.base && <p><strong>Base:</strong> {item.selectedOptions.base}</p>}
                          {item.selectedOptions.sauce && <p><strong>Sauce:</strong> {item.selectedOptions.sauce}</p>}
                          {item.selectedOptions.cheese && <p><strong>Cheese:</strong> {item.selectedOptions.cheese}</p>}
                          {item.selectedOptions.veggies && item.selectedOptions.veggies.length > 0 && (
                            <p><strong>Veggies:</strong> {item.selectedOptions.veggies.join(', ')}</p>
                          )}
                          {item.selectedOptions.meat && item.selectedOptions.meat.length > 0 && (
                            <p><strong>Meat:</strong> {item.selectedOptions.meat.join(', ')}</p>
                          )}
                          {!item.pizzaId && (
                            <p className="text-green-600 text-xs mt-1">✓ Custom Pizza</p>
                          )}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => {
                        removeFromCart(item.id);
                        toast.success('Item removed from cart');
                      }}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="font-semibold">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>₹{getCartTotal()}</span>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Proceed to Checkout</span>
                </button>
                <button 
                  onClick={handleClearCart}
                  className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {showCheckout && (
          <CheckoutModal 
            onClose={() => setShowCheckout(false)}
            onOrderSuccess={() => {
              clearCart();
              setShowCheckout(false);
              onClose();
            }}
            cartItems={cartItems}
            totalAmount={getCartTotal()}
          />
        )}
      </div>
    </div>
  );
};

const CheckoutModal = ({ onClose, onOrderSuccess, cartItems, totalAmount }) => {
  const { clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    specialInstructions: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        pizzas: cartItems.map(item => ({
          pizzaId: item.pizzaId || null,
          quantity: item.quantity,
          customName: item.name,
          selectedOptions: item.selectedOptions || {},
          price: item.price
        })),
        totalPrice: totalAmount,
        paymentInfo: {
          method: 'card',
          status: 'paid',
          transactionId: `TXN-${Date.now()}`
        },
        deliveryAddress: {
          street: customerInfo.address,
          city: customerInfo.city,
          state: customerInfo.state,
          zipCode: customerInfo.zipCode,
          phone: customerInfo.phone
        },
        specialInstructions: customerInfo.specialInstructions
      };

      const response = await axios.post(`${URL}/api/orders`, orderData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data.message === 'Order placed successfully') {
        toast.success('Order placed successfully!');
        onOrderSuccess();
      } else {
        throw new Error(response.data.message || 'Failed to place order');
     
      }
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to place order. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0  z-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
          <h3 className="text-lg font-semibold">Checkout</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={customerInfo.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={customerInfo.phone}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+91XXXXXXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <textarea
              name="address"
              required
              value={customerInfo.address}
              onChange={handleInputChange}
              rows="3"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="House No., Street, Area"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                required
                value={customerInfo.city}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                name="state"
                required
                value={customerInfo.state}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code *
            </label>
            <input
              type="text"
              name="zipCode"
              required
              value={customerInfo.zipCode}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Instructions
            </label>
            <textarea
              name="specialInstructions"
              value={customerInfo.specialInstructions}
              onChange={handleInputChange}
              rows="2"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any special instructions for delivery..."
            />
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Order Summary</h4>
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between text-sm mb-1">
                <div>
                  <span className="font-medium">{item.name}</span>
                  {!item.pizzaId && <span className="text-green-600 text-xs ml-2">(Custom)</span>}
                  <span> x {item.quantity}</span>
                </div>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="flex justify-between font-semibold text-lg mt-2 pt-2 border-t">
              <span>Total Amount:</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <CreditCard className="h-5 w-5" />
              <span>{loading ? 'Placing Order...' : 'Place Order & Pay'}</span>
            </button>
            
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>You will be redirected to payment gateway after order confirmation</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Cart;