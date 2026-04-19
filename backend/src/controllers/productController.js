import { Product } from "../models/Product.js";

export async function getProducts(req, res) {
  const {
    category,
    minPrice,
    maxPrice,
    search,
    page = 1,
    limit = 12,
    sort = "-createdAt",
  } = req.query;

  const query = {};

  if (category) {
    query.category = category;
  }

  if (typeof minPrice !== "undefined" || typeof maxPrice !== "undefined") {
    query.price = {};
    if (typeof minPrice !== "undefined") {
      query.price.$gte = Number(minPrice);
    }
    if (typeof maxPrice !== "undefined") {
      query.price.$lte = Number(maxPrice);
    }
  }

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const currentPage = Math.max(Number(page), 1);
  const perPage = Math.min(Math.max(Number(limit), 1), 100);
  const skip = (currentPage - 1) * perPage;

  const [products, total] = await Promise.all([
    Product.find(query).sort(sort).skip(skip).limit(perPage),
    Product.countDocuments(query),
  ]);

  res.status(200).json({
    data: products,
    pagination: {
      total,
      page: currentPage,
      pages: Math.ceil(total / perPage),
      limit: perPage,
    },
  });
}

export async function getProductById(req, res) {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  res.status(200).json(product);
}

export async function createProductReview(req, res) {
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    res.status(400);
    throw new Error("Rating and comment are required.");
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }

  const alreadyReviewed = product.reviews.find(
    (review) => String(review.user) === String(req.user._id)
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You already reviewed this product.");
  }

  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });

  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
    product.reviews.length;

  await product.save();

  res.status(201).json({ message: "Review added successfully." });
}
