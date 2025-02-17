import {
  Dashboard,
  People,
  ShoppingCart,
  Inventory,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-5">
      <h2 className="text-2xl font-bold mb-5">Admin Panel</h2>
      <ul>
        <li className="mb-4">
          <Link to="/" className="flex items-center gap-2">
            <Dashboard /> Dashboard
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/users" className="flex items-center gap-2">
            <People /> Users
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/products" className="flex items-center gap-2">
            <Inventory /> Products
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/orders" className="flex items-center gap-2">
            <ShoppingCart /> Orders
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
