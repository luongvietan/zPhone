const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const verifyToken = require("../middleware/verifyToken");

router.get("/", verifyToken, orderController.getUserOrders);
router.post("/add", verifyToken, orderController.createOrder);
router.get("/dashboard", verifyToken, orderController.getUserOrders);
router.get("/check/:transactionId", orderController.checkOrderExists);

// Thêm các route mới cho thống kê
router.get("/stats/daily", orderController.getDailyStats);
router.get("/stats/weekly", orderController.getWeeklyStats);
router.get("/stats/monthly", orderController.getMonthlyStats);
router.get("/stats/yearly", orderController.getYearlyStats);
router.get("/stats/top-selling", orderController.getTopSellingProducts);
router.get("/stats/weekly-revenue", orderController.getWeeklyRevenue);
router.get("/stats/order-status", orderController.getOrderStatusStats);

module.exports = router;
