import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../config/axios";

const Profile = () => {
  const { user, isLoading } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!user?._id) {
          return;
        }

        const res = await axios.get(`/api/users/${user._id}`);
        setProfileData(res.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Failed to load profile data");
      }
    };

    fetchProfileData();
  }, [user?._id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Profile
      </h1>

      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

      {profileData && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="font-semibold">Username:</p>
            <p className="text-gray-700">{profileData.username}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="font-semibold">Email:</p>
            <p className="text-gray-700">{profileData.email}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="font-semibold">Phone:</p>
            <p className="text-gray-700">{profileData.phone}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="font-semibold">Address:</p>
            <p className="text-gray-700">{profileData.address}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
