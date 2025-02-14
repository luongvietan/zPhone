import { createContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "../config/axios";

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  isCartOpen: false,
  toggleCart: () => {},
  getCartTotal: () => 0,
  loading: false,
  error: null,
});

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const auth = useAuth();

  useEffect(() => {
    if (auth?.user) {
      fetchCart();
    } else {
      // Reset cart when user logs out
      setCartItems([]);
      setIsCartOpen(false);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.user]);

  const fetchCart = async () => {
    if (!auth?.user) return;

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get("/api/cart");
      console.log("Cart data from server:", response.data);
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      const errorMessage =
        error.response?.data?.message || "Error fetching cart";
      setError(errorMessage);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    if (!auth?.user) return;

    try {
      setLoading(true);
      const response = await axios.post("/api/cart/add", {
        product_id: product.product_id,
        storage: product.storage,
        quantity: 1,
      });
      setCartItems(response.data.items);
    } catch (error) {
      setError(error.response?.data?.message || "Error adding to cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, storage, newQuantity) => {
    if (!auth?.user) return;

    try {
      setLoading(true);
      if (newQuantity < 1) {
        await removeFromCart(productId, storage);
        return;
      }
      const response = await axios.put("/api/cart/update", {
        product_id: productId,
        storage,
        quantity: newQuantity,
      });
      setCartItems(response.data.items);
    } catch (error) {
      setError(error.response?.data?.message || "Error updating quantity");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId, storage) => {
    if (!auth?.user) return;

    try {
      setLoading(true);
      await axios.delete("/api/cart/remove", {
        data: { product_id: productId, storage },
      });
      setCartItems((prev) =>
        prev.filter(
          (item) => !(item.product_id === productId && item.storage === storage)
        )
      );
    } catch (error) {
      setError(error.response?.data?.message || "Error removing item");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!auth?.user) return;

    try {
      setLoading(true);
      await axios.delete("/api/cart/clear");
      setCartItems([]);
    } catch (error) {
      setError(error.response?.data?.message || "Error clearing cart");
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        toggleCart: () => setIsCartOpen(!isCartOpen),
        getCartTotal,
        loading,
        error,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
