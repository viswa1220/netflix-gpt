const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  userId: {
    type: String, // Use userId as a string identifier
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  offer: {
    type: Number,
    default: 0,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  size: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  categoryName: {
    type: String,
    required: true,
  },
});

const CartItem = mongoose.model("CartItem", CartItemSchema);

module.exports = CartItem;
