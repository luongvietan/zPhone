import React, { useState, useEffect } from "react";

const OrderFailed = () => {
  const [orderInfo, setOrderInfo] = useState({});

  useEffect(() => {
    const savedOrder = localStorage.getItem("orderInfo");
    if (savedOrder) {
      setOrderInfo(JSON.parse(savedOrder));
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Order Failed!</h1>

      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Order Information:</h2>

        <div className="space-y-4">
          <div>
            <p className="font-medium">Transaction ID:</p>
            <p>{orderInfo.transactionId || "N/A"}</p>
          </div>

          <div>
            <p className="font-medium">Date:</p>
            <p>
              {orderInfo.orderDate
                ? new Date(orderInfo.orderDate).toLocaleString("vi-VN")
                : "N/A"}
            </p>
          </div>

          <div className="border-t pt-4 mt-4">
            <p className="font-medium text-red-500">Reason for Failure:</p>
            <p>{orderInfo.failureReason || "Payment was not successful."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFailed;
