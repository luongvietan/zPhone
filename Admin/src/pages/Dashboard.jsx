import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("daily");
  const [stats, setStats] = useState({});
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [weeklyRevenue, setWeeklyRevenue] = useState([]);
  const [orderStatusStats, setOrderStatusStats] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const periodMap = {
          daily: "daily",
          weekly: "weekly",
          monthly: "monthly",
          yearly: "yearly",
        };

        const period = periodMap[selectedPeriod];
        const statsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/orders/stats/${period}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStats(statsResponse.data);

        const topSelling = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/orders/stats/top-selling`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTopSellingProducts(topSelling.data || []);

        const revenue = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/orders/stats/weekly-revenue`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWeeklyRevenue(revenue.data || []);

        const status = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/orders/stats/order-status`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrderStatusStats(Array.isArray(status.data) ? status.data : []);

        const ordersResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(ordersResponse.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedPeriod, navigate]);

  // Hàm định dạng số tiền với dấu phẩy ngăn cách
  const formatCurrency = (amount) => {
    return (amount * 1000000).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      orders
        .map((order) =>
          [
            order.transactionId,
            order.user_id,
            formatCurrency(order.total),
            order.status,
            new Date(order.orderDate).toLocaleDateString(),
          ].join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "orders.csv");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [["Transaction ID", "User ID", "Total", "Status", "Order Date"]],
      body: orders.map((order) => [
        order.transactionId,
        order.user_id,
        formatCurrency(order.total),
        order.status,
        new Date(order.orderDate).toLocaleDateString(),
      ]),
    });
    doc.save("orders.pdf");
  };

  if (loading) {
    return <div className="p-6 bg-gray-100 min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen text-red-500">{error}</div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Period Selector */}
      <div className="mb-6">
        <label htmlFor="period" className="mr-2">
          Select Period:
        </label>
        <select
          id="period"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Statistics */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}{" "}
          Statistics
        </h2>
        <p>Total Revenue: {formatCurrency(stats.totalRevenue || 0)}</p>
        <p>Total Orders: {stats.totalOrders}</p>
      </div>

      {/* Top Selling Products */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Top 10 Best Selling Products
        </h2>
        <ul>
          {Array.isArray(topSellingProducts) &&
            topSellingProducts.map((product) => (
              <li key={product._id} className="mb-2">
                {product.product_name} - Quantity: {product.total_quantity} -
                Revenue: {formatCurrency(product.total_revenue || 0)}
              </li>
            ))}
        </ul>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>
        <Bar
          data={{
            labels: Array.isArray(weeklyRevenue)
              ? weeklyRevenue.map((item) => `Month ${item._id}`)
              : [],
            datasets: [
              {
                label: "Revenue",
                data: Array.isArray(weeklyRevenue)
                  ? weeklyRevenue.map((item) => item.totalRevenue * 1000000)
                  : [],
                backgroundColor: "rgba(75, 192, 192, 0.6)",
              },
            ],
          }}
        />
      </div>

      {/* Order Status Statistics */}
      {/* <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Status</h2>
        <ul>
          {Array.isArray(orderStatusStats) &&
            orderStatusStats.map((status) => (
              <li key={status._id} className="mb-2">
                {status._id}: {status.count} orders
              </li>
            ))}
        </ul>
      </div> */}

      {/* Orders Table */}
      {/* <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Orders</h2>
        <div className="mb-4">
          <button
            onClick={handleExportCSV}
            className="bg-blue-500 text-white p-2 rounded mr-2"
          >
            Export to CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="bg-green-500 text-white p-2 rounded"
          >
            Export to PDF
          </button>
        </div>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Transaction ID</th>
              <th className="py-2 px-4 border-b">User ID</th>
              <th className="py-2 px-4 border-b">Total</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="py-2 px-4 border-b">{order.transactionId}</td>
                <td className="py-2 px-4 border-b">{order.user_id}</td>
                <td className="py-2 px-4 border-b">
                  {formatCurrency(order.total || 0)}
                </td>
                <td className="py-2 px-4 border-b">{order.status}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>*/}
    </div>
  );
};

export default Dashboard;
