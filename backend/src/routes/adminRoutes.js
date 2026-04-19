import express from "express";
import {
  createCoupon,
  createProduct,
  deleteCoupon,
  deleteProduct,
  getDashboardStats,
  getStockAlerts,
  listCoupons,
  updateCoupon,
  updateProduct,
} from "../controllers/adminController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/products").post(asyncHandler(protect), asyncHandler(adminOnly), asyncHandler(createProduct));
router
  .route("/products/:id")
  .put(asyncHandler(protect), asyncHandler(adminOnly), asyncHandler(updateProduct))
  .delete(asyncHandler(protect), asyncHandler(adminOnly), asyncHandler(deleteProduct));

router.route("/stats").get(asyncHandler(protect), asyncHandler(adminOnly), asyncHandler(getDashboardStats));
router.route("/stock-alerts").get(asyncHandler(protect), asyncHandler(adminOnly), asyncHandler(getStockAlerts));

router
  .route("/coupons")
  .get(asyncHandler(protect), asyncHandler(adminOnly), asyncHandler(listCoupons))
  .post(asyncHandler(protect), asyncHandler(adminOnly), asyncHandler(createCoupon));

router
  .route("/coupons/:id")
  .put(asyncHandler(protect), asyncHandler(adminOnly), asyncHandler(updateCoupon))
  .delete(asyncHandler(protect), asyncHandler(adminOnly), asyncHandler(deleteCoupon));

export default router;
