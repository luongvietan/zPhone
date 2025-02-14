import React, { useContext, useState, useEffect } from "react";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { ShopContext } from "../context/ShopContext";
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { FaHeart } from "react-icons/fa";
import { WishlistContext } from "../context/WishlistContext";
import Wishlist from "../components/Wishlist";

const Navibar = () => {
  const navigate = useNavigate();
  const { setShowSearch } = useContext(ShopContext);
  const { toggleCart, cartItems } = useContext(CartContext);
  const [cartCount, setCartCount] = useState(0);
  const { user, logout } = useAuth();
  const { isWishlistOpen, toggleWishlist } = useContext(WishlistContext);

  useEffect(() => {
    const totalCount = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    setCartCount(totalCount);
  }, [cartItems]);

  return (
    <>
      <Navbar fluid rounded>
        <Navbar.Brand as={Link} to="/">
          <img src="/logo.png" className="mr-3 h-6 sm:h-9" alt="ZPHONE Logo" />
        </Navbar.Brand>
        <div className="flex md:order-2 space-x-2">
          <button
            onClick={toggleWishlist}
            className="relative p-2 hover:bg-gray-100 rounded-full"
          >
            <FaHeart className="w-4 h-4" />
          </button>
          {isWishlistOpen && (
            <Wishlist
              isWishlistOpen={isWishlistOpen}
              toggleWishlist={toggleWishlist}
            />
          )}
          <button
            onClick={toggleCart}
            className="relative p-2 hover:bg-gray-100 rounded-full mr-2"
          >
            <PiShoppingCartSimpleFill className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img={user?.avatar || "https://thispersondoesnotexist.com/"}
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">
                {user?.username || "Guess mode"}
              </span>
              <span className="block truncate text-sm font-medium">
                {user?.email || ""}
              </span>
            </Dropdown.Header>
            {user ? (
              <>
                <Dropdown.Item href="/dashboard">Dashboard</Dropdown.Item>
                <Dropdown.Item href="/profile">Settings</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={logout}>Sign out</Dropdown.Item>
              </>
            ) : (
              <>
                <Dropdown.Item href="/login">Login</Dropdown.Item>
                <Dropdown.Item href="/register">Register</Dropdown.Item>
              </>
            )}
          </Dropdown>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Link
            to="/"
            className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
          >
            Home
          </Link>
          <Link
            to="/collection"
            className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
          >
            Collection
          </Link>
          <Link
            to="/about"
            className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
          >
            Contact
          </Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default Navibar;
