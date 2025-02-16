const Product = require("../models/productModel");

// Create a new product
const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
};

// Get a product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ product_id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { product_id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({
      product_id: req.params.id,
    });
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a comment to a product
const addComment = async (req, res) => {
  try {
    const { user, content } = req.body;
    const product = await Product.findOne({ product_id: req.params.id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newComment = { user, content, createdAt: new Date() };
    product.comments.push(newComment);

    await product.save();
    res
      .status(200)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all comments of a product
const getComments = async (req, res) => {
  try {
    const product = await Product.findOne({ product_id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product.comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments" });
  }
};

// Add a review to a product
const addReview = async (req, res) => {
  try {
    const { user, review, rating } = req.body;
    const product = await Product.findOne({ product_id: req.params.id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Kiểm tra xem user đã có review chưa
    const existingReview = product.reviews.find((r) => r.user === user);

    if (existingReview) {
      // Nếu đã có review, cập nhật nội dung
      existingReview.review = review;
      existingReview.rating = rating;
      existingReview.createdAt = new Date();
    } else {
      // Nếu chưa có review, thêm mới
      const newReview = { user, review, rating, createdAt: new Date() };
      product.reviews.push(newReview);
    }

    await product.save();
    res.status(200).json({
      message: "Review submitted successfully",
      reviews: product.reviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews of a product
const getReviews = async (req, res) => {
  try {
    const product = await Product.findOne({ product_id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product.reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
};
// Xóa tất cả review của tất cả sản phẩm
const deleteAllReviews = async (req, res) => {
  try {
    await Product.updateMany({}, { $set: { reviews: [] } });
    res.status(200).json({ message: "All reviews deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteAllComments = async (req, res) => {
  try {
    await Product.updateMany({}, { $set: { comments: [] } });
    res.status(200).json({ message: "All comments deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Xóa comment của người dùng
const deleteComment = async (req, res) => {
  try {
    const product = await Product.findOne({ product_id: req.params.productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const comment = product.comments.find(
      (c) => c._id.toString() === req.params.commentId
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Kiểm tra quyền xóa
    if (comment.user !== req.user.username) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this comment" });
    }
    product.comments.pull(req.params.commentId);
    await product.save();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa review của người dùng
const deleteReview = async (req, res) => {
  try {
    const product = await Product.findOne({ product_id: req.params.productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const review = product.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Kiểm tra quyền xóa
    if (review.user !== req.user.username) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this review" });
    }

    product.reviews.pull(req.params.reviewId);
    await product.save();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  addComment,
  getComments,
  addReview,
  getReviews,
  deleteAllReviews,
  deleteAllComments,
  deleteComment,
  deleteReview,
};
