import express from "express";
import { createStripeCheckoutSession } from "../controllers/paymentController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-checkout-session", asyncHandler(protect), asyncHandler(createStripeCheckoutSession));

export default router;
