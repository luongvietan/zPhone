/* eslint-disable no-empty */
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../api";
// eslint-disable-next-line react-refresh/only-export-components
export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState({});
  const [loginStatus, setLoginStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await api.get("/products"); // Gọi API để lấy danh sách sản phẩm
      setProducts(response.data); // Sửa đổi để thiết lập products là mảng
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await api.get("/api/users"); // Gọi API để lấy danh sách sản phẩm
      setUsers(response.data); // Sửa đổi để thiết lập products là mảng
    };
    fetchUsers();
  }, []);

  // Thêm useEffect để theo dõi sự thay đổi của loginStatus
  useEffect(() => {}, [loginStatus]);

  // checkEmailExists function
  const checkEmailExists = async (email) => {
    const result = await users.find((user) => user.email === email);
    if (!result) {
      return false;
    } else {
      return true;
    }
  };
  const isTruePassword = async (password, email) => {
    const result = await users.find((user) => user.email === email);
    if (result && result.password === password) {
      return true;
    } else {
      return false;
    }
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please Select Product Size");
      return;
    }
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId] && cartData[itemId][size] !== undefined) {
      cartData[itemId][size] = quantity; // Cập nhật số lượng
    } else {
      console.error(cartData[itemId]);
    }
    setCartItems(cartData);
  };
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product.pid === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalAmount;
  };

  const value = {
    products,
    users,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    loginStatus,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    setEmail,
    setPassword,
    setLoginStatus,
    navigate,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};
export default ShopContextProvider;
