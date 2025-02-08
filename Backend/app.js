require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var connectDB = require("./db");
var cors = require("cors");

var app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Database connection
connectDB();

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRouter = require("./routes/userRouter");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/payment"); // Đảm bảo đường dẫn này đúng
const verifyToken = require("./middleware/verifyToken");

// Routes
app.use("/api/payment", paymentRoutes); // Đặt route này trước các routes khác
app.use("/api/user", verifyToken, userRouter);
app.use("/api/auth", authRoutes);
app.use("/api/cart", verifyToken, cartRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Something went wrong!" });
});

// Start server
app
  .listen(port, () => {
    console.log(`Server is running on port ${port}`);
    // Log available routes for debugging
    console.log("Available routes:");
    app._router.stack.forEach(function (r) {
      if (r.route && r.route.path) {
        console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
      }
    });
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${port} is already in use. Please choose another port.`
      );
      process.exit(1);
    } else {
      console.error(err);
    }
  });

module.exports = app;
