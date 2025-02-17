import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserById } from "../../services/userService";
import { User } from "lucide-react";

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserById(id);
      setUser(data);
    };
    fetchUser();
  }, [id]);

  if (!user) return <p className="text-gray-600">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-8 bg-white shadow-lg rounded-lg p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-indigo-600 text-white rounded-full p-3">
          <User className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
      </div>
      <div className="space-y-4">
        <p className="text-gray-700">
          <span className="font-semibold">Username:</span> {user.username}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Phone:</span> {user.phone}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Address:</span> {user.address}
        </p>
      </div>
      <Link
        to="/users"
        className="mt-6 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
      >
        Back to Users
      </Link>
    </div>
  );
};

export default UserDetail;
