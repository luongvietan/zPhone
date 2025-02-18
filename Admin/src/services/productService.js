// productService.js
import axios from "axios";

const API_URL = "http://localhost:5000/products";

// Get all products
export const getProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get a product by ID
export const getProductById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Create a new product
export const createProduct = async (productData) => {
  try {
    const response = await axios.post(API_URL, {
      ...productData,
      category_id: productData.category_id, // Đổi từ category thành category_id
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error.response?.data); // Log chi tiết lỗi từ server
    throw error;
  }
};

// Update a product by ID
export const updateProduct = async (id, productData) => {
  const response = await axios.put(`${API_URL}/${id}`, productData);
  return response.data;
};

// Delete a product by ID
export const deleteProduct = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

// Add a comment to a product
export const addComment = async (id, commentData) => {
  const response = await axios.post(`${API_URL}/${id}/comments`, commentData);
  return response.data;
};

// Get all comments of a product
export const getComments = async (id) => {
  const response = await axios.get(`${API_URL}/${id}/comments`);
  return response.data;
};

// Add a review to a product
export const addReview = async (id, reviewData) => {
  const response = await axios.post(`${API_URL}/${id}/reviews`, reviewData);
  return response.data;
};

// Get all reviews of a product
export const getReviews = async (id) => {
  const response = await axios.get(`${API_URL}/${id}/reviews`);
  return response.data;
};

// Delete a comment by ID
export const deleteComment = async (productId, commentId) => {
  await axios.delete(`${API_URL}/${productId}/comments/${commentId}`);
};

// Delete a review by ID
export const deleteReview = async (productId, reviewId) => {
  await axios.delete(`${API_URL}/${productId}/reviews/${reviewId}`);
};

// Get average rating of a product
export const getAverageRating = async (id) => {
  const response = await axios.get(`${API_URL}/${id}/average-rating`);
  return response.data;
};

// Update stock quantity of a product
export const updateStock = async (id, stockData) => {
  const response = await axios.put(`${API_URL}/${id}/stock`, stockData);
  return response.data;
};

// Get all brands
export const getBrands = async () => {
  const response = await axios.get(`${API_URL}/brands`);
  return response.data;
};

// Get all categories
export const getCategories = async () => {
  const response = await axios.get(`${API_URL}/categories`);
  return response.data;
};

// Upload image
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.fileName; // Chỉ lấy tên tệp từ phản hồi
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
