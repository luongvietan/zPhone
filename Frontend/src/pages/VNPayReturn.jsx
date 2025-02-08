import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const VNPayReturn = () => {
  const [status, setStatus] = useState("processing");
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/payment/vnpay-return?${queryParams}`
        );

        setStatus(response.data.success ? "success" : "failed");

        if (response.data.success) {
          clearCart();
        }

        // Redirect after 3 seconds
        setTimeout(() => {
          navigate(response.data.success ? "/order-success" : "/order-failed");
        }, 3000);
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("failed");
        setTimeout(() => {
          navigate("/order-failed");
        }, 3000);
      }
    };

    verifyPayment();
  }, [navigate, clearCart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {status === "processing" && <div>Payment Processing...</div>}
      {status === "success" && <div>Payment Successfull! Redirecting...</div>}
      {status === "failed" && <div>Payment Failed! Redirecting...</div>}
    </div>
  );
};

export default VNPayReturn;
