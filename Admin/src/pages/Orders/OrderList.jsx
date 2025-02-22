import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OrderStats from "./OrderStats";
import OrderExport from "./OrderExport";
import {
  Info,
  ArrowUp,
  ArrowDown,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [sortCriteria, setSortCriteria] = useState("total");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10); // Số lượng đơn hàng hiển thị trên mỗi trang
  const [users, setUsers] = useState({}); // Lưu thông tin user để hiển thị id
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

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const usersMap = response.data.reduce((acc, user) => {
          acc[user._id] = user.id; // Lưu id của user
          return acc;
        }, {});
        setUsers(usersMap);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchOrders();
    fetchUsers();
  }, [navigate]);

  // Hàm xử lý khi nhấp vào icon để hiển thị thông tin chi tiết
  const toggleOrderDetails = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  // Hàm sắp xếp các đơn hàng
  const sortOrders = (criteria, direction) => {
    const sortedOrders = [...orders].sort((a, b) => {
      if (criteria === "total") {
        return direction === "asc" ? a.total - b.total : b.total - a.total;
      }
      if (criteria === "status") {
        return direction === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      if (criteria === "orderDate") {
        return direction === "asc"
          ? new Date(a.orderDate) - new Date(b.orderDate)
          : new Date(b.orderDate) - new Date(a.orderDate);
      }
      return 0;
    });
    setOrders(sortedOrders);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortCriteria, sortDirection]);

  // Logic phân trang
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Hàm cập nhật trạng thái đơn hàng
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Cập nhật lại danh sách đơn hàng
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

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

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden mt-4">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-3 px-5 text-left">Transaction ID</th>
            <th className="py-3 px-5 text-left">User ID</th>
            <th className="py-3 px-5 text-right">Total</th>
            <th className="py-3 px-5 text-center">Status</th>
            <th className="py-3 px-5 text-center">Order Date</th>
            <th className="py-3 px-5 text-center">Details</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order) => (
            <React.Fragment key={order._id}>
              <tr className="border-b hover:bg-gray-100 transition">
                <td className="py-3 px-5">{order.transactionId}</td>
                <td className="py-3 px-5">
                  {users[order.user_id] || order.user_id}
                </td>
                <td className="py-3 px-5 text-right font-semibold">
                  {(order.total * 1000000).toLocaleString()} VND
                </td>
                <td className="py-3 px-5 text-center">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order._id, e.target.value)
                    }
                    className={`p-1 border rounded bg-white focus:ring-2 
                ${order.status === "pending" ? "text-yellow-500" : ""} 
                ${order.status === "shipping" ? "text-blue-500" : ""} 
                ${order.status === "done" ? "text-green-500" : ""} 
                ${order.status === "canceled" ? "text-red-500" : ""}`}
                  >
                    <option value="pending">
                      <Clock size={16} className="inline mr-1" /> Pending
                    </option>
                    <option value="shipping">
                      <Truck size={16} className="inline mr-1" /> Shipping
                    </option>
                    <option value="done">
                      <CheckCircle size={16} className="inline mr-1" /> Done
                    </option>
                    <option value="canceled">
                      <XCircle size={16} className="inline mr-1" /> Canceled
                    </option>
                  </select>
                </td>
                <td className="py-3 px-5 text-center">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-5 text-center">
                  <button
                    onClick={() => toggleOrderDetails(order._id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Info size={18} />
                  </button>
                </td>
              </tr>
              {expandedOrderId === order._id && (
                <tr className="bg-gray-50">
                  <td colSpan="6" className="py-4 px-5">
                    <div className="pl-4 border-l-4 border-blue-500">
                      <h3 className="font-semibold text-lg mb-2">
                        Order Details:
                      </h3>
                      <ul className="list-disc pl-6">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="mb-1">
                            {item.product_name} - {item.storage} - Quantity:{" "}
                            {item.quantity} - Price:{" "}
                            {(item.price * 1000000).toLocaleString()}
                            {" VND"}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 font-semibold">
                        <strong>Total:</strong>{" "}
                        {(order.total * 1000000).toLocaleString()}
                        {" VND"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from(
          { length: Math.ceil(orders.length / ordersPerPage) },
          (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default OrderList;
