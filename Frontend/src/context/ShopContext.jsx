/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../api";

export const ShopContext = createContext();

// Sửa cách nhận props
export const ShopProvider = ({ children }) => {
  const currency = "VND";
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await api.get("/products"); // Gọi API để lấy danh sách sản phẩm
      setProducts(response.data); // Sửa đổi để thiết lập products là mảng
    };
    fetchProducts();
  }, []);

  const value = {
    products,
    currency,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    navigate,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContext;
