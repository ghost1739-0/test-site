import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { Coupon } from "../models/Coupon.js";

function round2(value) {
  return Math.round(value * 100) / 100;
}

function calculateCouponDiscount(coupon, amount) {
  if (!coupon) {
    return 0;
  }

  if (coupon.discountType === "fixed") {
    return Math.min(amount, coupon.discountValue);
  }

  const percentDiscount = (amount * coupon.discountValue) / 100;
  if (coupon.maxDiscountAmount > 0) {
    return Math.min(percentDiscount, coupon.maxDiscountAmount);
  }

  return percentDiscount;
}

export async function createOrder(req, res) {
  const { orderItems, shippingAddress, paymentMethod, couponCode = "" } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items provided.");
  }

  if (!shippingAddress || !paymentMethod) {
    res.status(400);
    throw new Error("Shipping address and payment method are required.");
  }

  const productIds = orderItems.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds } });

  const enrichedItems = orderItems.map((item) => {
    const product = products.find((entry) => String(entry._id) === String(item.product));

    if (!product) {
      throw new Error(`Product not found for order item ${item.product}`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    return {
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      imageUrl: product.imageUrl,
    };
  });

  const itemsPrice = round2(
    enrichedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  let appliedCoupon = null;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: String(couponCode).toUpperCase(), isActive: true });

    if (!coupon) {
      res.status(400);
      throw new Error("Coupon not found or inactive.");
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      res.status(400);
      throw new Error("Coupon is expired.");
    }

    if (itemsPrice < coupon.minOrderAmount) {
      res.status(400);
      throw new Error(`Minimum order amount for this coupon is ${coupon.minOrderAmount}.`);
    }

    appliedCoupon = coupon;
  }

  const discountAmount = round2(calculateCouponDiscount(appliedCoupon, itemsPrice));
  const shippingPrice = itemsPrice > 5000 ? 0 : 99;
  const taxPrice = round2((itemsPrice - discountAmount) * 0.18);
  const totalPrice = round2(itemsPrice - discountAmount + shippingPrice + taxPrice);

  const order = await Order.create({
    user: req.user._id,
    orderItems: enrichedItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    couponCode: appliedCoupon?.code || "",
    discountAmount,
    isPaid: paymentMethod.toLowerCase() === "cash on delivery" ? false : true,
    paidAt: paymentMethod.toLowerCase() === "cash on delivery" ? undefined : new Date(),
    paymentStatus: paymentMethod.toLowerCase() === "cash on delivery" ? "pending" : "paid",
    isDelivered: false,
    trackingStatus: "processing",
  });

  await Promise.all(
    enrichedItems.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
    )
  );

  res.status(201).json(order);
}

export async function getMyOrders(req, res) {
  const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
  res.status(200).json(orders);
}

export async function getOrderById(req, res) {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  if (String(order.user._id) !== String(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view this order.");
  }

  res.status(200).json(order);
}

export async function getAllOrders(req, res) {
  const orders = await Order.find({}).populate("user", "name email").sort("-createdAt");
  res.status(200).json(orders);
}

export async function updateOrderToDelivered(req, res) {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  order.isDelivered = true;
  order.deliveredAt = new Date();
  order.trackingStatus = "delivered";
  await order.save();

  res.status(200).json(order);
}

export async function updateTracking(req, res) {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  const { trackingNumber, shippingCarrier, trackingStatus } = req.body;

  if (typeof trackingNumber !== "undefined") {
    order.trackingNumber = trackingNumber;
  }
  if (typeof shippingCarrier !== "undefined") {
    order.shippingCarrier = shippingCarrier;
  }
  if (typeof trackingStatus !== "undefined") {
    order.trackingStatus = trackingStatus;

    if (trackingStatus === "delivered") {
      order.isDelivered = true;
      order.deliveredAt = order.deliveredAt || new Date();
    } else {
      order.isDelivered = false;
      order.deliveredAt = undefined;
    }
  }

  await order.save();
  res.status(200).json(order);
}

export async function requestOrderCancellation(req, res) {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  if (String(order.user) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Not authorized to cancel this order.");
  }

  if (order.isDelivered) {
    res.status(400);
    throw new Error("Delivered orders cannot be canceled.");
  }

  order.cancelRequested = true;
  order.cancelReason = req.body.reason || "User requested cancellation";

  await order.save();
  res.status(200).json({ message: "Cancellation request submitted.", order });
}

export async function approveOrderCancellation(req, res) {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  order.canceledAt = new Date();
  order.trackingStatus = "returned";
  order.paymentStatus = order.isPaid ? "refunded" : order.paymentStatus;

  await Promise.all(
    order.orderItems.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })
    )
  );

  await order.save();
  res.status(200).json({ message: "Order canceled and stock restored.", order });
}

export async function requestOrderReturn(req, res) {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  if (String(order.user) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Not authorized to return this order.");
  }

  if (!order.isDelivered) {
    res.status(400);
    throw new Error("Only delivered orders can be returned.");
  }

  order.returnRequested = true;
  order.returnReason = req.body.reason || "User requested return";
  await order.save();

  res.status(200).json({ message: "Return request submitted.", order });
}

export async function approveOrderReturn(req, res) {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found.");
  }

  order.returnedAt = new Date();
  order.trackingStatus = "returned";
  order.paymentStatus = order.isPaid ? "refunded" : order.paymentStatus;

  await Promise.all(
    order.orderItems.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })
    )
  );

  await order.save();

  res.status(200).json({ message: "Order return approved.", order });
}
