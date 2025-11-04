import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { demoPayment, verifyPayment } from "../controllers/paymentControllers.js";

const router = express.Router();

router.post("/demo", protect, demoPayment);
router.post("/verify", protect, verifyPayment);

export default router;