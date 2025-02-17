const mongoose = require("mongoose");

// Define variant schema
const variantSchema = new mongoose.Schema(
  {
    storage: {
      type: String,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_sku: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

// Define comment schema
const commentSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

// Define review schema
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

// Define product schema
const productSchema = new mongoose.Schema(
  {
    product_id: {
      type: Number,
      required: true,
      unique: true,
    },
    product_name: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
      required: true,
    },
    product_image: {
      type: [String],
      required: true,
    },
    stock_quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    brand_id: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5], // Chỉ cho phép giá trị từ 1 đến 5
    },
    category: {
      type: Number,
      required: true,
      enum: [1, 2], // Chỉ cho phép giá trị từ 1 đến 2
    },
    variants: [variantSchema],
    comments: [commentSchema],
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
