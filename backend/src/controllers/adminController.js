import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import { User } from "../models/User.js";
import { Coupon } from "../models/Coupon.js";

export async function createProduct(req, res) {
  const product = await Product.create(req.body);
  res.status(201).json(product);
}

export async function updateProduct(req, res) {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updated);
}

export async function deleteProduct(req, res) {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  await product.deleteOne();
  res.status(200).json({ message: "Product deleted" });
}

export async function getDashboardStats(req, res) {
  const [userCount, productCount, orderCount, orders, lowStockProducts] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.find({}),
    Product.find({ $expr: { $lte: ["$stock", "$lowStockThreshold"] } }).limit(10),
  ]);

  const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const paidOrders = orders.filter((order) => order.paymentStatus === "paid").length;

  res.status(200).json({
    users: userCount,
    products: productCount,
    orders: orderCount,
    paidOrders,
    totalSales,
    lowStockProducts,
  });
}

export async function getStockAlerts(req, res) {
  const products = await Product.find({
    $expr: { $lte: ["$stock", "$lowStockThreshold"] },
  }).sort("stock");

  res.status(200).json(products);
}

export async function createCoupon(req, res) {
  const payload = {
    ...req.body,
    code: String(req.body.code || "").toUpperCase(),
  };

  const coupon = await Coupon.create(payload);
  res.status(201).json(coupon);
}

export async function listCoupons(req, res) {
  const coupons = await Coupon.find({}).sort("-createdAt");
  res.status(200).json(coupons);
}

export async function updateCoupon(req, res) {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found.");
  }

  res.status(200).json(coupon);
}

export async function deleteCoupon(req, res) {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found.");
  }

  await coupon.deleteOne();
  res.status(200).json({ message: "Coupon deleted" });
}
