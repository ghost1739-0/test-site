import path from "path";

export function uploadImage(req, res) {
  if (!req.file) {
    res.status(400);
    throw new Error("Image file is required.");
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(201).json({
    message: "Image uploaded successfully",
    fileUrl,
  });
}

export const imageFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowed = [".jpg", ".jpeg", ".png", ".webp"];

  if (!allowed.includes(ext)) {
    return cb(new Error("Only image files are allowed."));
  }

  return cb(null, true);
};
