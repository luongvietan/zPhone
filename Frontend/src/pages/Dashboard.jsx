import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/orders/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        let uniqueOrders = response.data.reduce((acc, current) => {
          if (
            !acc.find((item) => item.transactionId === current.transactionId)
          ) {
            acc.push(current);
          }
          return acc;
        }, []);

        uniqueOrders = uniqueOrders.sort((a, b) =>
          sortOrder === "desc"
            ? new Date(b.orderDate) - new Date(a.orderDate)
            : new Date(a.orderDate) - new Date(b.orderDate)
        );

        setOrders(uniqueOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [sortOrder]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Dashboard
      </h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Your Order Information
      </h2>

      <div className="flex justify-between mb-4">
        <div>
          <label className="mr-2 text-gray-700">Sort by:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {Array.isArray(orders) && orders.length > 0 ? (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <ul className="divide-y divide-gray-300">
            {currentOrders.map((order) => (
              <li key={order._id} className="py-4">
                <p className="text-lg font-medium text-gray-800">
                  Transaction ID:{" "}
                  <span className="text-blue-600">{order.transactionId}</span>
                </p>
                <p className="text-gray-600">
                  Order Date:{" "}
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleString("en-US")
                    : "No information"}
                </p>
                <p className="text-gray-600 font-semibold">
                  Total Amount:{" "}
                  <span className="text-green-600">
                    {order.total !== undefined && order.total !== null
                      ? (order.total * 1000000).toLocaleString("en-US")
                      : "0"}{" "}
                    VND
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">
          No orders available.
        </p>
      )}

      <nav
        aria-label="Page Navigation"
        className="mx-auto my-10 flex max-w-xs justify-between space-x-2 rounded-md bg-white py-2"
      >
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="font-medium hover:text-blue-600"
        >
          « First
        </button>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="font-medium hover:text-blue-600"
        >
          ‹ Prev
        </button>
        <span className="px-2 text-lg font-medium text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="font-medium hover:text-blue-600"
        >
          Next ›
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="font-medium hover:text-blue-600"
        >
          Last »
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
