const mongoose = require("mongoose");

const wishlistItemSchema = new mongoose.Schema(
  {
    product_id: {
      type: Number,
      required: true,
    },
    product_name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    product_image: {
      type: String,
    },
  },
  { _id: false }
);

const wishlistSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [wishlistItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
