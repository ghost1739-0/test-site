import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import { Coupon } from "../models/Coupon.js";
import { seedProducts } from "../data/seedProducts.js";

export async function seedDatabase() {
  await Promise.all([
    Product.createCollection(),
    User.createCollection(),
    Order.createCollection(),
    Coupon.createCollection(),
  ]);

  const productCount = await Product.countDocuments();

  if (productCount === 0) {
    await Product.insertMany(seedProducts);
    console.log(`Seeded ${seedProducts.length} products.`);
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await User.create({
        name: process.env.ADMIN_NAME || "Admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });
      console.log(`Seeded admin user: ${adminEmail}`);
    }
  }

  const couponCount = await Coupon.countDocuments();
  if (couponCount === 0) {
    await Coupon.insertMany([
      {
        code: "WELCOME10",
        discountType: "percent",
        discountValue: 10,
        minOrderAmount: 500,
        maxDiscountAmount: 500,
        isActive: true,
      },
      {
        code: "SAVE250",
        discountType: "fixed",
        discountValue: 250,
        minOrderAmount: 2000,
        isActive: true,
      },
    ]);
    console.log("Seeded default coupons.");
  }
}
