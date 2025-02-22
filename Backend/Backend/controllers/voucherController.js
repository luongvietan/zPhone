const Voucher = require("../models/voucherModel");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

// Tạo voucher mới
exports.createVoucher = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let {
      code,
      discountType,
      discountValue,
      applicableTo,
      expiryDate,
      usageLimit,
      usedCount,
    } = req.body;

    // Kiểm tra xem voucher code đã tồn tại chưa
    const existingVoucher = await Voucher.findOne({ code });
    if (existingVoucher) {
      return res.status(400).json({ message: "Voucher code already exists" });
    }

    // Xử lý applicableTo.id (nếu tồn tại và không rỗng)
    if (applicableTo?.id) {
      if (/^[a-f\d]{24}$/i.test(applicableTo.id)) {
        applicableTo.id = new mongoose.Types.ObjectId(applicableTo.id);
      } else {
        return res
          .status(400)
          .json({ message: "Invalid applicableTo.id format" });
      }
    } else {
      delete applicableTo.id; // Xóa nếu rỗng
    }

    const newVoucher = new Voucher({
      code,
      discountType,
      discountValue,
      applicableTo,
      expiryDate,
      usageLimit,
      usedCount,
    });

    await newVoucher.save();
    res.status(201).json(newVoucher);
  } catch (error) {
    console.error("Error creating voucher:", error);
    res.status(500).json({ message: "Failed to create voucher" });
  }
};

// Lấy danh sách voucher
exports.getVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    res.status(200).json(vouchers);
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    res.status(500).json({ message: "Failed to fetch vouchers" });
  }
};

// Lấy thông tin voucher theo ID
exports.getVoucherById = async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }
    res.status(200).json(voucher);
  } catch (error) {
    console.error("Error fetching voucher:", error);
    res.status(500).json({ message: "Failed to fetch voucher" });
  }
};

// Cập nhật voucher
exports.updateVoucher = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      applicableTo,
      expiryDate,
      usageLimit,
    } = req.body;

    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    // Cập nhật thông tin voucher
    voucher.code = code || voucher.code;
    voucher.discountType = discountType || voucher.discountType;
    voucher.discountValue = discountValue || voucher.discountValue;
    voucher.applicableTo = applicableTo || voucher.applicableTo;
    voucher.expiryDate = expiryDate || voucher.expiryDate;
    voucher.usageLimit = usageLimit || voucher.usageLimit;

    await voucher.save();
    res.status(200).json(voucher);
  } catch (error) {
    console.error("Error updating voucher:", error);
    res.status(500).json({ message: "Failed to update voucher" });
  }
};

// Xóa voucher
exports.deleteVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findByIdAndDelete(req.params.id);
    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }
    res.status(200).json({ message: "Voucher deleted successfully" });
  } catch (error) {
    console.error("Error deleting voucher:", error);
    res.status(500).json({ message: "Failed to delete voucher" });
  }
};
// controllers/voucherController.js
exports.applyVoucher = async (req, res) => {
  try {
    const { code } = req.body;

    // Kiểm tra xem voucher code có được cung cấp không
    if (!code) {
      return res.status(400).json({ message: "Voucher code is required" });
    }

    // Kiểm tra voucher có tồn tại không
    const voucher = await Voucher.findOne({ code });
    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    // Kiểm tra voucher đã hết hạn chưa
    if (new Date(voucher.expiryDate) < new Date()) {
      return res.status(400).json({ message: "Voucher has expired" });
    }

    // Kiểm tra số lượt sử dụng còn lại
    if (voucher.usedCount >= voucher.usageLimit) {
      return res.status(400).json({ message: "Voucher usage limit reached" });
    }

    // Trả về thông tin voucher
    res.status(200).json({
      discountValue: voucher.discountValue,
      applicableTo: voucher.applicableTo,
    });
    console.log("Received voucher code:", code);
  } catch (error) {
    console.error("Error applying voucher:", error);
    res.status(500).json({ message: "Failed to apply voucher" });
  }
};
// controllers/voucherController.js
exports.updateVoucherUsage = async (req, res) => {
  try {
    const { code } = req.body;

    // Tìm voucher và cập nhật số lượt sử dụng
    const voucher = await Voucher.findOneAndUpdate(
      { code },
      { $inc: { usedCount: 1 } }, // Tăng usedCount lên 1
      { new: true }
    );

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    res.status(200).json({ message: "Voucher usage updated successfully" });
  } catch (error) {
    console.error("Error updating voucher usage:", error);
    res.status(500).json({ message: "Failed to update voucher usage" });
  }
};
