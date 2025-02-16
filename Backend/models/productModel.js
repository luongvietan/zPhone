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
  { _id: false }
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
  { _id: false }
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
    variants: [variantSchema],
    comments: [commentSchema],
    reviews: [reviewSchema], // Thêm trường reviews
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
