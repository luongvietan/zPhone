const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const User = require("../models/userModel"); // Đảm bảo import User model
const { sendOrderConfirmationEmail } = require("../utils/emailService");

exports.addOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    // Log: Đơn hàng đã được tạo
    console.log("[ORDER] Order created successfully:", {
      transactionId: order.transactionId,
      user: order.user_id,
      total: order.total,
    });

    // Lấy thông tin người dùng từ database
    const user = await User.findById(order.user_id);

    if (user && user.email) {
      // Log: Bắt đầu gửi email
      console.log("[EMAIL] Preparing to send email to:", user.email);

      // Gửi email xác nhận
      await sendOrderConfirmationEmail(user.email, order);

      // Log: Email đã được gửi thành công
      console.log("[EMAIL] Email sent successfully to:", user.email);
    } else {
      console.warn(
        "[EMAIL] User email not found for order:",
        order.transactionId
      );
    }

    res.status(201).json(order);
  } catch (error) {
    console.error("[ERROR] Order processing failed:", {
      error: error.message,
      stack: error.stack,
    });
    res.status(400).json({ error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const orders = await Order.find({ user_id: req.user._id });
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const {
      user_id,
      items,
      transactionId,
      amount,
      subtotal,
      shipping,
      total,
      status,
    } = req.body;
    // console.log("Received order data:", req.body);
    // if (!items || !Array.isArray(items) || items.length === 0) {
    //   return res
    //     .status(400)
    //     .json({ message: "Order must contain at least one item." });
    // }

    // console.log("Received items in backend:", items);

    // Kiểm tra transactionId + user_id
    const existingOrder = await Order.findOne({ transactionId });

    if (existingOrder) {
      return res.status(400).json({ message: "Transaction ID already exists" });
    }

    const newOrder = new Order({
      user_id,
      items,
      transactionId,
      amount,
      subtotal,
      shipping, // Giá trị này có thể bị thay đổi trước khi lưu
      total,
      status: status || "pending",
      orderDate: new Date(),
    });
    // console.log("Order being saved:", newOrder);
    // console.log(`shipping : `, shipping);

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: error.message || "Error creating order" });
  }
};
exports.checkOrderExists = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const existingOrder = await Order.findOne({ transactionId });

    if (existingOrder) {
      return res.json({ exists: true });
    }

    res.json({ exists: false });
  } catch (error) {
    console.error("Error checking order:", error);
    res
      .status(500)
      .json({ message: "Error checking order", error: error.message });
  }
};
