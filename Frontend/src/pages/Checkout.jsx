import React, { useContext, useCallback, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Checkout = () => {
  const { cartItems } = useContext(CartContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  // State cho thông tin người dùng
  const [userName, setUserName] = useState(user?.username || "");
  const [userPhone, setUserPhone] = useState(user?.phone || "");
  const [userAddress, setUserAddress] = useState(user?.address || "");

  // State cho voucher
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);

  // Tính toán phí vận chuyển dựa trên thành phố
  const userCity = userAddress?.split(",")[0]?.trim();
  const shipping = userCity === "Thành phố Hồ Chí Minh" ? 0 : 0.08;

  // Tính toán subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  // Tính toán total
  const total = subtotal + shipping - (subtotal + shipping) * (discount / 100);

  // Hàm áp dụng voucher
  const applyVoucher = async () => {
    try {
      // Gọi API để kiểm tra và áp dụng voucher
      const response = await axios.post("/api/vouchers/apply", {
        code: voucherCode, // Đảm bảo voucherCode không rỗng
      });

      const { discountValue } = response.data;

      // Cập nhật discount
      setDiscount(discountValue);
      setIsDiscountApplied(true);

      // Gọi API để cập nhật số lượt sử dụng voucher
      await axios.post("/api/vouchers/update-usage", { code: voucherCode });
      console.log("Sending voucher code:", voucherCode);
      toast.success("Voucher applied successfully!");
    } catch (error) {
      console.error("Error applying voucher:", error);
      // Xử lý thông báo lỗi cụ thể từ backend
      if (error.response?.data?.message) {
        toast.error(error.response.data.message); // Hiển thị thông báo lỗi từ backend
      } else {
        toast.error("Failed to apply voucher"); // Thông báo lỗi mặc định
      }

      // Đặt lại discount và trạng thái áp dụng voucher
      setDiscount(0);
      setIsDiscountApplied(false);
    }
  };

  // Hàm xử lý đặt hàng
  const handlePlaceOrder = useCallback(() => {
    // Lưu thông tin người dùng vào localStorage hoặc gửi lên server
    localStorage.setItem(
      "userInfo",
      JSON.stringify({ userName, userPhone, userAddress })
    );
    navigate("/payment", { state: { amount: total * 1000000 } });
  }, [total, navigate, userName, userPhone, userAddress]);

  return (
    <div>
      <div className="flex flex-col items-center border-b bg-white py-4 sm:flex-row sm:px-10 lg:px-20 xl:px-32"></div>
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
        <div className="px-4 pt-8">
          <p className="text-xl font-medium">Order Summary</p>
          <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
            {cartItems.map((item, index) => (
              <div
                key={`${item.product_id}-${index}`}
                className="flex items-center justify-between border-b py-4"
              >
                <div className="flex items-center">
                  <img
                    src={`${axios.defaults.baseURL}/Phone_images/${item.product_image}.png`}
                    alt={item.product_name}
                    className="h-24 w-24 object-cover rounded-md"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">
                      {item.product_name}
                    </h3>
                    <p className="text-sm text-gray-500">{item.storage}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="text-lg font-medium">
                  {(
                    Number(item.price) *
                    item.quantity *
                    1000000
                  ).toLocaleString()}{" "}
                  VND
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
          <p className="text-xl font-medium">Personal Information</p>
          <p className="text-gray-400">
            Complete your order by providing necessary information.
          </p>
          <div className="">
            <label
              htmlFor="name"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Your full name here"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <label
              htmlFor="phone"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              Your Phone number
            </label>
            <div className="relative">
              <input
                type="text"
                id="phone"
                name="phone"
                className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Phone number"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
              />
            </div>
            <label
              htmlFor="address"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              Your Address
            </label>
            <div className="relative">
              <input
                type="text"
                id="address"
                name="address"
                className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Street Address"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-6 border-t border-b py-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Subtotal</p>
              <p className="font-semibold text-gray-900">
                {(subtotal * 1000000).toLocaleString()} VND
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Shipping</p>
              <p className="font-semibold text-gray-900">
                {(shipping * 1000000).toLocaleString()} VND
              </p>
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium">
              Voucher Code
            </label>
            <div className="flex">
              <input
                type="text"
                className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter voucher code"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
              />
              <button
                onClick={applyVoucher}
                className="ml-2 rounded-md bg-blue-500 px-4 py-3 text-white"
              >
                Apply
              </button>
            </div>
          </div>
          {isDiscountApplied && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Discount</p>
              <p className="font-semibold text-red-500">
                -{(subtotal * discount * 10000).toLocaleString()} VND
              </p>
            </div>
          )}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">Total</p>
            <p className="text-2xl font-semibold text-gray-900">
              {(total * 1000000).toLocaleString()} VND
            </p>
          </div>
          <button
            className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
