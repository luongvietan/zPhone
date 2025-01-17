const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category_id: { type: String, required: true },
  category_name: { type: String, required: true },
});

// Create the model
const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
