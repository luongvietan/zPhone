import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        password,
        id,
        address,
        phone,
      });
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-500"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">Sign up</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        required
      />
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
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="ID"
        onChange={(e) => setId(e.target.value)}
        required
      />
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Address"
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      <input
        type="number"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Phone"
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <Link to="/recovery">
          <p className="cursor-pointer">Forgot your password ?</p>
        </Link>
        <Link to="/login">
          <p className="cursor-pointer">Login here</p>
        </Link>
      </div>
      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        Sign Up
      </button>
    </form>
  );
};

export default Register;
