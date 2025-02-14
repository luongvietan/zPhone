import React, { useState, useEffect } from "react";

const OrderSuccess = () => {
  const [orderInfo, setOrderInfo] = useState({});

  useEffect(() => {
    const savedOrder = localStorage.getItem("orderInfo");
    if (savedOrder) {
      const parsedOrder = JSON.parse(savedOrder);
      console.log("Order Info from LocalStorage:", parsedOrder); // Kiểm tra giá trị shipping
      setOrderInfo(parsedOrder);
    }
  }, []);

  // const formatCurrency = (amount) => {
  //   if (typeof amount === "string") {
  //     amount = parseInt(amount);
  //   }
  //   if (!amount || isNaN(amount)) {
  //     return "N/A"; // Xử lý khi giá trị không hợp lệ
  //   }
  //   return new Intl.NumberFormat("vi-VN", {
  //     style: "currency",
  //     currency: "VND",
  //   }).format(amount);
  // };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        Đặt hàng thành công!
      </h1>

      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Thông tin đơn hàng:</h2>

        <div className="space-y-4">
          <div>
            <p className="font-medium">Mã giao dịch:</p>
            <p>{orderInfo.transactionId || "N/A"}</p>
          </div>

          <div>
            <p className="font-medium">Ngày đặt hàng:</p>
            <p>
              {orderInfo.orderDate
                ? new Date(orderInfo.orderDate).toLocaleString("vi-VN")
                : "N/A"}
            </p>
          </div>

          <div>
            <p className="font-medium">Các sản phẩm:</p>
            <ul className="list-disc pl-5">
              {orderInfo.items?.length > 0 ? (
                orderInfo.items.map((item, index) => (
                  <li key={index} className="mb-2">
                    <div>
                      <span className="font-medium">{item.product_name}</span>
                      <span className="text-gray-600"> - {item.storage}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Số lượng: {item.quantity} - Đơn giá:{" "}
                      {(item.price * 1000000).toLocaleString()}
                    </div>
                  </li>
                ))
              ) : (
                <p>Không có sản phẩm nào.</p>
              )}
            </ul>
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between mb-2">
              <p className="font-medium">Tổng tiền hàng:</p>
              <p>{(orderInfo.subtotal * 1000000).toLocaleString()}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="font-medium">Phí vận chuyển:</p>
              <p>{(orderInfo.shipping * 1000000).toLocaleString()}</p>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <p>Tổng cộng:</p>
              <p>{(orderInfo.total * 1000000).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
