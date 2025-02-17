import { Notifications, Settings } from "@mui/icons-material";

const Navbar = () => {
  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <div className="flex gap-4">
        <Notifications className="text-gray-600 cursor-pointer" />
        <Settings className="text-gray-600 cursor-pointer" />
      </div>
    </div>
  );
};

export default Navbar;
