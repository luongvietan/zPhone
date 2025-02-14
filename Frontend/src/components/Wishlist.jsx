import React, { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";

const Wishlist = ({ isWishlistOpen, toggleWishlist }) => {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const navigate = useNavigate(); // Hook điều hướng trang

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={toggleWishlist}
      ></div>

      {/* Wishlist Panel */}
      <div className="relative w-96 bg-white shadow-lg rounded-l-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b bg-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Your Wishlist</h2>
          <button
            onClick={toggleWishlist}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoClose className="w-6 h-6" />
          </button>
        </div>

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Your wishlist is empty.
          </div>
        ) : (
          <div className="p-6 max-h-[400px] overflow-y-auto">
            <ul className="space-y-5">
              {wishlistItems.map((item) => (
                <li
                  key={item.product_id}
                  className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => {
                    toggleWishlist(); // Đóng Wishlist khi chuyển trang
                    navigate(`/product/${item.product_id}`);
                  }}
                >
                  {/* Hình ảnh sản phẩm */}
                  <img
                    src={`http://localhost:5000/phone_images/${item.product_image}.png`}
                    alt={item.product_name}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />

                  {/* Thông tin sản phẩm */}
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {item.product_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {(item.price * 1000000).toLocaleString()} VND
                    </p>
                  </div>

                  {/* Nút xóa */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn click vào nút xóa dẫn đến chuyển trang
                      removeFromWishlist(item.product_id);
                    }}
                    className="ml-3 text-red-500 hover:text-red-700"
                  >
                    <IoClose className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
