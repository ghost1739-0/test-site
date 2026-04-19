import { Coupon } from "../models/Coupon.js";

function calculateDiscount(coupon, amount) {
  if (coupon.discountType === "fixed") {
    return Math.min(amount, coupon.discountValue);
  }

  const raw = (amount * coupon.discountValue) / 100;
  if (coupon.maxDiscountAmount > 0) {
    return Math.min(raw, coupon.maxDiscountAmount);
  }

  return raw;
}

export async function validateCoupon(req, res) {
  const { code, amount } = req.body;

  if (!code || typeof amount === "undefined") {
    res.status(400);
    throw new Error("Coupon code and amount are required.");
  }

  const coupon = await Coupon.findOne({ code: String(code).toUpperCase() });

  if (!coupon || !coupon.isActive) {
    res.status(404);
    throw new Error("Coupon not found or inactive.");
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    res.status(400);
    throw new Error("Coupon is expired.");
  }

  if (Number(amount) < coupon.minOrderAmount) {
    res.status(400);
    throw new Error(`Minimum order amount is ${coupon.minOrderAmount}.`);
  }

  const discount = Math.round(calculateDiscount(coupon, Number(amount)) * 100) / 100;

  res.status(200).json({
    code: coupon.code,
    discount,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
  });
}
