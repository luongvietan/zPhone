const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product_id: {
    type: Number,
    required: true,
  },
  product_name: {
    type: String,
    required: true,
  },
  storage: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  product_image: String,
});

const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

// Tính tổng giá trị đơn hàng
cartSchema.methods.calculateTotal = function () {
  return this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};

module.exports = mongoose.model("Cart", cartSchema);
