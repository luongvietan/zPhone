const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");

router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
// Sử dụng middleware authMiddleware để bảo vệ route /profile
router.get("/profile/:id", verifyToken, userController.getProfile);
router.get("/orders", verifyToken, userController.getUserOrders);

module.exports = router;
