import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const createStorage = (folderName) => new CloudinaryStorage({
  cloudinary,
  params: {
    folder: folderName, 
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

export const uploadIngredient = multer({ storage: createStorage('pizza_ingredients') });
export const uploadPizza = multer({ storage: createStorage('pizzas') });
