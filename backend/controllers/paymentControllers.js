export const demoPayment = async (req, res) => {
  try {
    const { amount } = req.body;
    await new Promise(resolve => setTimeout(resolve, 1500));
    const paymentId = `DEMO-${Date.now()}`;

    res.json({
      success: true,
      message: 'Payment successful (demo)',
      paymentId,
      amount
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Demo payment failed' });
  }
};
