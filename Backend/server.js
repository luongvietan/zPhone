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

const storage = multer.memoryStorage(); // Sử dụng bộ nhớ tạm để lưu trữ file ảnh

const upload = multer({ storage });

app.post("/upload", upload.single("file"), async (req, res) => {
  const filename = `${path.parse(req.file.originalname).name}.png`; // Đổi tên file thành .png
  const filePath = `static/Phone_images/${filename}`;

  try {
    await sharp(req.file.buffer).png().toFile(filePath); // Chuyển đổi và lưu file ảnh thành .png
    res.json({ filePath });
    console.log(filename);
  } catch (err) {
    res.status(500).json({ error: "Error processing image" });
    console.error("Error processing image:", err);
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the zPhone API");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

const productRoutes = require("./routes/productRouter");
const userRoutes = require("./routes/userRouter");
const authRoutes = require("./routes/authRoutes");

app.use("/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
