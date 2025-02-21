const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("static"));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.path}`);
//   next();
// });
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("Welcome to the zPhone API");
});
// // Serve static files from the React app
// app.use(express.static(path.join(__dirname, "build")));

// // Handle React routing, return all requests to React app
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
const wishlistRoutes = require("./routes/wishlistRoutes");
const paymentRoutes = require("./routes/payment");
const productRoutes = require("./routes/productRouter");
const userRoutes = require("./routes/userRouter");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const voucherRoutes = require("./routes/voucherRoutes");
app.use("/api/payment", paymentRoutes);
app.use("/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/vouchers", voucherRoutes);
// app._router.stack.forEach((r) => {
//   if (r.route) {
//     console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
//   }
// });
// // Debug danh sách route
// console.log("Available routes:");
// app._router.stack.forEach((r) => {
//   if (r.route) {
//     console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
//   }
// });
