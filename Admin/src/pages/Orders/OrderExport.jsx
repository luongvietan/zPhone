import React from "react";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const OrderExport = ({ orders }) => {
  const validOrders = orders.filter(
    (order) => !isNaN(order.total) && order.items.length > 0
  );

  const handleExportCSV = () => {
    const csvContent =
      ["Transaction ID", "User ID", "Total", "Status", "Order Date", "\n"].join(
        ","
      ) +
      validOrders
        .map((order) =>
          [
            order.transactionId,
            order.user_id,
            order.total * 1000000,
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
      body: validOrders.map((order) => [
        order.transactionId,
        order.user_id,
        (order.total * 1000000).toLocaleString(),
        order.status,
        new Date(order.orderDate).toLocaleDateString(),
      ]),
    });
    doc.save("orders.pdf");
  };

  return (
    <div>
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
  );
};

export default OrderExport;
