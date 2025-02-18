import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderStats = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/orders/stats/daily`
        );
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching order stats:", error);
        setError("Failed to fetch order statistics.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  const validRevenue = !isNaN(stats.totalRevenue)
    ? stats.totalRevenue * 1000000
    : 0;
  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Daily Order Statistics</h2>
      <p>Total Revenue: {validRevenue.toLocaleString()} VND</p>
      <p>Total Orders: {stats.totalOrders}</p>
    </div>
  );
};

export default OrderStats;
