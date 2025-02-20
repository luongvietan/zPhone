const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: {
    type: String,
    enum: ["global", "product", "brand", "category"],
    required: true,
  },
  discountValue: { type: Number, required: true },
  applicableTo: {
    type: { type: String }, // Loại áp dụng (product_id, brand_id, category_id)
    id: { type: mongoose.Schema.Types.ObjectId, default: null }, // ID của sản phẩm, thương hiệu, hoặc danh mục
  },
  expiryDate: { type: Date, required: true },
  usageLimit: { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
});

module.exports = mongoose.model("Voucher", voucherSchema);
