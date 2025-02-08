import { createContext, useContext, useState, useEffect } from "react";
import axios from "../config/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      setAuthToken(token);
      const res = await axios.get("/api/auth/me");

      if (res.data.user) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      if (error.response?.status === 401) {
        setAuthToken(null);
        setUser(null);
      }
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });

      const { token, user: userData } = res.data;
      setAuthToken(token);
      setUser(userData);

      return {
        success: true,
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    window.location.href = "/login"; // Force reload after logout
  };

  const value = {
    user,
    isLoading,
    isInitialized,
    login,
    logout,
    fetchUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
