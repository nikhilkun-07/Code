import React, { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, Wallet, Shield, CheckCircle, XCircle, Loader, Copy, DollarSign } from 'lucide-react';
import axios from 'axios';

import toast from 'react-hot-toast';
const URL = import.meta.env.VITE_VITE_BACKEND_URL

const PaymentModal = ({ isOpen, onClose, amount, orderId, paymentMethod, onPaymentSuccess }) => {
  const [step, setStep] = useState('details');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    upiId: '',
    cashAmount: '',
    wallet: ''
  });

  const wallets = [
    'Paytm',
    'PhonePe',
    'Google Pay',
    'Amazon Pay',
    'MobiKwik'
  ];

  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setPaymentData({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        nameOnCard: '',
        upiId: '',
        cashAmount: amount.toString(),
        wallet: ''
      });
    }
  }, [isOpen, amount]);

  const fillSampleData = () => {
    const sampleData = {
      cardNumber: '4111 1111 1111 1111',
      expiryDate: '12/25',
      cvv: '123',
      nameOnCard: 'John Doe',
      upiId: 'john.doe@okhdfcbank',
      cashAmount: amount.toString(),
      wallet: 'Paytm'
    };
    setPaymentData(sampleData);
    toast.success('Sample payment data filled!');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length <= 19) {
        setPaymentData(prev => ({ ...prev, [name]: formattedValue }));
      }
    } else if (name === 'expiryDate') {
      const formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue.length <= 5) {
        setPaymentData(prev => ({ ...prev, [name]: formattedValue }));
      }
    } else if (name === 'cvv') {
      if (value.length <= 3 && /^\d*$/.test(value)) {
        setPaymentData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'cashAmount') {
      if (/^\d*\.?\d*$/.test(value)) {
        setPaymentData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setPaymentData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (paymentMethod === 'cash') {
        await axios.patch(`${URL}/api/orders/${orderId}/payment`, {
          paymentStatus: 'paid',
          method: 'cash'
        });
        
        setStep('success');
        toast.success('Cash order confirmed successfully!');
        setTimeout(() => {
          onPaymentSuccess(`CASH-${Date.now()}`);
        }, 2000);
      } else {
        const response = await axios.post(`${URL}/api/payment/demo`, {
          amount,
          orderId,
          paymentMethod
        });

        if (response.data.success) {
          setStep('success');
          toast.success('Payment processed successfully!');
          setTimeout(() => {
            onPaymentSuccess(response.data.paymentId);
          }, 2000);
        } else {
          setStep('failed');
          toast.error('Payment failed. Please try again.');
        }
      }
    } catch (error) {
      setStep('failed');
      console.log(error);
      toast.error('Payment processing failed.');
    } finally {
      setLoading(false);
    }
  };

  const retryPayment = () => {
    setStep('details');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (!isOpen) return null;

  const isFormValid = () => {
    switch (paymentMethod) {
      case 'card':
        return paymentData.cardNumber.replace(/\s/g, '').length === 16 &&
               paymentData.expiryDate.length === 5 &&
               paymentData.cvv.length === 3 &&
               paymentData.nameOnCard.trim().length > 0;
      case 'upi':
        return paymentData.upiId.includes('@') && paymentData.upiId.length > 5;
      case 'cash':
        return parseFloat(paymentData.cashAmount) >= amount;
      case 'wallet':
        return paymentData.wallet.trim().length > 0;
      default:
        return false;
    }
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard('4111 1111 1111 1111')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name on Card
              </label>
              <input
                type="text"
                name="nameOnCard"
                value={paymentData.nameOnCard}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        );

      case 'upi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UPI ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="upiId"
                  value={paymentData.upiId}
                  onChange={handleInputChange}
                  placeholder="yourname@upi"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard('test.user@okhdfcbank')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                You will be redirected to your UPI app to complete the payment.
              </p>
            </div>
          </div>
        );

      case 'cash':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount to Pay
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="text"
                  name="cashAmount"
                  value={paymentData.cashAmount}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-8"
                  required
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Please keep exact change ready for the delivery executive.
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                <strong>Cash on Delivery:</strong> Pay when you receive your order. No online payment required.
              </p>
            </div>
          </div>
        );

      case 'wallet':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Wallet
              </label>
              <select
                name="wallet"
                value={paymentData.wallet}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Choose your wallet</option>
                {wallets.map(wallet => (
                  <option key={wallet} value={wallet}>{wallet}</option>
                ))}
              </select>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                You will be redirected to your wallet app to complete the payment.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getPaymentIcon = () => {
    switch (paymentMethod) {
      case 'card': return CreditCard;
      case 'upi': return Smartphone;
      case 'cash': return DollarSign;
      case 'wallet': return Wallet;
      default: return CreditCard;
    }
  };

  const getButtonText = () => {
    switch (paymentMethod) {
      case 'cash': return `Confirm Cash Order`;
      case 'card': 
      case 'upi': 
      case 'wallet': 
      default: return `Pay ₹${amount}`;
    }
  };

  const PaymentIcon = getPaymentIcon();

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <PaymentIcon className="h-5 w-5" />
            <span>
              {paymentMethod === 'cash' ? 'Cash on Delivery' : `Secure Payment - ${paymentMethod.toUpperCase()}`}
            </span>
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 'details' && (
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Order Amount:</span>
                  <span className="text-2xl font-bold text-blue-600">₹{amount}</span>
                </div>
                <div className="flex items-center text-sm text-blue-600">
                  <Shield className="h-4 w-4 mr-1" />
                  <span>
                    {paymentMethod === 'cash' 
                      ? 'Pay when you receive your order' 
                      : 'This is a demo payment. No real transaction will occur.'
                    }
                  </span>
                </div>
              </div>

              {paymentMethod !== 'cash' && (
                <button
                  type="button"
                  onClick={fillSampleData}
                  className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                >
                  Fill Sample Payment Data
                </button>
              )}

              {renderPaymentForm()}

              {paymentMethod !== 'cash' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <div className="flex-1">
                      <p className="text-sm text-yellow-800">
                        <strong>Demo Payment Notice:</strong> Payment will randomly succeed (90%) or fail (10%) for testing.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading || !isFormValid()}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <PaymentIcon className="h-4 w-4" />
                      <span>{getButtonText()}</span>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800">
                {paymentMethod === 'cash' ? 'Order Confirmed!' : 'Payment Successful!'}
              </h4>
              <p className="text-gray-600">
                {paymentMethod === 'cash' 
                  ? `Your cash order of ₹${amount} has been confirmed.`
                  : `Your payment of ₹${amount} has been processed successfully.`
                }
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  {paymentMethod === 'cash'
                    ? 'Please keep exact change ready for the delivery executive.'
                    : 'Order is being prepared. You will receive a confirmation shortly.'
                  }
                </p>
              </div>
              <button
                onClick={() => onPaymentSuccess()}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Continue
              </button>
            </div>
          )}

          {step === 'failed' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <XCircle className="h-16 w-16 text-red-500" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800">
                {paymentMethod === 'cash' ? 'Order Failed' : 'Payment Failed'}
              </h4>
              <p className="text-gray-600">
                {paymentMethod === 'cash'
                  ? 'We couldn\'t process your order. Please try again.'
                  : 'We couldn\'t process your payment. Please try again.'
                }
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  {paymentMethod === 'cash'
                    ? 'Please check your details and try again.'
                    : 'This is a demo. In real scenario, check your payment details.'
                  }
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={retryPayment}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;