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
    product_quantity: {
      type: Number,
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
    brand_id: {
      type: Number,
      required: true,
    },
    category_id: {
      type: Number,
      required: true,
    },
    variants: {
      type: [variantSchema],
      required: true,
    },
  },
  { timestamps: true }
);

// Create the Product model
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
