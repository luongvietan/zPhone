import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  BadgePercent,
} from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white h-auto p-5">
      <h2 className="text-2xl font-bold mb-5">zPhone Admin</h2>
      <ul>
        <li className="mb-4">
          <Link
            to="/"
            className="flex items-center gap-2 hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
        </li>
        <li className="mb-4">
          <Link
            to="/users"
            className="flex items-center gap-2 hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <Users className="w-5 h-5" /> Users
          </Link>
        </li>
        <li className="mb-4">
          <Link
            to="/products"
            className="flex items-center gap-2 hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <Package className="w-5 h-5" /> Products
          </Link>
        </li>
        <li className="mb-4">
          <Link
            to="/orders"
            className="flex items-center gap-2 hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <ShoppingCart className="w-5 h-5" /> Orders
          </Link>
        </li>
        <li className="mb-4">
          <Link
            to="/promotions"
            className="flex items-center gap-2 hover:bg-gray-800 p-2 rounded-lg transition-colors"
          >
            <BadgePercent className="w-5 h-5" /> Promotions
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
