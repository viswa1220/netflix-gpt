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
        return completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      } catch (error) {
        console.error("Error calculating revenue:", error.message);
        throw new Error("Failed to calculate revenue.");
      }
    },
    totalOrdersByStatus: async () => {
      try {
        const pendingCount = await Order.countDocuments({ status: "Pending" });
        const completedCount = await Order.countDocuments({ status: "Completed" });
        return { pending: pendingCount, completed: completedCount };
      } catch (error) {
        console.error("Error counting orders:", error.message);
        throw new Error("Failed to count orders.");
      }
    },
  

    // Fetch all orders for a specific user
    getOrdersByUser: async (_, { userId }) => {
      try {
        const orders = await Order.find({ "userDetails.userId": userId })
          .populate({
            path: "cart", // Populate the cart field
            model: "CartItem", // Ensure it references CartItem model
            select: "name price quantity image", // Select the fields you need
          })
          .sort({ createdAt: -1 }); // Most recent orders first

        return orders;
      } catch (error) {
        console.error("Error fetching orders by user:", error);
        throw new Error("Failed to fetch orders.");
      }
    },

    // Fetch all orders (for admin, for example)
    getAllOrders: async () => {
      try {
        const orders = await Order.find()
          .populate({
            path: "cart", // Populate the cart field
            model: "CartItem", // Ensure it references CartItem model
            select: "name price quantity image offer categoryName ", // Select the fields you need
          })
          .sort({ createdAt: -1 }); // Most recent orders first

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
    createOrder: async (_, { input }) => {
      try {
        const { userDetails, address, cart, paymentDetails, totalAmount } = input;
    
        // Save each cart item
        const savedCartItems = await Promise.all(
          cart.map(async (item) => {
            const cartItem = new CartItem({
              userId: userDetails.userId,
              productId: item.productId,
              name: item.name,
              price: item.price,
              offer: item.offer || 0,
              quantity: item.quantity,
              size: item.size || null,
              image: item.image || null,
              categoryName: item.categoryName, // Save categoryName directly
            });
            return await cartItem.save();
          })
        );
    
        // Save the order
        const newOrder = new Order({
          userDetails,
          address,
          cart: savedCartItems.map((item) => item._id), // Store ObjectIds of cart items
          paymentDetails,
          totalAmount,
        });
    
        const savedOrder = await newOrder.save();
    
        // Populate cart items to include the required fields
        return savedOrder.populate({
          path: "cart",
          select: "productId name price quantity size image categoryName", // Include categoryName and other fields
        });
      } catch (error) {
        console.error("Error creating order:", error.message);
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
