import express from "express";
import multer from "multer";
import path from "path";
import { uploadImage, imageFileFilter } from "../controllers/uploadController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename(req, file, cb) {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname.replace(/\s+/g, "-")}`);
  },
});

const upload = multer({
  storage,
  fileFilter: imageFileFilter,
});

router.post("/", asyncHandler(protect), asyncHandler(adminOnly), upload.single("image"), asyncHandler(uploadImage));

export default router;
