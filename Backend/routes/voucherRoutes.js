// routes/voucherRoutes.js
const express = require("express");
const router = express.Router();
const voucherController = require("../controllers/voucherController");

// Tạo voucher mới
router.post("/", voucherController.createVoucher);

// Lấy danh sách voucher
router.get("/", voucherController.getVouchers);

// Lấy thông tin voucher theo ID
router.get("/:id", voucherController.getVoucherById);

// Cập nhật voucher
router.put("/:id", voucherController.updateVoucher);

// Xóa voucher
router.delete("/:id", voucherController.deleteVoucher);

module.exports = router;
