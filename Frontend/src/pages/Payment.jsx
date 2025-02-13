import axios from "axios";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const Payment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const amount = location.state?.amount || 0;

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Kiểm tra và lưu thông tin người dùng
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        throw new Error("User information not found. Please log in again.");
      }

      const response = await axios.post(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/payment/create`,
        { amount },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.payUrl) {
        window.location.href = response.data.payUrl;
      } else {
        throw new Error("Payment URL not received");
      }
    } catch (error) {
      console.error("Payment error details:", error.response || error);
      setError(
        error.response?.data?.error ||
          error.message ||
          "Payment creation failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-container">
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>Error: {error}</div>
      )}
      <div className="mb-4">
        <h2>Total Amount: {amount.toLocaleString()} VND</h2>
      </div>
      <div className="mb-4">
        <h2>Test bank : NCB</h2>
        <h2>Card number : 9704198526191432198</h2>
        <h2>Owner : NGUYEN VAN A</h2>
        <h2>Date : 0715</h2>
        <h2>OTP : 123456</h2>
      </div>
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isLoading ? "Đang xử lý..." : "Thanh toán qua VNPay QR"}
      </button>
    </div>
  );
};

export default Payment;
