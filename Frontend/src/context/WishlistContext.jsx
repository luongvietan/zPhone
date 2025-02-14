import { createContext, useState, useEffect } from "react";
import axios from "../config/axios";

// eslint-disable-next-line react-refresh/only-export-components
export const WishlistContext = createContext({
  wishlistItems: [],
  isWishlistOpen: false,
  getWishlist: () => {},
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  toggleWishlist: () => {},
  loading: false,
  error: null,
});

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getWishlist = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/wishlist");
      setWishlistItems(response.data.items);
    } catch (err) {
      console.error("Error fetching wishlist", err);
      setError(err.response?.data?.message || "Error fetching wishlist");
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/wishlist/add", product);
      setWishlistItems(response.data.items);
    } catch (err) {
      console.error("Error adding to wishlist", err);
      setError(err.response?.data?.message || "Error adding to wishlist");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (product_id) => {
    try {
      setLoading(true);
      const response = await axios.delete("/api/wishlist/remove", {
        data: { product_id },
      });
      setWishlistItems(response.data.items);
    } catch (err) {
      console.error("Error removing from wishlist", err);
      setError(err.response?.data?.message || "Error removing from wishlist");
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (product_id) => {
    return wishlistItems.some((item) => item.product_id === product_id);
  };

  const toggleWishlist = () => {
    setIsWishlistOpen((prev) => !prev);
  };

  useEffect(() => {
    // Lấy wishlist khi ứng dụng khởi động (nếu cần)
    getWishlist();
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isWishlistOpen,
        getWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        loading,
        error,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
