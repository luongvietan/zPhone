const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const verifyToken = require("../middleware/verifyToken");

// Product routes
router.post("/", productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

// Comment routes
router.post("/:id/comments", productController.addComment);
router.get("/:id/comments", productController.getComments);
router.delete(
  "/:productId/comments/:commentId",
  productController.deleteComment
);

// Review routes
router.post("/:id/reviews", productController.addReview);
router.get("/:id/reviews", productController.getReviews);
router.delete("/:productId/reviews/:reviewId", productController.deleteReview);

// Average rating route
router.get("/:id/average-rating", productController.getAverageRating);

// Update stock route
router.put("/:id/stock", productController.updateStock);

module.exports = router;
