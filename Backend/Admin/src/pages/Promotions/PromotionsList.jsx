import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Edit, PlusCircle } from "lucide-react";
import { getVouchers, deleteVoucher } from "../../services/voucherService";
import { toast } from "react-toastify";

const PromotionsList = () => {
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      const data = await getVouchers();
      setVouchers(data);
    } catch (error) {
      toast.error("Failed to load vouchers");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteVoucher(id);
      loadVouchers();
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Vouchers</h1>
        <Link
          to="/promotions/create"
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <PlusCircle size={18} /> New Voucher
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Code</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Value</th>
              <th className="px-6 py-3 text-left">Expiry</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((voucher) => (
              <tr key={voucher._id} className="border-b">
                <td className="px-6 py-4">{voucher.code}</td>
                <td className="px-6 py-4 capitalize">{voucher.discountType}</td>
                <td className="px-6 py-4">
                  {voucher.discountValue}%
                  {voucher.applicableTo && ` ${voucher.applicableTo.type}`}
                </td>
                <td className="px-6 py-4">
                  {new Date(voucher.expiryDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 flex gap-3">
                  <Link
                    to={`/promotions/edit/${voucher._id}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(voucher._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromotionsList;
