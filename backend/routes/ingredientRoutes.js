import express from 'express';
import { 
  createIngredient, 
  getIngredients, 
  getIngredientsByCategory, 
  deleteIngredient, 
  updateIngredient 
} from '../controllers/ingredientController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadIngredient } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getIngredients); 
router.get('/:category', getIngredientsByCategory); 

router.post('/', protect, admin, uploadIngredient.single('file'), createIngredient);
router.put('/:id', protect, admin,uploadIngredient.single('file'), updateIngredient);
router.delete('/:id', protect, admin, deleteIngredient);

export default router;
