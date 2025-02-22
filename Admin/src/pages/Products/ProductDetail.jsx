import { useEffect, useState } from "react";
import {
  getProductById,
  deleteComment,
  deleteReview,
  updateProduct,
  uploadImage,
} from "../../services/productService";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Star,
  MessageCircle,
  Trash2,
  ArrowLeft,
  Edit2,
  Save,
} from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({});
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        setEditedProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      let imageUrls = editedProduct.product_image;
      if (newImage) {
        const uploadedImages = await uploadImage(newImage);
        imageUrls = uploadedImages;
      }

      const updatedProduct = await updateProduct(id, {
        ...editedProduct,
        product_image: imageUrls,
      });

      setProduct(updatedProduct);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({
      ...editedProduct,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

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

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = [...editedProduct.variants];
    updatedVariants[index][name.split(".").pop()] = value;
    setEditedProduct({
      ...editedProduct,
      variants: updatedVariants,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
          {isEditing ? (
            <button
              onClick={handleSaveClick}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
            >
              <Save className="w-5 h-5 mr-2" /> Save
            </button>
          ) : (
            <button
              onClick={handleEditClick}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
            >
              <Edit2 className="w-5 h-5 mr-2" /> Edit Product
            </button>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-6">
              <div className="grid grid-cols-3 gap-4">
                {product.product_image.map((image, index) => (
                  <img
                    key={index}
                    src={`${
                      import.meta.env.VITE_API_URL
                    }/Phone_images/${image}.png`}
                    alt={product.product_name}
                    className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                  />
                ))}
              </div>
              {isEditing && (
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="mt-4 w-full p-2 border rounded"
                  multiple
                />
              )}
            </div>
            <div className="md:w-1/2 p-6">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="product_name"
                    value={editedProduct.product_name}
                    onChange={handleInputChange}
                    className="text-3xl font-bold text-gray-900 mb-4 w-full p-2 border rounded"
                    placeholder="Product Name"
                  />
                  <textarea
                    name="product_description"
                    value={editedProduct.product_description}
                    onChange={handleInputChange}
                    className="text-gray-600 mb-6 w-full p-2 border rounded"
                    placeholder="Product Description"
                    rows="4"
                  />
                  <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                    <p className="text-indigo-600 font-semibold">
                      Stock:{" "}
                      <input
                        type="number"
                        name="stock_quantity"
                        value={editedProduct.stock_quantity}
                        onChange={handleInputChange}
                        className="p-2 border rounded"
                        placeholder="Stock Quantity"
                      />
                    </p>
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Variants
                </h2>
                {product.variants.map((variant, index) => (
                  <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          name={`variants[${index}].storage`}
                          value={editedProduct.variants[index].storage}
                          onChange={(e) => handleVariantChange(index, e)}
                          className="text-gray-700 mb-2 w-full p-2 border rounded"
                          placeholder="Storage"
                        />
                        <input
                          type="number"
                          name={`variants[${index}].product_price`}
                          value={editedProduct.variants[index].product_price}
                          onChange={(e) => handleVariantChange(index, e)}
                          className="text-gray-700 mb-2 w-full p-2 border rounded"
                          placeholder="Price"
                        />
                        <input
                          type="text"
                          name={`variants[${index}].product_sku`}
                          value={editedProduct.variants[index].product_sku}
                          onChange={(e) => handleVariantChange(index, e)}
                          className="text-gray-700 mb-2 w-full p-2 border rounded"
                          placeholder="SKU"
                        />
                      </>
                    ) : (
                      <>
                        <p className="text-gray-700">
                          Storage: {variant.storage}
                        </p>
                        <p className="text-gray-700">
                          Price: ${variant.product_price}
                        </p>
                        <p className="text-gray-700">
                          SKU: {variant.product_sku}
                        </p>
                      </>
                    )}
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
                    className="mb-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-300"
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
                      className="mt-2 flex items-center text-red-600 hover:text-red-800 transition duration-300"
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
                    className="mb-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-300"
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
                      className="mt-2 flex items-center text-red-600 hover:text-red-800 transition duration-300"
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
