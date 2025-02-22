import axios from "axios";

const api = axios.create({
  baseURL: `https://zphone.onrender.com/`, // Địa chỉ backend
});

export default api;
