import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVoucher } from "../../services/voucherService";
import { toast } from "react-toastify";

const CreateVoucher = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    code: "",
    discountType: "global",
    discountValue: 10,
    applicableTo: { type: "", id: "" },
    expiryDate: "",
    usageLimit: 100,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let dataToSend = { ...formData };

    // Nếu applicableTo.id rỗng, loại bỏ nó khỏi dữ liệu gửi lên
    if (!dataToSend.applicableTo.id) {
      delete dataToSend.applicableTo.id;
    }

    try {
      await createVoucher(dataToSend);
      toast.success("Voucher created!");
      navigate("/promotions");
    } catch (error) {
      toast.error("Failed to create voucher");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create New Voucher</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Voucher Code</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-2">Discount Type</label>
          <select
            className="w-full p-2 border rounded"
            value={formData.discountType}
            onChange={(e) =>
              setFormData({ ...formData, discountType: e.target.value })
            }
          >
            <option value="global">Global Discount</option>
            <option value="product">Product Specific</option>
            <option value="brand">Brand Specific</option>
            <option value="category">Category Specific</option>
          </select>
        </div>

        {formData.discountType !== "global" && (
          <div>
            <label className="block mb-2">
              Applicable ID ({formData.discountType} ID)
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={formData.applicableTo.id || ""}
              onChange={(e) => {
                const value = e.target.value.trim();
                // Kiểm tra nếu giá trị là chuỗi hex 24 ký tự hoặc rỗng
                if (/^[a-f\d]{24}$/i.test(value) || value === "") {
                  setFormData({
                    ...formData,
                    applicableTo: { ...formData.applicableTo, id: value },
                  });
                } else {
                  toast.error(
                    "Invalid ID format (must be a 24-character hex string)"
                  );
                }
              }}
            />
          </div>
        )}

        <div>
          <label className="block mb-2">Discount Value (%)</label>
          <input
            type="number"
            min="1"
            max="100"
            className="w-full p-2 border rounded"
            value={formData.discountValue}
            onChange={(e) =>
              setFormData({ ...formData, discountValue: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block mb-2">Expiry Date</label>
          <input
            type="date"
            required
            className="w-full p-2 border rounded"
            value={formData.expiryDate}
            onChange={(e) =>
              setFormData({ ...formData, expiryDate: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block mb-2">Usage Limit</label>
          <input
            type="number"
            min="1"
            className="w-full p-2 border rounded"
            value={formData.usageLimit}
            onChange={(e) =>
              setFormData({ ...formData, usageLimit: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Voucher
        </button>
      </form>
    </div>
  );
};

export default CreateVoucher;
