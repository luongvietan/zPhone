const User = require("../models/userModel");
const Order = require("../models/orderModel");

// Create a new user
const createUser = async (req, res) => {
  try {
    console.log("Creating user with data:", req.body);
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    console.log("User created successfully :", savedUser);
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  try {
    // console.log("Fetching user with ID:", req.params.id);
    const foundUser = await User.findById(req.params.id);
    if (!foundUser) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json(foundUser);
  } catch (error) {
    console.error("Error fetching user by ID:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Update a user by ID
const updateUser = async (req, res) => {
  try {
    // console.log("Updating user with ID:", req.params.id, "Data:", req.body);
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "user not found" });
    }
    // console.log("User updated successfully:", updatedUser);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  try {
    console.log("Deleting user with ID:", req.params.id);
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "user not found" });
    }
    console.log("User deleted successfully:", deletedUser);
    res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    console.log("Fetched user profile:", user);
    res.send(user);
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).send({ error: "Server error" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log("Fetched current user:", user);
    res.json({ user });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ message: "Error fetching user data" });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user._id });
    res.json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProfile,
  getCurrentUser,
  getUserOrders,
};
