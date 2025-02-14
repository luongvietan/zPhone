const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

exports.getCurrentUser = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    // console.log("User ID:", req.user?._id);
    const user = await User.findById(userId).select("-password");
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

exports.login = async (req, res) => {
  const { email, password } = req.body;
  // console.log("Login attempt for email:", email);

  // Server-side validation
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Use secure password comparison
    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate token with expiration
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    // Exclude sensitive information
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };

    // console.log("User logged in successfully:", user);
    res.json({
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({
      message: "Login failed",
    });
  }
};

exports.register = async (req, res) => {
  try {
    // console.log("Registering user with data:", req.body);
    const { username, email, password, id, address, phone } = req.body;

    // console.log("Received Registration Data:", {
    //   username,
    //   email,
    //   id,
    //   address,
    //   phone: phone.replace(/./g, "*"), // Mask phone for security
    // });

    // Comprehensive Input Validation
    const validationErrors = [];

    if (!username || username.length < 3) {
      validationErrors.push("Username must be at least 3 characters long");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      validationErrors.push("Invalid email format");
    }

    if (!password || password.length < 6) {
      validationErrors.push("Password must be at least 6 characters long");
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
      validationErrors.push("Phone number must be 10 digits");
    }

    if (!id) {
      validationErrors.push("User ID is required");
    }

    if (!address) {
      validationErrors.push("Address is required");
    }

    // Return all validation errors if any exist
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Registration validation failed",
        errors: validationErrors,
      });
    }

    const newUser = new User(req.body);
    await newUser.save();
    // console.log("User registered successfully:", newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ message: "Registration failed" });
  }
};
