const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const verifyToken = require("../middleware/verifyToken");

// Lấy giỏ hàng
router.get("/", verifyToken, cartController.getCart);

// Thêm vào giỏ hàng
router.post("/add", verifyToken, cartController.addToCart);

// Cập nhật số lượng
router.put("/update", verifyToken, cartController.updateCartItem);

// Xóa sản phẩm khỏi giỏ
router.delete("/remove", verifyToken, cartController.removeFromCart);

// Xóa toàn bộ giỏ hàng
router.delete("/clear", verifyToken, cartController.clearCart);

module.exports = router;
