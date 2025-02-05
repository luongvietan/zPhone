var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var connectDB = require("./db");
var cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRouter = require("./routes/userRouter");
const authController = require("./controllers/authController");
const routes = require("./routes");
const verifyToken = require("./middleware/authMiddleware");

var app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Kết nối cơ sở dữ liệu
connectDB();

// Authentication routes
app.post("/register", authController.register);
app.post("/login", authController.login); // Thay đổi từ authenticate sang login

// Protected routes
app.use("/api/user", verifyToken, userRouter);
app.use("/api/auth", authRoutes);
app.use("/", routes);

// Khởi động server
app
  .listen(port, () => {
    console.log(`app.js Server is running on port ${port}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${port} is already in use. Please choose another port.`
      );
      process.exit(1); // Dừng ứng dụng nếu cổng đã được sử dụng
    } else {
      console.error(err);
    }
  });

module.exports = app;
