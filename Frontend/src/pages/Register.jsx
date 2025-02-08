import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLastUserId = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        const lastUser = response.data[response.data.length - 1];
        const newId = String(Number(lastUser.id) + 1);
        setId(newId);
      } catch (error) {
        console.error("Error fetching last user ID:", error);
      }
    };

    fetchLastUserId();

    const fetchProvinces = async () => {
      const response = await fetch("https://esgoo.net/api-tinhthanh/1/0.htm");
      const data = await response.json();
      if (data.error === 0) {
        setProvinces(data.data);
      }
    };

    fetchProvinces();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Creating account...");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username,
          email,
          password,
          id, // Ensure this is being sent
          address,
          phone,
        }
      );

      toast.update(loadingToast, {
        render: "Registration successful! Please login.",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Full Registration Error:", error.response?.data);

      const errorMessage = error.response?.data?.errors
        ? error.response.data.errors.join(", ")
        : error.response?.data?.message || "Registration failed!";

      toast.update(loadingToast, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinces.find((p) => p.id === provinceId).full_name);
    const response = await fetch(
      `https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`
    );
    const data = await response.json();
    if (data.error === 0) {
      setDistricts(data.data);
      setWards([]);
      setAddress("");
    }
  };

  const handleDistrictChange = async (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districts.find((d) => d.id === districtId).full_name);
    const response = await fetch(
      `https://esgoo.net/api-tinhthanh/3/${districtId}.htm`
    );
    const data = await response.json();
    if (data.error === 0) {
      setWards(data.data);
    }
  };

  const handleWardChange = (e) => {
    const wardId = e.target.value;
    const selectedWard = wards.find((w) => w.id === wardId).full_name;
    setAddress(`${selectedProvince}, ${selectedDistrict}, ${selectedWard}`);
  };

  return (
    <form
      onSubmit={handleRegister}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-500"
    >
      <ToastContainer />
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
      {/* <input
        type="text"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="ID"
        value={id}
        readOnly
      />
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Address"
        value={address}
        readOnly
      /> */}
      <div className="flex justify-between w-full">
        <div className="css_select_div flex-1 mx-1">
          <select
            className="css_select w-full"
            id="tinh"
            name="tinh"
            title="Province / City"
            onChange={handleProvinceChange}
          >
            <option value="0">City</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.full_name}
              </option>
            ))}
          </select>
        </div>
        <div className="css_select_div flex-1 mx-1">
          <select
            className="css_select w-full"
            id="quan"
            name="quan"
            title="District"
            onChange={handleDistrictChange}
          >
            <option value="0">District</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.full_name}
              </option>
            ))}
          </select>
        </div>
        <div className="css_select_div flex-1 mx-1">
          <select
            className="css_select w-full"
            id="phuong"
            name="phuong"
            title="Ward"
            onChange={handleWardChange}
          >
            <option value="0">Ward</option>
            {wards.map((ward) => (
              <option key={ward.id} value={ward.id}>
                {ward.full_name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Phone"
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <Link to="/recovery">
          <p className="cursor-pointer">Forgot your password?</p>
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
