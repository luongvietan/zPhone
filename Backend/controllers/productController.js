const express = require("express");
const Product = require("../models/productModel");
const multer = require("multer");
const path = require("path");
const router = express.Router();
// Create a new product
const createProduct = async (req, res) => {
  try {
    const {
      product_id,
      product_name,
      product_description,
      product_image,
      stock_quantity,
      brand_id,
      category,
      variants,
    } = req.body;
    const newProduct = new Product({
      product_id,
      product_name,
      product_description,
      product_image,
      stock_quantity,
      brand_id,
      category,
      variants,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

    // Check if the user has already reviewed the product
    const existingReview = product.reviews.find((r) => r.user === user);

    if (existingReview) {
      // Update existing review
      existingReview.review = review;
      existingReview.rating = rating;
      existingReview.createdAt = new Date();
    } else {
      // Add new review
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

// Delete a comment by ID
const deleteComment = async (req, res) => {
  try {
    const product = await Product.findOne({ product_id: req.params.productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const comment = product.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Remove authorization check
    product.comments.pull(req.params.commentId);
    await product.save();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a review by ID
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

    // Remove authorization check
    product.reviews.pull(req.params.reviewId);
    await product.save();
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get average rating of a product
const getAverageRating = async (req, res) => {
  try {
    const product = await Product.findOne({ product_id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const reviews = product.reviews;
    if (reviews.length === 0) {
      return res.json({ averageRating: 0 });
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    res.json({ averageRating: averageRating.toFixed(1) });
  } catch (error) {
    res.status(500).json({ message: "Error calculating average rating" });
  }
};

// Update stock quantity of a product
const updateStock = async (req, res) => {
  try {
    const { stock_quantity } = req.body;
    const product = await Product.findOneAndUpdate(
      { product_id: req.params.id },
      { stock_quantity },
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Endpoint upload ảnh
router.post("/upload", upload.single("file"), (req, res) => {
  try {
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Error uploading image" });
  }
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addComment,
  getComments,
  addReview,
  getReviews,
  deleteComment,
  deleteReview,
  getAverageRating,
  updateStock,
};
