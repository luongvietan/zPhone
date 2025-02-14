const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  items: [
    {
      product_id: {
        type: Number,
        required: true,
      },
      product_name: String,
      storage: String,
      price: Number,
      quantity: Number,
      product_image: String,
    },
  ],
  transactionId: {
    type: String,
    required: true,
    unique: true, // Thêm unique
    index: true, // Thêm index
  },
  amount: Number,
  subtotal: Number,
  shipping: Number,
  total: Number,
  status: {
    type: String,
    default: "pending",
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
