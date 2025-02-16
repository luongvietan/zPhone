const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const verifyToken = require("../middleware/verifyToken");

router.get("/", verifyToken, orderController.getUserOrders);
router.post("/add", verifyToken, orderController.createOrder);
router.get("/dashboard", verifyToken, orderController.getUserOrders);
router.get("/check/:transactionId", orderController.checkOrderExists);

module.exports = router;
