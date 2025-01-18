import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // Địa chỉ backend
});

export default api;
