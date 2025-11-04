import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { X, CreditCard, Wallet, Smartphone,  DollarSign } from 'lucide-react';
import axios from 'axios';

import toast from 'react-hot-toast';
import PaymentModal from './PaymentModal';
const URL = import.meta.env.VITE_VITE_BACKEND_URL

const CheckoutModal = ({ onClose, onOrderSuccess, cartItems, totalAmount }) => {
  const { clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [orderData, setOrderData] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    specialInstructions: ''
  });

  const paymentMethods = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Pay with Visa, Mastercard, or RuPay'
  },
  {
    id: 'upi',
    name: 'UPI',
    icon: Smartphone,
    description: 'Pay using UPI apps'
  },
  {
    id: 'cash',
    name: 'Cash on Delivery',
    icon: DollarSign,
    description: 'Pay when you receive your order'
  },
  {
    id: 'wallet',
    name: 'Wallet',
    icon: Wallet,
    description: 'Paytm, PhonePe, etc.'
  }
];
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
          method: selectedPaymentMethod,
          status: 'pending',
          transactionId: null
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

      const response = await axios.post(`${URL}/api/orders`, orderData);
      
      if (response.data.message === 'Order placed successfully') {
        setOrderData({
          orderId: response.data.order._id,
          amount: totalAmount,
          paymentMethod: selectedPaymentMethod
        });
        setShowPayment(true);
      } else {
        throw new Error(response.data.message || 'Failed to create order');
      }
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create order. Please try again.';
      console.log(err)
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    clearCart();
    onOrderSuccess();
    toast.success('Order completed successfully!');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fillSampleData = () => {
    setCustomerInfo({
      name: 'John Doe',
      phone: '9876543210',
      address: '123 Main Street, Downtown',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      specialInstructions: 'Please ring the bell twice'
    });
    toast.success('Sample data filled!');
  };

  const isFormValid = 
    customerInfo.name.trim() &&
    customerInfo.phone.trim() &&
    customerInfo.address.trim() &&
    customerInfo.city.trim() &&
    customerInfo.state.trim() &&
    customerInfo.zipCode.trim();

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
            <h3 className="text-lg font-semibold">Checkout</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">Delivery Information</h4>
                
                <button
                  type="button"
                  onClick={fillSampleData}
                  className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  Fill Sample Data (For Testing)
                </button>

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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any special instructions for delivery..."
                  />
                </div>
              </div>

              {/* Payment Method & Order Summary */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">Payment Method</h4>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedPaymentMethod === method.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <method.icon className={`h-5 w-5 ${
                            selectedPaymentMethod === method.id ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{method.name}</div>
                            <div className="text-sm text-gray-600">{method.description}</div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedPaymentMethod === method.id
                              ? 'bg-blue-500 border-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedPaymentMethod === method.id && (
                              <div className="w-2 h-2 bg-white rounded-full m-auto" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-4">Order Summary</h4>
                  <div className="space-y-3">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{item.name}</div>
                          {!item.pizzaId && (
                            <div className="text-green-600 text-xs">Custom Pizza</div>
                          )}
                          <div className="text-gray-600 text-xs">Qty: {item.quantity}</div>
                        </div>
                        <div className="text-sm font-medium">₹{item.price * item.quantity}</div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-4 pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Amount:</span>
                      <span className="text-blue-600">₹{totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4 border-t">
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="flex-1 bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg font-semibold"
              >
                <CreditCard className="h-5 w-5" />
                <span>{loading ? 'Creating Order...' : `Pay ₹${totalAmount}`}</span>
              </button>
              
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-8 bg-gray-200 text-gray-800 py-4 rounded-lg hover:bg-gray-300 disabled:opacity-50 text-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {showPayment && orderData && (
        <PaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          amount={orderData.amount}
          orderId={orderData.orderId}
          paymentMethod={orderData.paymentMethod}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};

export default CheckoutModal;