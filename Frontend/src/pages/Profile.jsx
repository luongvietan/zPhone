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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {profileData && (
        <div className="space-y-4">
          <div>
            <p className="font-semibold">Username:</p>
            <p>{profileData.username}</p>
          </div>
          <div>
            <p className="font-semibold">Email:</p>
            <p>{profileData.email}</p>
          </div>
          <div>
            <p className="font-semibold">Phone:</p>
            <p>{profileData.phone}</p>
          </div>
          <div>
            <p className="font-semibold">Address:</p>
            <p>{profileData.address}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
