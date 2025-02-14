const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");
const authMiddleware = require("../middleware/verifyToken");

// Tất cả các route bên dưới đều yêu cầu xác thực
router.use(authMiddleware);

router.get("/", wishlistController.getWishlist);
router.post("/add", wishlistController.addToWishlist);
router.delete("/remove", wishlistController.removeFromWishlist);

module.exports = router;
