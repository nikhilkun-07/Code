import express from 'express';
import { createOrder, getOrdersForUser, getAllOrders, updateOrderStatus, updatePaymentStatus, getOrderById, cancelOrder } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getOrdersForUser);
router.get('/:id', protect, getOrderById);
router.patch('/:id/cancel', protect, cancelOrder);


router.get('/', protect, admin, getAllOrders);
router.patch('/:id/status', protect, admin, updateOrderStatus);
router.patch('/:id/payment', protect, admin, updatePaymentStatus);

export default router;
