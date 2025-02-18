const mongoose = require("mongoose");

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
      type: String,
      required: true,
    },
    category_id: {
      type: String,
      required: true,
    },
    variants: [
      {
        storage: String,
        product_price: Number,
        product_sku: String,
      },
    ],
    comments: [
      {
        user: String,
        content: String,
        createdAt: Date,
      },
    ],
    reviews: [
      {
        user: String,
        review: String,
        rating: Number,
        createdAt: Date,
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
