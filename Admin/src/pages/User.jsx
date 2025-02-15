import React, { useEffect, useState } from "react";
import api from "../api";

const User = () => {
  const [users, setUsers] = useState([]);

  const removeUser = async (id) => {
    await api.delete(`/users/${id}`);
    setUsers(users.filter((user) => user.id !== id));
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await api.get("/users");
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">UID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Password</th>
              <th className="px-2 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                key={user.id}
              >
                <td className="px-4 py-4">{user.id}</td>
                <td className="px-4 py-4">
                  {user.first_name} {user.last_name}
                </td>
                <td className="px-4 py-4">{user.email}</td>
                <td className="px-4 py-4">{user.password}</td>
                <td className="px-4 py-4"></td>
                {/* <td className="px-6 py-4">
                  <button
                    className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                    onClick={() => removeUser(user.id)}
                  >
                    Remove
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;
