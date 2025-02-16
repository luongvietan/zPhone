import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiShowAlt } from "react-icons/bi";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
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

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowPopup(true);
  };

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

      {orders.length > 0 ? (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <ul className="divide-y divide-gray-300">
            {currentOrders.map((order) => (
              <li
                key={order._id}
                className="py-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    Transaction ID:{" "}
                    <span className="text-blue-600">{order.transactionId}</span>
                  </p>
                  <p className="text-gray-600">
                    Order Date:{" "}
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleString("vi-VN")
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
                </div>
                <BiShowAlt
                  className="text-xl cursor-pointer text-blue-600"
                  onClick={() => handleShowDetails(order)}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">
          No orders available.
        </p>
      )}

      <div className="flex justify-center space-x-1 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="rounded-full border border-slate-300 py-2 px-3 text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 disabled:pointer-events-none disabled:opacity-50"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`min-w-9 rounded-full py-2 px-3.5 text-sm transition-all shadow-sm hover:shadow-lg ${
              currentPage === index + 1
                ? "bg-slate-800 text-white"
                : "border border-slate-300 text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="rounded-full border border-slate-300 py-2 px-3 text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 disabled:pointer-events-none disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {showPopup && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <p>
              <strong>Transaction ID:</strong> {selectedOrder.transactionId}
            </p>
            <p>
              <strong>Order Date:</strong>{" "}
              {new Date(selectedOrder.orderDate).toLocaleString("vi-VN")}
            </p>
            <p>
              <strong>Shipping:</strong> {selectedOrder.shipping} VND
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <p>
              <strong className="text-green-600">Total Amount:</strong>{" "}
              {(selectedOrder.total * 1000000).toLocaleString("en-US")} VND
            </p>
            <h3 className="text-lg font-bold mt-4">Items:</h3>
            <ul className="list-disc ml-5">
              {selectedOrder.items.map((item, index) => (
                <li key={index}>
                  {item.product_name} ({item.storage}) - {item.quantity} x{" "}
                  {(item.price * 1000000).toLocaleString("en-US")} VND
                </li>
              ))}
            </ul>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
