const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  categoryImage: {
    type: String,
  },
  categoryID:{
    type: String,
    required: [true, "Category ID is required"],
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  description:
  {
    type: String,
    required: true,
    unique: true,
    trim: true,
  }
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
