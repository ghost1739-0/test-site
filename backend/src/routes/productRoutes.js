import express from "express";
import { createProductReview, getProductById, getProducts } from "../controllers/productController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", asyncHandler(getProducts));
router.post("/:id/reviews", asyncHandler(protect), asyncHandler(createProductReview));
router.get("/:id", asyncHandler(getProductById));

export default router;
