const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category_id: {
    type: String,
    required: true,
    unique: true,
  },
  category_name: {
    type: String,
    required: true,
  },
});

// Tạo model Category
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
