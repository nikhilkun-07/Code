import Pizza from '../models/Pizza.js';
import cloudinary from '../config/cloudinary.js';

export const getPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find({ isActive: true }).sort('name');
    res.json({ pizzas });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find().sort('name');
    res.json({ pizzas });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createPizza = async (req, res) => {
  try {
    const { name, base, sauce, cheese, veggies, meat, price, description } = req.body;
    let imageUrl = req.body.image; 
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'pizza_images',
      });
      imageUrl = uploadResult.secure_url;
    }

    const exist = await Pizza.findOne({ name });
    if (exist) {
      return res.status(400).json({ message: 'Pizza with this name already exists' });
    }

    const pizza = await Pizza.create({ 
      name, 
      base, 
      sauce, 
      cheese, 
      veggies: veggies ? JSON.parse(veggies) : [],
      meat: meat ? JSON.parse(meat) : [],
      price, 
      image: imageUrl,
      description 
    });
    res.status(201).json({ message: 'Pizza created successfully', pizza });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePizza = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };
    if (updateData.veggies) {
      updateData.veggies = JSON.parse(updateData.veggies);
    }
    if (updateData.meat) {
      updateData.meat = JSON.parse(updateData.meat);
    }
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'pizza_images',
      });
      updateData.image = uploadResult.secure_url;
      console.log('✅ New image uploaded:', updateData.image);
    }

    const pizza = await Pizza.findByIdAndUpdate(id, updateData, { new: true });
    if (!pizza) {
      return res.status(404).json({ message: 'Pizza not found' });
    }
    res.json({ message: 'Pizza updated successfully', pizza });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePizza = async (req, res) => {
  try {
    const { id } = req.params;

    const pizza = await Pizza.findByIdAndDelete(id);
    if (!pizza) {
      return res.status(404).json({ message: 'Pizza not found' });
    }

    res.json({ message: 'Pizza deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const togglePizzaStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const pizza = await Pizza.findById(id);
    if (!pizza) {
      return res.status(404).json({ message: 'Pizza not found' });
    }

    pizza.isActive = !pizza.isActive;
    await pizza.save();

    res.json({ 
      message: `Pizza ${pizza.isActive ? 'activated' : 'deactivated'} successfully`, 
      pizza 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPizzaById = async (req, res) => {
  try {
    const { id } = req.params;

    const pizza = await Pizza.findById(id);
    if (!pizza) {
      return res.status(404).json({ message: 'Pizza not found' });
    }

    res.json({ pizza });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};