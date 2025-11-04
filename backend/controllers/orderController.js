import Order from '../models/Order.js';
import Pizza from '../models/Pizza.js';
import sendEmail from '../utils/sendEmail.js';

export const createOrder = async (req, res) => {
  try {
    const { pizzas, totalPrice, paymentInfo, deliveryAddress, specialInstructions } = req.body;

    if (!pizzas || pizzas.length === 0) {
      return res.status(400).json({ message: 'No pizzas provided' });
    }

    const enhancedPizzas = await Promise.all(
      pizzas.map(async (pizzaItem) => {
        if (!pizzaItem.pizzaId) {
          return {
            pizzaId: null,
            quantity: pizzaItem.quantity || 1,
            customName: pizzaItem.customName || 'Custom Pizza',
            selectedOptions: pizzaItem.selectedOptions || {},
            price: pizzaItem.price || 0
          };
        }

        const pizza = await Pizza.findById(pizzaItem.pizzaId);
        if (!pizza) {
          if (pizzaItem.selectedOptions) {
            return {
              pizzaId: null,
              quantity: pizzaItem.quantity || 1,
              customName: pizzaItem.customName || 'Custom Pizza',
              selectedOptions: pizzaItem.selectedOptions,
              price: pizzaItem.price || 0
            };
          }
          throw new Error(`Pizza with ID ${pizzaItem.pizzaId} not found`);
        }

        return {
          pizzaId: pizzaItem.pizzaId,
          quantity: pizzaItem.quantity || 1,
          customName: pizzaItem.customName || pizza.name,
          selectedOptions: pizzaItem.selectedOptions || {},
          price: pizzaItem.price || pizza.price
        };
      })
    );

    const calculatedTotalPrice = totalPrice || enhancedPizzas.reduce((sum, pizza) => {
      return sum + (pizza.price * pizza.quantity);
    }, 0);

    const order = await Order.create({
      user: req.user._id,
      pizzas: enhancedPizzas,
      totalPrice: calculatedTotalPrice,
      paymentInfo: {
        method: paymentInfo?.method || 'cash',
        status: paymentInfo?.status || 'pending',
        transactionId: paymentInfo?.transactionId,
        paidAt: paymentInfo?.status === 'paid' ? new Date() : null
      },
      deliveryAddress,
      specialInstructions,
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000), 
      status: 'Placed'
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('pizzas.pizzaId', 'name price image')
      .populate('user', 'name email');

    if (process.env.ADMIN_EMAIL) {
      await sendEmail({
        email: process.env.ADMIN_EMAIL,
        subject: 'New Order Placed',
        message: `New order #${order._id} placed by ${req.user.name}. Total: ₹${calculatedTotalPrice}`,
      });
    }

    res.status(201).json({ 
      message: 'Order placed successfully', 
      order: populatedOrder 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error creating order', 
      error: err.message 
    });
  }
};

export const getOrdersForUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('pizzas.pizzaId', 'name price image description')
      .sort('-createdAt');

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error fetching orders', 
      error: err.message 
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('pizzas.pizzaId', 'name price image')
      .sort('-createdAt');

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error fetching orders', 
      error: err.message 
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Placed', 'Received', 'In Kitchen', 'Out for Delivery', 'Delivered', 'Cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ') 
      });
    }

    const order = await Order.findById(req.params.id)
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    if (status === 'Delivered' && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    await order.save();
    if (order.user && order.user.email) {
      await sendEmail({
        email: order.user.email,
        subject: `Order Status Updated - #${order._id}`,
        message: `Your order #${order._id} status has been updated to: ${status}`,
      });
    }

    res.json({ 
      message: 'Order status updated successfully', 
      order 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error updating order status', 
      error: err.message 
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('pizzas.pizzaId', 'name price image description base sauce cheese veggies meat');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ order });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error fetching order', 
      error: err.message 
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (['Delivered', 'Cancelled'].includes(order.status)) {
      return res.status(400).json({ 
        message: `Cannot cancel order with status: ${order.status}` 
      });
    }

    order.status = 'Cancelled';
    await order.save();

    if (process.env.ADMIN_EMAIL) {
      await sendEmail({
        email: process.env.ADMIN_EMAIL,
        subject: `Order Cancelled - #${order._id}`,
        message: `Order #${order._id} has been cancelled by user ${req.user.name}`,
      });
    }

    res.json({ 
      message: 'Order cancelled successfully', 
      order 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error cancelling order', 
      error: err.message 
    });
  }
};
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, transactionId, method } = req.body;


    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ 
        message: 'Invalid payment status. Must be one of: ' + validPaymentStatuses.join(', ') 
      });
    }

    const validPaymentMethods = ['card', 'upi', 'cash', 'wallet'];
    if (method && !validPaymentMethods.includes(method)) {
      return res.status(400).json({ 
        message: 'Invalid payment method. Must be one of: ' + validPaymentMethods.join(', ') 
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (paymentStatus) {
      order.paymentInfo.status = paymentStatus;
    }
    
    if (method) {
      order.paymentInfo.method = method;
    }
    
    if (transactionId) {
      order.paymentInfo.transactionId = transactionId;
    }

    if (paymentStatus === 'paid' && !order.paymentInfo.paidAt) {
      order.paymentInfo.paidAt = new Date();
    }

    if (paymentStatus === 'failed' && order.paymentInfo.paidAt) {
      order.paymentInfo.paidAt = null;
    }

    await order.save();

    if (order.user && order.user.email) {
      await sendEmail({
        email: order.user.email,
        subject: `Payment Status Updated - Order #${order._id}`,
        message: `Payment status for your order #${order._id} has been updated to: ${order.paymentInfo.status}. Method: ${order.paymentInfo.method}`,
      });
    }

    res.json({ 
      message: 'Payment status updated successfully', 
      order 
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Error updating payment status', 
      error: err.message 
    });
  }
};