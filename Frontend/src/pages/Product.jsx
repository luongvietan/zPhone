import React, { useContext, useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import RelatedProducts from "../components/RelatedProducts";
import axios from "axios";
import { IoMdStar } from "react-icons/io";
import { IoMdStarHalf } from "react-icons/io";

export const Product = () => {
  const { product_id } = useParams();
  const { products, currency } = useContext(ShopContext);
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(WishlistContext);
  const { user } = useAuth();

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [activeTab, setActiveTab] = useState("description");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState("");
  const [canReview, setCanReview] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);

  const isOutOfStock = productData?.stock_quantity === 0;
  // Fetch comments
  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${product_id}/comments`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // console.log(data);

      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Submit comment
  const handleCommentSubmit = async () => {
    if (!comment.trim() || !user?.username) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${product_id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user: user.username, content: comment }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setComments([...comments, data.comment]);
      setComment("");
      toast.success("Comment updated!");
      fetchComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  // Fetch product data
  const fetchProductData = useCallback(() => {
    if (products && products.length > 0 && product_id) {
      const foundProduct = products.find(
        (item) => item.product_id === parseInt(product_id)
      );
      if (foundProduct) {
        setProductData(foundProduct);
        setImage(foundProduct.product_image[0]);
        setSize(foundProduct.variants[0].storage);
        setSelectedVariant(foundProduct.variants[0]);
      }
    }
  }, [products, product_id]);

  // Check if user has purchased the product
  const checkPurchaseStatus = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const userOrders = response.data;
      const hasPurchased = userOrders.some((order) =>
        order.items.some((item) => item.product_id === parseInt(product_id))
      );
      setCanReview(hasPurchased);
      if (!hasPurchased) {
        setMessage("You have to buy this product before reviewing.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/${product_id}/reviews`
      );
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // Submit review
  const handleReviewSubmit = async () => {
    if (!canReview || !userReview.trim() || selectedRating === 0) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/products/${product_id}/reviews`,
        {
          user: user.username,
          review: userReview,
          rating: selectedRating,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setReviews(response.data.reviews);
      setUserReview("");
      setSelectedRating(0);
      toast.success("Review updated!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error submitting review.");
    }
  };

  useEffect(() => {
    fetchComments();
    fetchProductData();
    checkPurchaseStatus();
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchProductData, product_id]);

  const handleQuantityChange = (event) => {
    const value =
      event.target.value === "" || event.target.value === "0"
        ? 1
        : Number(event.target.value);
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("Product is out of stock.");
      return;
    }

    if (productData && selectedVariant) {
      const price = selectedVariant.product_price * 1000000;

      const productToAdd = {
        product_id: productData.product_id,
        product_name: productData.product_name,
        price: price,
        product_image: productData.product_image,
        storage: selectedVariant.storage,
      };
      toast.success("Added To Cart");
      addToCart(productToAdd);
    }
  };

  const handleWishlistClick = () => {
    if (!productData) return;

    if (isInWishlist(productData.product_id)) {
      removeFromWishlist(productData.product_id);
      toast.info("Removed from Wishlist");
    } else {
      addToWishlist({
        product_id: productData.product_id,
        product_name: productData.product_name,
        price: selectedVariant.product_price,
        product_image: productData.product_image[0],
      });
      toast.success("Added to Wishlist");
    }
  };

  const renderStars = (rating) => {
    const rounded = Math.round(rating * 2) / 2;
    const fullStars = Math.floor(rounded);
    const halfStar = rounded - fullStars === 0.5 ? 1 : 0;
    let stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <IoMdStar key={`full-${i}`} className="text-yellow-500 text-xl" />
      );
    }
    if (halfStar) {
      stars.push(
        <IoMdStarHalf key="half" className="text-yellow-500 text-xl" />
      );
    }
    return stars;
  };
  let averageRating = 0;
  if (reviews.length > 0) {
    const total = reviews.reduce((acc, cur) => acc + cur.rating, 0);
    averageRating = Math.round((total / reviews.length) * 2) / 2;
  }
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/products/${product_id}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setComments(comments.filter((comment) => comment._id !== commentId));
        toast.success("Comment deleted successfully");
      }
    } catch (error) {
      toast.error("Error deleting comment");
    }
  };

  // Thêm hàm xử lý xóa review
  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/products/${product_id}/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setReviews(reviews.filter((review) => review._id !== reviewId));
        toast.success("Review deleted successfully");
      }
    } catch (error) {
      toast.error("Error deleting review");
    }
  };
  return (
    <div>
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <nav className="flex">
            <ol role="list" className="flex items-center">
              <li className="text-left">
                <a href="/" className="text-gray-600 hover:text-gray-800">
                  Home
                </a>
              </li>
              <li className="text-left mx-2 text-gray-400">/</li>
              <li className="text-left">
                <a
                  href="/collection"
                  className="text-gray-600 hover:text-gray-800"
                >
                  Collection
                </a>
              </li>
              <li className="text-left mx-2 text-gray-400">/</li>
              <li className="text-left text-gray-800 font-bold">
                {productData?.product_name}
              </li>
            </ol>
          </nav>

          <div className="lg:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-3 lg:row-end-1">
              <div className="lg:flex lg:items-start">
                <div className="lg:order-2 lg:ml-5">
                  <div className="max-w-xl overflow-hidden rounded-lg transition-transform duration-300 hover:scale-110">
                    <img
                      className="h-full w-full max-w-full object-cover transition-transform duration-300"
                      src={`${
                        import.meta.env.VITE_API_URL
                      }/Phone_images/${image}.png`}
                      alt={`${
                        import.meta.env.VITE_API_URL
                      }/Phone_images/${image}.png`}
                    />
                  </div>
                </div>

                <div className="mt-2 w-full lg:order-1 lg:w-32 lg:flex-shrink-0">
                  <div className="flex flex-row items-start lg:flex-col">
                    {productData?.product_image.map((img, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 transition-transform duration-300 hover:scale-110 ${
                          image === img
                            ? "border-gray-900"
                            : "border-transparent"
                        } text-center`}
                        onClick={() => setImage(img)}
                      >
                        <img
                          className="h-full w-full object-cover"
                          src={`${
                            import.meta.env.VITE_API_URL
                          }/Phone_images/${img}.png`}
                          alt=""
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 lg:row-span-2 lg:row-end-2">
              <button
                type="button"
                onClick={handleWishlistClick}
                className="mt-4 flex items-center space-x-2 rounded-md border px-5 py-2 text-gray-900 transition hover:bg-gray-900 hover:text-white"
              >
                {isInWishlist(productData?.product_id) ? (
                  <FaHeart className="w-5 h-5 text-red-500" />
                ) : (
                  <CiHeart className="w-5 h-5" />
                )}
                <span>
                  {isInWishlist(productData?.product_id)
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"}
                </span>
              </button>
              <br />
              <h1 className="sm: text-2xl font-bold text-gray-900 sm:text-3xl">
                {productData?.product_name}
              </h1>
              <div className="mb-4 flex items-center">
                <span className="font-semibold mr-2">Average Rating:</span>
                {reviews.length > 0 ? (
                  <>
                    {renderStars(averageRating)}
                    <span className="ml-2 text-sm">
                      ({averageRating} out of 5)
                    </span>
                  </>
                ) : (
                  <span className="text-sm">No ratings yet</span>
                )}
              </div>

              <h2 className="mt-8 text-base text-gray-900">Storage</h2>
              <div className="mt-3 flex select-none flex-wrap items-center gap-1">
                {productData?.variants.map((variant, index) => (
                  <label key={index} className="">
                    <input
                      type="radio"
                      name="storage"
                      value={variant.storage}
                      className="peer sr-only"
                      defaultChecked={index === 0}
                      onChange={() => {
                        setSize(variant.storage);
                        setSelectedVariant(variant);
                      }}
                    />
                    <p className="peer-checked:bg-black peer-checked:text-white rounded-lg border border-black px-6 py-2 font-bold">
                      {variant.storage}
                    </p>
                    <span className="mt-1 block text-center text-xs">
                      {(variant.product_price * 1000000).toLocaleString()} VND
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-10 flex flex-col items-center justify-between space-y-4 border-t border-b py-4 sm:flex-row sm:space-y-0">
                <div className="flex items-end">
                  <h1 className="text-3xl font-bold">
                    {(selectedVariant
                      ? selectedVariant.product_price * 1000000
                      : productData?.variants[0]?.product_price * 1000000
                    ).toLocaleString()}{" "}
                    VND
                  </h1>
                </div>

                {isOutOfStock ? (
                  <div className="text-red-500 font-bold">Sold out</div>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="inline-flex items-center justify-center rounded-md border-2 border-transparent bg-gray-900 bg-none px-12 py-3 text-center text-base font-bold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="shrink-0 mr-3 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    Add to cart
                  </button>
                )}
              </div>

              <div className="lg:col-span-3">
                <div className="border-b border-gray-300">
                  <nav className="flex gap-4">
                    <a
                      onClick={() => setActiveTab("description")}
                      className={`border-b-2 py-4 text-sm font-medium ${
                        activeTab === "description"
                          ? "border-gray-900 text-gray-900"
                          : "border-gray-400 text-gray-400 hover:border-gray-400 hover:text-gray-800"
                      }`}
                    >
                      Description
                    </a>
                    <a
                      onClick={() => setActiveTab("comment")}
                      className={`border-b-2 py-4 text-sm font-medium ${
                        activeTab === "comment"
                          ? "border-gray-900 text-gray-900"
                          : "border-gray-400 text-gray-400 hover:border-gray-400 hover:text-gray-800"
                      }`}
                    >
                      Comment
                    </a>
                    <a
                      onClick={() => setActiveTab("review")}
                      className={`border-b-2 py-4 text-sm font-medium ${
                        activeTab === "review"
                          ? "border-gray-900 text-gray-900"
                          : "border-gray-400 text-gray-400 hover:border-gray-400 hover:text-gray-800"
                      }`}
                    >
                      Review
                    </a>
                  </nav>
                </div>

                {activeTab === "description" && (
                  <div className="mt-8 flow-root sm:mt-12">
                    <p className="mt-4">{productData?.product_description}</p>
                  </div>
                )}

                {activeTab === "comment" && (
                  <div className="mt-4">
                    <textarea
                      className="w-full border border-gray-300 rounded-md p-2"
                      rows="4"
                      placeholder="Type your comments..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                      type="button"
                      className="mt-2 inline-flex items-center justify-center rounded-md border-2 border-transparent bg-gray-900 px-4 py-2 text-base font-bold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800"
                      onClick={handleCommentSubmit}
                    >
                      Send
                    </button>

                    <div className="mt-6">
                      <h3 className="text-lg font-semibold">Comments:</h3>
                      {comments.length > 0 ? (
                        <ul className="mt-2">
                          {comments.map((cmt, index) => (
                            <li key={index} className="border-b py-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-bold">{cmt.user}:</p>
                                  <p>{cmt.content}</p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(cmt.createdAt).toLocaleString()}
                                  </p>
                                </div>
                                {user?.username === cmt.user && (
                                  <button
                                    onClick={() => handleDeleteComment(cmt._id)}
                                    className="text-red-500 hover:text-red-700 ml-4"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No comments yet.</p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "review" && (
                  <div className="mt-4">
                    {/* Phần nhập review chỉ hiện khi canReview = true */}
                    {canReview ? (
                      <div>
                        <div className="my-4">
                          <p className="font-semibold">Your Rating:</p>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <IoMdStar
                                key={star}
                                className={`cursor-pointer text-2xl ${
                                  selectedRating >= star
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                }`}
                                onClick={() => setSelectedRating(star)}
                              />
                            ))}
                          </div>
                        </div>
                        <textarea
                          className="w-full border border-gray-300 rounded-md p-2"
                          rows="4"
                          placeholder="Write your reviews..."
                          value={userReview}
                          onChange={(e) => setUserReview(e.target.value)}
                        />
                        <button
                          type="button"
                          className="mt-2 inline-flex items-center justify-center rounded-md border-2 border-transparent bg-gray-900 px-4 py-2 text-base font-bold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800"
                          onClick={handleReviewSubmit}
                        >
                          Send reviews
                        </button>
                      </div>
                    ) : (
                      <p className="text-red-500 mt-4">{message}</p>
                    )}

                    {/* Luôn hiển thị danh sách reviews */}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold">Reviews:</h3>
                      {reviews.length > 0 ? (
                        <ul className="mt-2">
                          {reviews.map((review, index) => (
                            <li key={index} className="border-b py-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center">
                                    <p className="font-bold">{review.user}</p>
                                    <div className="ml-2 flex">
                                      {renderStars(review.rating)}
                                    </div>
                                  </div>
                                  <p>{review.review}</p>
                                  <p className="text-sm text-gray-500">
                                    {new Date(
                                      review.createdAt
                                    ).toLocaleString()}
                                  </p>
                                </div>
                                {user?.username === review.user && (
                                  <button
                                    onClick={() =>
                                      handleDeleteReview(review._id)
                                    }
                                    className="text-red-500 hover:text-red-700 ml-4"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No reviews yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {productData && (
            <RelatedProducts
              brand={productData.brand_id}
              category={productData.category_id}
            />
          )}
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};
