const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const sharp = require("sharp"); // Thêm thư viện sharp để xử lý ảnh
const dotenv = require("dotenv"); // Thêm dòng này để import dotenv

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
const storage = multer.memoryStorage(); // Sử dụng bộ nhớ tạm để lưu trữ file ảnh

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("Welcome to the zPhone API");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

const paymentRoutes = require("./routes/payment");
const productRoutes = require("./routes/productRouter");
const userRoutes = require("./routes/userRouter");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");

app.use("/api/payment", paymentRoutes);
app.use("/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
