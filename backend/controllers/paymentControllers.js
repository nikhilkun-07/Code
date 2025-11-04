import Order from '../models/Order.js';

export const demoPayment = async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = Math.random() > 0.1;
    
    if (success) {
      const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          'paymentInfo.status': 'paid',
          'paymentInfo.paidAt': new Date(),
          'paymentInfo.transactionId': paymentId
        });
      }
      
      res.json({
        success: true,
        message: 'Payment processed successfully',
        paymentId,
        amount,
        orderId
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment failed - Insufficient funds',
        amount
      });
    }
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Payment processing failed',
      error: err.message 
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const isValid = paymentId && paymentId.startsWith('PAY-');
    
    if (isValid) {
      res.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId,
        verifiedAt: new Date()
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payment ID'
      });
    }
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Payment verification failed' 
    });
  }
};