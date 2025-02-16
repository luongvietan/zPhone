const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Product routes
router.post("/", productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

// Comment routes
router.post("/:id/comments", productController.addComment);
router.get("/:id/comments", productController.getComments);

// Review routes
router.post("/:id/reviews", productController.addReview);
router.get("/:id/reviews", productController.getReviews);
router.delete("/reviews/all", productController.deleteAllReviews);
router.delete("/comments/all", productController.deleteAllComments);

module.exports = router;
