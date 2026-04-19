import express from "express";
import { validateCoupon } from "../controllers/couponController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/validate", asyncHandler(validateCoupon));

export default router;
