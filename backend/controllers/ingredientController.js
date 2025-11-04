import Ingredient from '../models/Ingredient.js';
import cloudinary from '../config/cloudinary.js';


export const createIngredient = async (req, res) => {
  try {
    const { name, category, price } = req.body;
    let imageUrl = req.body.image;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'pizza_ingredients',
      });
      imageUrl = uploadResult.secure_url;
    }

    const exist = await Ingredient.findOne({ name, category });
    if (exist) {
      return res.status(400).json({ message: 'Ingredient already exists' });
    }
    const ingredient = await Ingredient.create({ name, category, price, image: imageUrl });
    res.status(201).json({ message: 'Ingredient added', ingredient });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort('category name');
    res.json({ ingredients });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getIngredientsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const ingredients = await Ingredient.find({ category }).sort('name');
    res.json({ ingredients });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const ingredient = await Ingredient.findByIdAndDelete(id);
    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }
    res.json({ message: 'Ingredient deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateIngredient = async (req, res) => {
  try {
    const { id } = req.params;
  

    let updateData = { ...req.body };

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'pizza_ingredients',
      });
      updateData.image = uploadResult.secure_url;
    }

    const ingredient = await Ingredient.findByIdAndUpdate(id, updateData, { new: true });
    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }
    res.json({ message: 'Ingredient updated', ingredient });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
