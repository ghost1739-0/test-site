import express from "express";
import {
  approveOrderCancellation,
  approveOrderReturn,
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  requestOrderCancellation,
  requestOrderReturn,
  rejectOrderReturn,
  updateTracking,
  updateOrderToDelivered,
} from "../controllers/orderController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(asyncHandler(protect), asyncHandler(createOrder));
router.route("/admin/all").get(asyncHandler(protect), asyncHandler(adminOnly), asyncHandler(getAllOrders));
router.route("/mine").get(asyncHandler(protect), asyncHandler(getMyOrders));
router.route("/:id").get(asyncHandler(protect), asyncHandler(getOrderById));
router.route("/:id/deliver").put(asyncHandler(protect), asyncHandler(adminOnly), asyncHandler(updateOrderToDelivered));
router.route("/:id/tracking").put(asyncHandler(protect), asyncHandler(adminOnly), asyncHandler(updateTracking));
router.route("/:id/cancel-request").post(asyncHandler(protect), asyncHandler(requestOrderCancellation));
router.route("/:id/cancel-approve").put(asyncHandler(protect), asyncHandler(adminOnly), asyncHandler(approveOrderCancellation));
router.route("/:id/return-request").post(asyncHandler(protect), asyncHandler(requestOrderReturn));
router.route("/:id/return-approve").put(asyncHandler(protect), asyncHandler(adminOnly), asyncHandler(approveOrderReturn));
router.route("/:id/return-reject").put(asyncHandler(protect), asyncHandler(adminOnly), asyncHandler(rejectOrderReturn));

export default router;
