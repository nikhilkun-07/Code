import express from "express";
import { demoPayment } from "../controllers/paymentControllers.js";
const router = express.Router();

router.post("/demo", demoPayment);

export default router;
