const { VNPay, ProductCode, VnpLocale, consoleLogger } = require("vnpay");

const vnpayConfig = {
  tmnCode: process.env.VNP_TMN_CODE,
  secureSecret: process.env.VNP_HASH_SECRET,
  vnpayHost: "https://sandbox.vnpayment.vn",
  testMode: true,
};

const vnpayInstance = new VNPay(vnpayConfig);

exports.createPayment = async (req, res) => {
  try {
    if (!req.body.amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const payUrl = await vnpayInstance.buildPaymentUrl({
      vnp_Amount: req.body.amount,
      vnp_IpAddr:
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.ip,
      vnp_TxnRef: "12345",
      vnp_OrderInfo: "Thanh toan don hang 12345",
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: "http://localhost:5173/vnpay-return",
      vnp_Locale: VnpLocale.VN,
    });

    res.json({ payUrl });
  } catch (error) {
    console.error("Payment creation error:", error);
    res.status(500).json({ error: "Failed to create payment" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const isValid = vnpayInstance.verifyReturnUrl(req.query);
    if (!isValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment verification" });
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Payment verification error:", error);
    res
      .status(500)
      .json({ success: false, message: "Payment verification failed" });
  }
};

exports.handleIPN = async (req, res) => {
  try {
    const verify = vnpayInstance.verifyIpnCall(req.query);
    if (!verify.isVerified) {
      return res.json({ code: "97", message: "Checksum failed" });
    }

    return res.json({ code: "00", message: "Success" });
  } catch (error) {
    console.error("IPN handling error:", error);
    return res.json({ code: "99", message: "Unknown error" });
  }
};
