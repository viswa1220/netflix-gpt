const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userDetails: {
      userId: {
        type: String,
        required: true, // Store userId as a string
      },
      fullName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    address: {
      type: String,
      required: true,
    },
    cart: [
      {
        productId:String,
        name: String,
        price: Number,
        quantity: Number,
        size: String,
        offer: Number,
        image: String,
        categoryName: String,
      },
    ],
    paymentDetails: {
      method: { type: String, required: true },
      upiId: { type: String },
      cardDetails: {
        number: { type: String },
        expiry: { type: String },
        cvc: { type: String },
      },
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Canceled"],
      default: "Pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
