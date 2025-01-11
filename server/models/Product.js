const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  productId: { type: String, required: true, trim: true },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  availableCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  offer: {
    type: String,
    trim: true,
  },
  productCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  description: {
    type: String,
    trim: true,
  },
  
  mainImage: {
    type: String,
  },
  sliderImages: [
    {
      type: String,
    },
  ],
  video: {
    type: String,
  },
  sizes: [
    {
      type: String,
      trim: true,
    },
  ],
  Brand: { type: String, trim: true },
  gender: { type: String, required: true },
  saleStatus: {
    type: Boolean,
    default: false,
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  rating: { type: Number, default: 0 },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
