const Order = require("../models/Order");
const User = require("../models/User");
const CartItem = require("../models/CartItem");

const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const orderResolver = {
  Query: {
    // Fetch a single order by ID
    getOrderById: async (_, { orderId }) => {
      try {
        const order = await Order.findById(orderId).populate("userDetails");

        if (!order) {
          throw new Error("Order not found.");
        }

        return order;
      } catch (error) {
        console.error("Error fetching order by ID:", error);
        throw new Error("Failed to fetch order.");
      }
    },

    totalRevenue: async () => {
      try {
        const completedOrders = await Order.find({ status: "Completed" });
        return completedOrders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );
      } catch (error) {
        console.error("Error calculating revenue:", error.message);
        throw new Error("Failed to calculate revenue.");
      }
    },
    totalOrdersByStatus: async () => {
      try {
        const pendingCount = await Order.countDocuments({ status: "Pending" });
        const completedCount = await Order.countDocuments({
          status: "Completed",
        });
        return { pending: pendingCount, completed: completedCount };
      } catch (error) {
        console.error("Error counting orders:", error.message);
        throw new Error("Failed to count orders.");
      }
    },

    // Fetch all orders for a specific user
    getOrdersByUser: async (_, { userId }) => {
      try {
        // Fetch orders from the database and populate the cart
        const orders = await Order.find({ "userDetails.userId": userId })
          .populate({
            path: "cart", // Populate the cart field
            model: "CartItem", // Ensure it references CartItem model
            select: "name price quantity image", // Select the fields you need
          })
          .sort({ createdAt: -1 }); // Most recent orders first

        // Log the orders data to check the structure
        console.log("Fetched Orders:", orders);

        return orders;
      } catch (error) {
        console.error("Error fetching orders by user:", error);
        throw new Error("Failed to fetch orders.");
      }
    },
    getAllOrders: async () => {
      try {
        // Fetch all orders and populate the cart field
        const orders = await Order.find()
          .populate({
            path: "cart", // Populate the cart field
            model: "CartItem", // Ensure it references the CartItem model
            select:
              "productId name price quantity size offer image categoryName", // Select the required fields
          })
          .sort({ createdAt: -1 }); // Sort by creation date

        console.log("Fetched Orders with Populated Cart:", orders); // Log the result to check
        return orders;
      } catch (error) {
        console.error("Error fetching orders:", error.message);
        throw new Error("Failed to fetch orders.");
      }
    },

    getTotalOrders: async () => {
      try {
        const totalOrders = await Order.countDocuments();
        return totalOrders;
      } catch (error) {
        console.error("Error fetching total orders:", error.message);
        throw new Error("Failed to fetch total orders.");
      }
    },
  },

  Mutation: {
    // Create a new order
     createOrder : async (parent, { input }, context) => {
      try {
        // Log the received input data to ensure it's correct
        console.log("Received order data:", input);
    
        // Create a new order with the input data
        const newOrder = new Order({
          userDetails: input.userDetails,
          address: input.address,
          cart: input.cart.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size || null,  // Ensure size is optional
            offer: item.offer,
            image: item.image || null,  // Ensure image is optional
            categoryName: item.categoryName,
          })),
          paymentDetails: input.paymentDetails,
          totalAmount: input.totalAmount,
          status: "Pending",  // Assuming the status is 'Pending' by default
        });
    
        // Save the order to the database
        const savedOrder = await newOrder.save();
    
        // Log and return the saved order for verification
        console.log("Order saved:", savedOrder);
    
        // Return the saved order (this could be used in the frontend response)
        return savedOrder;
      } catch (error) {
        console.error("Error creating order:", error);
        throw new Error("Failed to create order.");
      }
    },
                 
    completeOrder: async (_, { orderId }) => {
      try {
        const order = await Order.findById(orderId);
        if (!order) {
          throw new Error("Order not found");
        }

        // Update order status to "Completed"
        order.status = "Completed";
        await order.save();

        return { success: true, message: "Order marked as completed." };
      } catch (error) {
        console.error("Error completing order:", error.message);
        throw new Error("Failed to complete order.");
      }
    },
  },
};

module.exports = orderResolver;
