/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../api";

export const ShopContext = createContext(null);

export const ShopContextProvider = ({ children }) => {
  const currency = "VND";
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // Thêm kiểm tra để tránh lỗi
    const filtered = products.filter((product) => {
      if (!product || !product.name) return false;
      return product.name.toLowerCase().includes((search || "").toLowerCase());
    });
    setFilteredProducts(filtered);
  }, [search, products]);

  const contextValue = {
    products,
    currency,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    navigate,
    filteredProducts,
  };

  return (
    <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
