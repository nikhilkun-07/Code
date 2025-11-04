import express from 'express';
import { getPizzas, createPizza, updatePizza, deletePizza, togglePizzaStatus } from '../controllers/pizzaController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadPizza } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getPizzas);
router.post('/', protect, admin,uploadPizza.single('file'), createPizza);
router.put('/:id', protect, admin,uploadPizza.single('file'), updatePizza);
router.delete('/:id', protect, admin, deletePizza);
router.delete('/:id', protect, admin, deletePizza);
router.patch('/:id/toggle-status', protect, admin, togglePizzaStatus);

export default router;
