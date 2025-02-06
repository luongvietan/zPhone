import { createContext, useContext, useState, useEffect } from "react";
import axios from "../config/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // const fetchUserProfile = async () => {
  //   try {
  //     const res = await axios.get("/auth/me");
  //     setUser(res.data.user);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return;

      const res = await axios.post("/auth/refresh-token", { refreshToken });
      localStorage.setItem("token", res.data.token);
      return res.data.token;
    } catch (error) {
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, logout }} //fetchUserProfile
    >
      {children}
    </AuthContext.Provider>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
