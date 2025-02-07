import { createContext, useContext, useState, useEffect } from "react";
import axios from "../config/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const res = await axios.get("/api/auth/me", {
        // Thêm /api vào đường dẫn
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password }); // Thêm /api vào đường dẫn
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed!",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, fetchUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
