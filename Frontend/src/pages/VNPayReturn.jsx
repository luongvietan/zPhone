import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const VNPayReturn = () => {
  const [status, setStatus] = useState("processing");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    let isMounted = true;

    const verifyPayment = async () => {
      if (!isMounted) return;
      try {
        const queryString = window.location.search.substring(1);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const transactionNo = new URLSearchParams(queryString).get(
          "vnp_TransactionNo"
        );
        if (!transactionNo) throw new Error("Transaction ID missing");

        // Kiểm tra nếu đơn hàng đã tồn tại
        const checkOrder = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/orders/check/${transactionNo}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (checkOrder.data.exists) {
          console.log("Order already exists, skipping...");
          setStatus("success");
          return;
        }

        // Lấy thông tin giỏ hàng
        const apiUrlCart = `${import.meta.env.VITE_API_URL}/api/cart`;
        const cartResponse = await axios.get(apiUrlCart, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const items = cartResponse.data.items || [];

        if (!items.length) {
          setStatus("failed");
          setErrorMessage("Cart is empty. Cannot create order.");
          return;
        }

        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user._id) throw new Error("User information not found");

        const subtotal = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const userCity = user?.address?.split(",")[0]?.trim();
        const shipping = userCity === "Thành phố Hồ Chí Minh" ? 0 : 0.08;
        const total = subtotal + shipping;
        const orderInfo = {
          user_id: user._id,
          items: items.map((item) => ({
            ...item,
            product_id: item.product_id,
          })),
          orderDate: new Date().toISOString(),
          transactionId: transactionNo,
          amount: new URLSearchParams(queryString).get("vnp_Amount") / 100,
          subtotal,
          shipping,
          total,
          status: "pending",
        };
        console.log("Saving order info to LocalStorage:", orderInfo);
        localStorage.setItem("orderInfo", JSON.stringify(orderInfo));
        // Tạo order
        const apiUrlOrder = `${import.meta.env.VITE_API_URL}/api/orders/add`;
        const response = await axios.post(apiUrlOrder, orderInfo, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 201) {
          // Chỉ xóa giỏ hàng nếu đơn hàng đã tạo thành công
          const apiUrlClearCart = `${
            import.meta.env.VITE_API_URL
          }/api/cart/clear`;
          await axios.delete(apiUrlClearCart, {
            headers: { Authorization: `Bearer ${token}` },
          });
          clearCart();
          setStatus("success");
        } else {
          setStatus("failed");
          setErrorMessage("Failed to create order");
        }
      } catch (error) {
        console.error("Error:", error);
        setErrorMessage(error.message || "Unknown error");
        setStatus("failed");
      }
    };

    verifyPayment();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status !== "processing") {
      const timer = setTimeout(() => {
        navigate(status === "success" ? "/order-success" : "/order-failed");
        window.location.reload();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {status === "processing" && <div>Payment Processing...</div>}
      {status === "success" && <div>Payment Successful! Redirecting...</div>}
      {status === "failed" && (
        <div>
          <p>Payment Failed! Redirecting...</p>
          {errorMessage && <p>Error: {errorMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default VNPayReturn;
