const mongoose = require("mongoose");
const Product = require("./models/productModel");
const phoneData = require("../phone_data.json"); // Đường dẫn đến file JSON

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    await Product.insertMany(phoneData); // Thêm tất cả sản phẩm vào cơ sở dữ liệu
    console.log("Products imported successfully!");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error importing products:", err);
  });
