const express = require("express");
const router = express.Router();
const {
  createPayment,
  verifyPayment,
  handleIPN,
} = require("../controllers/paymentController");

// Bỏ middleware verifyToken
router.post("/create", createPayment);
router.get("/vnpay-return", verifyPayment);
router.post("/vnpay-ipn", handleIPN);

module.exports = router;
