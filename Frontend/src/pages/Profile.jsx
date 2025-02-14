import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { CiEdit } from "react-icons/ci";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const { user, isLoading } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!user?._id) {
          return;
        }

        const res = await axios.get(`/api/users/${user._id}`);
        setProfileData(res.data);
        setFormData(res.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Failed to load profile data");
        toast.error("Failed to load profile data");
      }
    };

    fetchProfileData();
    fetchProvinces();
  }, [user?._id]);

  const fetchProvinces = async () => {
    try {
      const response = await fetch("https://esgoo.net/api-tinhthanh/1/0.htm");
      const data = await response.json();
      if (data.error === 0) {
        setProvinces(data.data);
      }
    } catch (error) {
      console.error("Error fetching provinces:", error);
      toast.error("Failed to load provinces");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    setFormData({
      ...formData,
      province: provinces.find((p) => p.id === provinceId).full_name,
    });
    try {
      const response = await fetch(
        `https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`
      );
      const data = await response.json();
      if (data.error === 0) {
        setDistricts(data.data);
        setWards([]);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
      toast.error("Failed to load districts");
    }
  };

  const handleDistrictChange = async (e) => {
    const districtId = e.target.value;
    setFormData({
      ...formData,
      district: districts.find((d) => d.id === districtId).full_name,
    });
    try {
      const response = await fetch(
        `https://esgoo.net/api-tinhthanh/3/${districtId}.htm`
      );
      const data = await response.json();
      if (data.error === 0) {
        setWards(data.data);
      }
    } catch (error) {
      console.error("Error fetching wards:", error);
      toast.error("Failed to load wards");
    }
  };

  const handleWardChange = (e) => {
    const wardId = e.target.value;
    const selectedWard = wards.find((w) => w.id === wardId).full_name;
    setFormData({
      ...formData,
      address: `${formData.province}, ${formData.district}, ${selectedWard}`,
    });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`/api/users/${user._id}`, formData);
      setProfileData(res.data);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);

      // Xử lý lỗi từ backend
      if (error.response && error.response.data) {
        const { data } = error.response;

        // Kiểm tra xem lỗi có phải do trùng thông tin không
        if (data.message && data.message.includes("already exists")) {
          toast.error(data.message); // Hiển thị thông báo lỗi cụ thể từ backend
        } else {
          toast.error("Failed to update profile. Please try again.");
        }
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md max-w-2xl">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Profile
      </h1>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

      {profileData && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-600">Username:</p>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="border p-2 rounded w-full mt-1"
                />
              ) : (
                <p className="text-gray-800 mt-1">{profileData.username}</p>
              )}
            </div>
            <CiEdit
              className="text-2xl cursor-pointer text-blue-600 hover:text-blue-800"
              onClick={handleEdit}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="font-semibold text-gray-600">Email:</p>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border p-2 rounded w-full mt-1"
              />
            ) : (
              <p className="text-gray-800 mt-1">{profileData.email}</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="font-semibold text-gray-600">Phone:</p>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border p-2 rounded w-full mt-1"
              />
            ) : (
              <p className="text-gray-800 mt-1">{profileData.phone}</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="font-semibold text-gray-600">Address:</p>
            {isEditing ? (
              <div className="flex flex-col space-y-2 mt-1">
                <select
                  className="border p-2 rounded"
                  onChange={handleProvinceChange}
                >
                  <option>Province / City</option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.full_name}
                    </option>
                  ))}
                </select>
                <select
                  className="border p-2 rounded"
                  onChange={handleDistrictChange}
                >
                  <option>District</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.full_name}
                    </option>
                  ))}
                </select>
                <select
                  className="border p-2 rounded"
                  onChange={handleWardChange}
                >
                  <option>Ward</option>
                  {wards.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.full_name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-gray-800 mt-1">{profileData.address}</p>
            )}
          </div>

          {isEditing && (
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
            >
              Save Changes
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
