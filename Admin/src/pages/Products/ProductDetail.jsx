import { useEffect, useState } from "react";
import {
  getProductById,
  deleteComment,
  deleteReview,
} from "../../services/productService";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Star, MessageCircle, Trash2, ArrowLeft, Edit2 } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(id, commentId);
      setProduct({
        ...product,
        comments: product.comments.filter(
          (comment) => comment._id !== commentId
        ),
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(id, reviewId);
      setProduct({
        ...product,
        reviews: product.reviews.filter((review) => review._id !== reviewId),
      });
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>
        <Link
          to={`/products/${product.product_id}/edit`}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Edit2 className="w-5 h-5 mr-2" /> Edit Product
        </Link>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={`${import.meta.env.VITE_API_URL}/phone_images/${
                  product.product_image[0]
                }.png`}
                alt={product.product_name}
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="md:w-1/2 p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.product_name}
              </h1>
              <p className="text-gray-600 mb-6">
                {product.product_description}
              </p>
              <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                <p className="text-indigo-600 font-semibold">
                  Stock: {product.stock_quantity}
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Variants
                </h2>
                {product.variants.map((variant, index) => (
                  <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">Storage: {variant.storage}</p>
                    <p className="text-gray-700">
                      Price: ${variant.product_price}
                    </p>
                    <p className="text-gray-700">SKU: {variant.product_sku}</p>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Comments
                </h2>
                {product.comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="mb-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <p className="text-gray-700 font-semibold">
                      {comment.user}
                    </p>
                    <p className="text-gray-600">{comment.content}</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="mt-2 flex items-center text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </button>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Reviews
                </h2>
                {product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="mb-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <p className="text-gray-700 font-semibold">{review.user}</p>
                    <p className="text-gray-600 flex items-center">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-500 mr-1"
                        />
                      ))}
                    </p>
                    <p className="text-gray-600">{review.content}</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(review.createdAt).toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="mt-2 flex items-center text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
