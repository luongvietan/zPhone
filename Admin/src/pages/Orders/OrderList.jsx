import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OrderStats from "./OrderStats";
import OrderExport from "./OrderExport";
import { FaInfoCircle } from "react-icons/fa";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [groupedOrders, setGroupedOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null); // State để quản lý đơn hàng được mở rộng
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/orders/stats/yearly`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (Array.isArray(response.data.orders)) {
          // Lọc bỏ đơn hàng không hợp lệ
          const filteredOrders = response.data.orders.filter(
            (order) => !isNaN(order.total) && order.items.length > 0
          );

          // Nhóm các đơn hàng có cùng Transaction ID
          const grouped = filteredOrders.reduce((acc, order) => {
            if (!acc[order.transactionId]) {
              acc[order.transactionId] = [];
            }
            acc[order.transactionId].push(order);
            return acc;
          }, {});

          setGroupedOrders(grouped);
          setOrders(filteredOrders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  // Hàm định dạng số tiền với dấu phẩy ngăn cách
  const formatCurrency = (amount) => {
    return (amount * 1000000).toLocaleString();
  };

  // Hàm xử lý khi nhấp vào icon để hiển thị thông tin chi tiết
  const toggleOrderDetails = (transactionId) => {
    if (expandedOrderId === transactionId) {
      setExpandedOrderId(null); // Đóng nếu đã mở
    } else {
      setExpandedOrderId(transactionId); // Mở thông tin chi tiết
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <OrderStats />
      <br />
      <OrderExport orders={orders} />
      <table className="min-w-full bg-white mt-4">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Transaction ID</th>
            <th className="py-2 px-4 border-b">User ID</th>
            <th className="py-2 px-4 border-b">Total</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Order Date</th>
            <th className="py-2 px-4 border-b">Details</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedOrders).map((transactionId) => (
            <React.Fragment key={transactionId}>
              <tr>
                <td className="py-2 px-4 border-b">{transactionId}</td>
                <td className="py-2 px-4 border-b">
                  {groupedOrders[transactionId][0].user_id}
                </td>
                <td className="py-2 px-4 border-b">
                  {formatCurrency(
                    groupedOrders[transactionId].reduce(
                      (sum, order) => sum + order.total,
                      0
                    )
                  )}
                  {" VND"}
                </td>
                <td className="py-2 px-4 border-b">
                  {groupedOrders[transactionId][0].status}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(
                    groupedOrders[transactionId][0].orderDate
                  ).toLocaleDateString("vi-VN")}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => toggleOrderDetails(transactionId)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaInfoCircle />
                  </button>
                </td>
              </tr>
              {expandedOrderId === transactionId && (
                <tr>
                  <td colSpan="6" className="py-2 px-4 border-b">
                    <div className="pl-4">
                      <h3 className="font-semibold">Order Details:</h3>
                      <ul>
                        {groupedOrders[transactionId].map((order, index) => (
                          <li key={index} className="mt-2">
                            <p>
                              <strong>Order ID:</strong> {order._id}
                            </p>
                            <p>
                              <strong>Items:</strong>
                              <ul>
                                {order.items.map((item, idx) => (
                                  <li key={idx}>
                                    {item.product_name} -{item.storage} -
                                    Quantity: {item.quantity} - Price:{" "}
                                    {formatCurrency(item.price)}
                                  </li>
                                ))}
                              </ul>
                            </p>
                            <p>
                              <strong>Total:</strong>{" "}
                              {formatCurrency(order.total)}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
