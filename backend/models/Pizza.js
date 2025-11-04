import mongoose from 'mongoose';

const pizzaSchema = new mongoose.Schema({
  name: { type: String, default: 'Custom Pizza' },
  base: { type: String, required: true },
  sauce: { type: String, required: true },
  cheese: { type: String, required: true },
  veggies: [{ type: String }],
  meat: [{ type: String }],
  price: { type: Number, required: true },
  image: { type: String }, 
  description: { type: String }, 
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Pizza = mongoose.model('Pizza', pizzaSchema);
export default Pizza;