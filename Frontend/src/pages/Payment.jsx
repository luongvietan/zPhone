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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
        <img
          src="https://vinadesign.vn/uploads/thumbnails/800/2023/05/vnpay-logo-vinadesign-25-12-59-16.jpg"
          alt="VNPay"
          className="w-32 mx-auto mb-4"
        />
        <h2 className="text-xl font-semibold text-gray-700">
          Total Amount: {amount.toLocaleString()} VND
        </h2>
        <p className="text-gray-600 mt-2">
          Card Number:{" "}
          <span className="font-semibold">9704198526191432198</span>
        </p>
        {error && <div className="text-red-500 mt-2">Error: {error}</div>}
        <button
          onClick={handlePayment}
          disabled={isLoading}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 w-full"
        >
          {isLoading ? "Processing..." : "Purchase by VNPay QR"}
        </button>
      </div>
    </div>
  );
};

export default Payment;
