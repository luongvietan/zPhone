import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/users`;

// Lấy tất cả user
export const getUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data.map((user) => ({
    ...user,
    id: user._id, // Chuyển _id thành id
  }));
};

// Lấy chi tiết user
export const getUserById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return { ...response.data, id: response.data._id };
};

// Cập nhật user
export const updateUser = async (id, userData) => {
  const response = await axios.put(`${API_URL}/${id}`, userData);
  return response.data;
};

// Xóa user
export const deleteUser = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
