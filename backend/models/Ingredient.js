import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['base', 'sauce', 'cheese', 'veggie', 'meat'], 
    required: true 
  },
  price: { type: Number, required: true },
  image: { type: String }, 
}, { timestamps: true });

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
export default Ingredient;
