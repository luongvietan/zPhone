import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "../config/axios";
import { Link } from "react-router-dom";
const Cart = () => {
  const {
    cartItems = [], // Provide default empty array
    removeFromCart,
    updateQuantity,
    isCartOpen,
    toggleCart,
    loading,
    error,
  } = useContext(CartContext);

  // Chỉ tính toán khi cartItems có giá trị
  const subtotal =
    cartItems?.reduce((sum, item) => {
      return sum + Number(item.price) * Number(item.quantity);
    }, 0) || 0;

  const { user } = useAuth(); // Lấy thông tin người dùng
  const userCity = user?.address?.split(",")[0]?.trim(); // Lấy thành phố từ địa chỉ

  const shipping = userCity === "Thành phố Hồ Chí Minh" ? 0 : 0.08;

  const total = subtotal + shipping;

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={toggleCart}
      ></div>

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md">
          <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 py-6 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Your Cart</h2>
              <button
                type="button"
                className="rounded-md text-gray-400 hover:text-gray-500"
                onClick={toggleCart}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex-1 px-4 py-6 sm:px-6">
                <div className="text-center">
                  <p className="mt-1 text-gray-500">Loading...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex-1 px-4 py-6 sm:px-6">
                <div className="text-center text-red-500">
                  <p className="mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Empty Cart */}
            {!loading && !error && (!cartItems || cartItems.length === 0) && (
              <div className="flex-1 px-4 py-6 sm:px-6">
                <div className="text-center">
                  <p className="mt-1 text-gray-500">Your cart is empty</p>
                </div>
              </div>
            )}

            {/* Cart Items */}
            {!loading && !error && cartItems && cartItems.length > 0 && (
              <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <div className="flow-root">
                  <ul className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <li
                        key={`${item.product_id}-${item.storage}`}
                        className="flex py-6"
                      >
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={
                              item.product_image
                                ? `${axios.defaults.baseURL}/phone_images/${item.product_image}.png`
                                : ""
                            }
                            alt={item.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>

                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>{item.product_name}</h3>
                              <p className="ml-4">
                                {(
                                  Number(item.price) * 1000000
                                ).toLocaleString()}{" "}
                                VND
                              </p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.storage}
                            </p>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <div className="flex items-center">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product_id,
                                    item.storage,
                                    Math.max(0, item.quantity - 1)
                                  )
                                }
                                className="px-2 py-1 border rounded-l"
                                disabled={loading}
                              >
                                -
                              </button>
                              <span className="px-4 py-1 border-t border-b">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product_id,
                                    item.storage,
                                    item.quantity + 1
                                  )
                                }
                                className="px-2 py-1 border rounded-r"
                                disabled={loading}
                              >
                                +
                              </button>
                            </div>
                            <p className="ml-4">
                              {(
                                Number(item.price) *
                                item.quantity *
                                1000000
                              ).toLocaleString()}{" "}
                              VND
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                removeFromCart(item.product_id, item.storage)
                              }
                              className="font-medium text-red-600 hover:text-red-500"
                              disabled={loading}
                            >
                              X
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Cart Summary */}
            {!loading && !error && cartItems && cartItems.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>{(subtotal * 1000000).toLocaleString()} VND</p>
                </div>
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Shipping</p>
                  <p>{(shipping * 1000000).toLocaleString()} VND</p>
                </div>
                <div className="mt-2 flex justify-between text-base font-medium text-gray-900">
                  <p>Total</p>
                  <p>{(total * 1000000).toLocaleString()} VND</p>
                </div>
                <div className="mt-6">
                  <Link
                    className="group inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-6 py-4 text-lg font-semibold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800 disabled:opacity-50"
                    to="/checkout"
                    onClick={toggleCart}
                    disabled={loading}
                  >
                    Checkout
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="group-hover:ml-8 ml-4 h-6 w-6 transition-all"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
