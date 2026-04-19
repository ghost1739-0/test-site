import { User } from "../models/User.js";
import { Product } from "../models/Product.js";

export async function getWishlist(req, res) {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.status(200).json(user?.wishlist || []);
}

export async function toggleWishlist(req, res) {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found.");
  }

  const exists = user.wishlist.some((entry) => String(entry) === String(productId));
  if (exists) {
    user.wishlist = user.wishlist.filter((entry) => String(entry) !== String(productId));
  } else {
    user.wishlist.push(productId);
  }

  await user.save();

  const populated = await user.populate("wishlist");
  res.status(200).json({
    added: !exists,
    wishlist: populated.wishlist,
  });
}
