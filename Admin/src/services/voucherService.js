import axios from "../config/axios";

export const createVoucher = async (voucherData) => {
  const response = await axios.post("/api/vouchers", voucherData);
  return response.data;
};

export const getVouchers = async () => {
  const response = await axios.get("/api/vouchers");
  return response.data;
};

export const updateVoucher = async (id, voucherData) => {
  const response = await axios.put(`/api/vouchers/${id}`, voucherData);
  return response.data;
};

export const deleteVoucher = async (id) => {
  const response = await axios.delete(`/api/vouchers/${id}`);
  return response.data;
};
export const getVoucherById = async (id) => {
  const response = await axios.delete(`/api/vouchers/${id}`);
  return response.data;
};
