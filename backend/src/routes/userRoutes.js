import express from "express";
import { getWishlist, toggleWishlist } from "../controllers/userController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/wishlist", asyncHandler(protect), asyncHandler(getWishlist));
router.post("/wishlist/:productId", asyncHandler(protect), asyncHandler(toggleWishlist));

export default router;
