import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { IoMdStar, IoMdStarHalf } from "react-icons/io";
import { WishlistContext } from "../context/WishlistContext";
import axios from "axios";

const ProductItem = ({
  product_id,
  product_image,
  product_name,
  price,
  stock_quantity,
}) => {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(WishlistContext);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/products/${product_id}/average-rating`
        );
        setAverageRating(parseFloat(response.data.averageRating)); // Chuyển thành số
      } catch (error) {
        console.error("Error fetching average rating:", error);
      }
    };

    fetchAverageRating();
  }, [product_id]);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (isInWishlist(product_id)) {
      removeFromWishlist(product_id);
    } else {
      addToWishlist({
        product_id,
        product_name,
        price,
        product_image: product_image[0],
      });
    }
  };

  const handleClick = () => {
    if (stock_quantity > 0) {
      navigate(`/product/${product_id}`);
    }
  };

  const renderStars = () => {
    const fullStars = Math.floor(averageRating);
    const halfStar = averageRating - fullStars >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    let stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <IoMdStar key={`full-${i}`} className="h-5 w-5 text-yellow-500" />
      );
    }
    if (halfStar) {
      stars.push(
        <IoMdStarHalf key="half" className="h-5 w-5 text-yellow-500" />
      );
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <IoMdStar key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
      );
    }
    return stars;
  };

  const isOutOfStock = stock_quantity === 0;

  return (
    <div
      className={`hover:scale-110 transition ease-in-out relative m-3 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md cursor-pointer ${
        isOutOfStock ? "opacity-50" : ""
      }`}
      onClick={handleClick}
    >
      <Link
        className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl"
        to={`/product/${product_id}`}
      >
        <img
          className="object-cover"
          src={`${import.meta.env.VITE_API_URL}/phone_images/${
            product_image[0]
          }.png`}
          alt={product_image[0]}
        />
        {isOutOfStock && (
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white px-4 py-2 rounded-full">
            Sold out
          </span>
        )}
        {/* <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">
          39% OFF
        </span> */}
      </Link>

      <div className="mt-4 px-5 pb-5">
        <Link to={`/product/${product_id}`}>
          <h5 className="text-xl tracking-tight text-slate-900">
            {product_name}
          </h5>
        </Link>

        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-xl font-bold text-slate-900">
              {(price * 1000000).toLocaleString()} VND
            </span>
          </p>
        </div>

        <div className="flex items-center">
          {renderStars()}
          <span className="mr-2 ml-3 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">
            {averageRating?.toFixed(1) || "0.0"}
          </span>
          <button
            onClick={handleWishlistClick}
            className="ml-auto p-2 rounded-full transition-colors duration-200"
          >
            {isInWishlist(product_id) ? (
              <FaHeart className="w-6 h-6 text-red-500" />
            ) : (
              <CiHeart className="w-6 h-6 text-gray-500" />
            )}
          </button>
        </div>

        <br />

        <button
          className={`flex items-center justify-center w-full rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
            isOutOfStock ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isOutOfStock}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {isOutOfStock ? "Sold out" : "Add to cart"}
        </button>
      </div>
    </div>
  );
};

ProductItem.propTypes = {
  product_id: PropTypes.number.isRequired,
  product_image: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  product_name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  stock_quantity: PropTypes.number.isRequired, // Thêm prop stock_quantity
};

export default ProductItem;
