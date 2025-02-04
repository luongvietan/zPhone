import React, { useState } from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Login = () => {
  const { setEmail, setPassword, loginStatus, onSubmitHandler } =
    useContext(ShopContext);
  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-500"
    >
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
          <p className="cursor-pointer">Forgot your password ?</p>
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
