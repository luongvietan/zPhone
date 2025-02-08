import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { fetchCart } = useContext(CartContext);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Logging in...");

    try {
      const result = await login(email, password);

      if (result.success) {
        await fetchCart();
        toast.update(loadingToast, {
          render: "Login successful!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        navigate("/");
      } else {
        toast.update(loadingToast, {
          render: result.error,
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.update(loadingToast, {
        render: "Login failed!",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-500"
    >
      <ToastContainer position="top-center" />
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">Login</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <Link to="/recovery">
          <p className="cursor-pointer">Forgot your password?</p>
        </Link>
        <Link to="/register">
          <p className="cursor-pointer">Create new account</p>
        </Link>
      </div>
      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        Sign In
      </button>
    </form>
  );
};

export default Login;
