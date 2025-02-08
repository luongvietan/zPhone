import React from "react";

const OrderSuccess = () => {
  // Giả sử thông tin đơn hàng được lưu trong localStorage
  const orderInfo = JSON.parse(localStorage.getItem("orderInfo")) || {}; // Lấy thông tin đơn hàng

  return (
    <div>
      <h1>Đặt hàng thành công!</h1>
      <p>Thông tin đơn hàng:</p>
      <pre>{JSON.stringify(orderInfo, null, 2)}</pre>{" "}
      {/* Hiển thị thông tin đơn hàng */}
    </div>
  );
};

export default OrderSuccess;
