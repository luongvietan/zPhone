const mongoose = require("mongoose");
const Order = require("../models/orderModel");

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
