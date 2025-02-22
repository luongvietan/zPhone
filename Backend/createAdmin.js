require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/userModel");
const bcrypt = require("bcryptjs");

// Kết nối đến MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createAdmin = async () => {
  const adminData = {
    username: "admin",
    id: "admin001",
    email: "admin@zphone.com",
    address: "TP.HCM",
    phone: "1234567890",
    password: "anluong2311", // Mật khẩu mặc định
    role: "admin", // Đặt role là "admin"
  };

  try {
    // Kiểm tra xem tài khoản admin đã tồn tại chưa
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("Admin account already exists.");
      return;
    }

    // Tạo tài khoản admin
    const admin = new User(adminData);
    await admin.save();
    console.log("Admin account created successfully:", admin);
  } catch (error) {
    console.error("Error creating admin account:", error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();
