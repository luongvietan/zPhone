const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const verifyToken = require("../middleware/verifyToken");
// console.log("Setting up order routes");
router.get("/", verifyToken, orderController.getUserOrders);
router.post("/add", verifyToken, orderController.createOrder);
router.get("/dashboard", verifyToken, orderController.getUserOrders);
// console.log(
//   "Order routes set up:",
//   router.stack.map((r) => ({
//     path: r.route?.path,
//     methods: r.route?.methods,
//   }))
// );
router.get("/check/:transactionId", orderController.checkOrderExists);
module.exports = router;
