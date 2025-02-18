import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OrderStats from "./OrderStats";
import OrderExport from "./OrderExport";
import { Info, ArrowUp, ArrowDown } from "lucide-react";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [groupedOrders, setGroupedOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [sortCriteria, setSortCriteria] = useState("total"); // Tiêu chí sắp xếp
  const [sortDirection, setSortDirection] = useState("desc"); // Hướng sắp xếp
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
          const filteredOrders = response.data.orders.filter(
            (order) => !isNaN(order.total) && order.items.length > 0
          );

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
    return (amount * 1000000).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  // Hàm xử lý khi nhấp vào icon để hiển thị thông tin chi tiết
  const toggleOrderDetails = (transactionId) => {
    if (expandedOrderId === transactionId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(transactionId);
    }
  };

  // Hàm sắp xếp các đơn hàng
  const sortOrders = (criteria, direction) => {
    console.log("Sorting by:", criteria, "Direction:", direction);
    const groupArray = Object.entries(groupedOrders);

    // Log giá trị total của từng nhóm trước khi sắp xếp
    groupArray.forEach(([key, orders]) => {
      const total = orders.reduce((sum, order) => sum + order.total, 0);
      console.log(`Transaction ID: ${key}, Total: ${total}`);
    });

    groupArray.sort(([aKey], [bKey]) => {
      const orderA = groupedOrders[aKey][0];
      const orderB = groupedOrders[bKey][0];

      if (criteria === "total") {
        const totalA = groupedOrders[aKey].reduce(
          (sum, order) => sum + order.total,
          0
        );
        const totalB = groupedOrders[bKey].reduce(
          (sum, order) => sum + order.total,
          0
        );
        return direction === "asc" ? totalA - totalB : totalB - totalA;
      } else if (criteria === "status") {
        return direction === "asc"
          ? orderA.status.localeCompare(orderB.status)
          : orderB.status.localeCompare(orderA.status);
      } else if (criteria === "orderDate") {
        const dateA = new Date(orderA.orderDate);
        const dateB = new Date(orderB.orderDate);
        return direction === "asc" ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

    // Log giá trị total của từng nhóm sau khi sắp xếp
    groupArray.forEach(([key, orders]) => {
      const total = orders.reduce((sum, order) => sum + order.total, 0);
      console.log(`Transaction ID: ${key}, Total: ${total}`);
    });

    const sortedGroupedOrders = Object.fromEntries(groupArray);
    setGroupedOrders(sortedGroupedOrders);
  };

  // Hàm xử lý khi thay đổi tiêu chí sắp xếp
  const handleSortChange = (criteria) => {
    if (criteria === sortCriteria) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortCriteria(criteria);
      setSortDirection("desc");
    }
  };

  // Gọi hàm sắp xếp mỗi khi sortCriteria hoặc sortDirection thay đổi
  useEffect(() => {
    sortOrders(sortCriteria, sortDirection);
  }, [sortCriteria, sortDirection]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Orders</h2>
      <OrderStats />
      <br />
      <OrderExport orders={orders} />
      <br />
      {/* Dropdown để chọn tiêu chí sắp xếp */}
      <div className="mb-4 flex items-center">
        <label htmlFor="sortCriteria" className="mr-2">
          Sort by:
        </label>
        <select
          id="sortCriteria"
          value={sortCriteria}
          onChange={(e) => handleSortChange(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="total">Total</option>
          <option value="status">Status</option>
          <option value="orderDate">Order Date</option>
        </select>
        <button
          onClick={() => handleSortChange(sortCriteria)}
          className="ml-2 p-2 bg-blue-500 text-white rounded flex items-center"
        >
          {sortDirection === "asc" ? (
            <ArrowUp size={16} />
          ) : (
            <ArrowDown size={16} />
          )}
        </button>
      </div>

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
                </td>
                <td className="py-2 px-4 border-b">
                  {groupedOrders[transactionId][0].status}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(
                    groupedOrders[transactionId][0].orderDate
                  ).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => toggleOrderDetails(transactionId)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Info size={16} />
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
