const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const User = require("../models/userModel"); // Đảm bảo import User model
const { sendOrderConfirmationEmail } = require("../utils/emailService");
const Product = require("../models/productModel"); // Thêm import Product model

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

    // Lọc bỏ đơn hàng có total NaN hoặc items rỗng
    const validOrders = orders.filter(
      (order) => !isNaN(order.total) && order.items.length > 0
    );

    res.json(validOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
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

    // Kiểm tra transactionId + user_id
    const existingOrder = await Order.findOne({ transactionId });

    if (existingOrder) {
      return res.status(400).json({ message: "Transaction ID already exists" });
    }

    // Tạo đơn hàng mới
    const newOrder = new Order({
      user_id,
      items,
      transactionId,
      amount,
      subtotal,
      shipping,
      total,
      status: status || "pending",
      orderDate: new Date(),
    });

    // Lưu đơn hàng vào database
    await newOrder.save();

    // Trừ số lượng sản phẩm trong kho
    for (const item of items) {
      const product = await Product.findOne({ product_id: item.product_id });
      if (product) {
        if (product.stock_quantity < item.quantity) {
          throw new Error(`Not enough stock for product ${item.product_name}`);
        }
        product.stock_quantity -= item.quantity; // Trừ số lượng
        await product.save(); // Lưu lại thay đổi
      }
    }

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
// Hàm thống kê theo ngày
exports.getDailyStats = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      orderDate: { $gte: startOfDay, $lte: endOfDay },
    });
    const validOrders = orders.filter(
      (order) => !isNaN(order.total) && order.items.length > 0
    );
    const totalRevenue = validOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );
    const totalOrders = validOrders.length;

    res.json({
      totalRevenue,
      totalOrders,
      orders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching daily stats", error: error.message });
  }
};

// Hàm thống kê theo tuần
exports.getWeeklyStats = async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Bắt đầu từ Chủ Nhật

    const endOfWeek = new Date();
    endOfWeek.setHours(23, 59, 59, 999);
    endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay())); // Kết thúc vào Thứ Bảy

    const orders = await Order.find({
      orderDate: { $gte: startOfWeek, $lte: endOfWeek },
    });
    const validOrders = orders.filter(
      (order) => !isNaN(order.total) && order.items.length > 0
    );

    const totalRevenue = validOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );
    const totalOrders = validOrders.length;

    res.json({
      totalRevenue,
      totalOrders,
      orders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching weekly stats", error: error.message });
  }
};

// Hàm thống kê theo tháng
exports.getMonthlyStats = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setHours(0, 0, 0, 0);
    startOfMonth.setDate(1); // Bắt đầu từ ngày đầu tiên của tháng

    const endOfMonth = new Date();
    endOfMonth.setHours(23, 59, 59, 999);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0); // Kết thúc vào ngày cuối cùng của tháng

    const orders = await Order.find({
      orderDate: { $gte: startOfMonth, $lte: endOfMonth },
    });
    const validOrders = orders.filter(
      (order) => !isNaN(order.total) && order.items.length > 0
    );

    const totalRevenue = validOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );
    const totalOrders = validOrders.length;

    res.json({
      totalRevenue,
      totalOrders,
      orders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching monthly stats", error: error.message });
  }
};

// Hàm thống kê theo năm
exports.getYearlyStats = async (req, res) => {
  try {
    const startOfYear = new Date();
    startOfYear.setHours(0, 0, 0, 0);
    startOfYear.setMonth(0, 1); // Bắt đầu từ ngày đầu tiên của năm

    const endOfYear = new Date();
    endOfYear.setHours(23, 59, 59, 999);
    endOfYear.setMonth(11, 31); // Kết thúc vào ngày cuối cùng của năm

    const orders = await Order.find({
      orderDate: { $gte: startOfYear, $lte: endOfYear },
    });
    const validOrders = orders.filter(
      (order) => !isNaN(order.total) && order.items.length > 0
    );

    const totalRevenue = validOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );
    const totalOrders = validOrders.length;

    res.json({
      totalRevenue,
      totalOrders,
      orders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching yearly stats", error: error.message });
  }
};

exports.getTopSellingProducts = async (req, res) => {
  try {
    const orders = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product_id",
          product_name: { $first: "$items.product_name" },
          storage: { $first: "$items.storage" },
          total_quantity: { $sum: "$items.quantity" },
          total_revenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      { $sort: { total_quantity: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products", // Tên collection của Product
          localField: "_id",
          foreignField: "product_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 1,
          product_name: 1,
          storage: 1,
          total_quantity: 1,
          total_revenue: 1,
          product_image: "$productDetails.product_image", // Lấy thông tin ảnh từ Product
          product_price: "$productDetails.variants.product_price", // Lấy giá từ variants của Product
          stock_quantity: "$productDetails.stock_quantity",
        },
      },
    ]);

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching top selling products",
      error: error.message,
    });
  }
};

exports.getWeeklyRevenue = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1); // Ngày đầu tiên của năm

    const weeklyRevenue = await Order.aggregate([
      {
        $match: {
          orderDate: {
            $gte: startOfYear,
            $lt: new Date(currentYear + 1, 0, 1),
          },
        },
      },
      {
        $group: {
          _id: { $week: "$orderDate" },
          totalRevenue: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(weeklyRevenue);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching weekly revenue",
      error: error.message,
    });
  }
};

exports.getOrderStatusStats = async (req, res) => {
  try {
    const statusStats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(statusStats || []);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching order status stats",
      error: error.message,
    });
  }
};
