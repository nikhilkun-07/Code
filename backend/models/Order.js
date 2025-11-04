import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },

    // ✅ Multiple pizzas support - both predefined and custom
    pizzas: [
      {
        pizzaId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Pizza',
          required: false, // Made optional for custom pizzas
        },
        quantity: { 
          type: Number, 
          default: 1,
          min: 1
        },
        customName: String, // For custom pizzas from pizza builder
        selectedOptions: {
          base: String,
          sauce: String,
          cheese: String,
          veggies: [String],
          meat: [String],
          price: Number
        }, // Stores all customization for pizza builder
        price: { type: Number, required: true } // individual pizza price at time of order
      },
    ],

    totalPrice: { 
      type: Number, 
      required: true,
      min: 0
    },
    
    paymentInfo: { 
      method: { type: String, enum: ['card', 'upi', 'cash', 'wallet'], default: 'cash' },
      status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
      transactionId: String,
      paidAt: Date
    },
    
    status: {
      type: String,
      enum: [
        'Placed',
        'Received',
        'In Kitchen',
        'Out for Delivery',
        'Delivered',
        'Cancelled',
      ],
      default: 'Placed',
    },
    
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      phone: String
    },
    
    // Order notes from customer
    specialInstructions: String,
    
    // Estimated delivery time
    estimatedDelivery: Date,
    
    // Actual delivery time
    deliveredAt: Date
  },
  { timestamps: true }
);

// Add index for better query performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;