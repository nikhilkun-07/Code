import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingCart, X, Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import CheckoutModal from './CheckoutModal';

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
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30  z-50 flex justify-end">
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

export default Cart;