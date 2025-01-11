const CartItem = require("../models/CartItem");

const cartResolver = {
  Query: {
    async getCart(_, { userId }) {
      try {
        const cartItems = await CartItem.find({ userId });
        return cartItems;
      } catch (error) {
        throw new Error("Failed to fetch cart items.");
      }
    },
  },

  Mutation: {
    async addToCart(_, { userId, input }) {
      try {
        // Validate that userId exists
        if (!userId || typeof userId !== "string") {
          throw new Error("Invalid userId");
        }

        // Check if the item already exists in the cart
        const existingItem = await CartItem.findOne({
          userId: userId, // Match userId as a string
          productId: input.productId,
          size: input.size || null, // Check size if provided
        });

        if (existingItem) {
          // If the item exists, update its quantity
          existingItem.quantity += input.quantity;
          await existingItem.save();
          return existingItem;
        }

        // If the item doesn't exist, create a new one
        const cartItem = new CartItem({
          userId, // Use userId directly
          ...input,
        });
        await cartItem.save();
        return cartItem;
      } catch (error) {
        console.error("Error in addToCart resolver:", error.message);
        throw new Error("Failed to add item to cart.");
      }
    },

    async updateCartItem(_, { userId, itemId, quantity }) {
      try {
        const cartItem = await CartItem.findOne({ userId, _id: itemId });
        if (!cartItem) {
          throw new Error("Cart item not found.");
        }

        // Update quantity
        cartItem.quantity = quantity;
        await cartItem.save();
        return cartItem;
      } catch (error) {
        throw new Error("Failed to update cart item.");
      }
    },

    async removeFromCart(_, { userId, itemId }) {
      try {
        const result = await CartItem.findOneAndDelete({ userId, _id: itemId });
        if (!result) {
          throw new Error("Cart item not found.");
        }
        return "Item removed from cart.";
      } catch (error) {
        throw new Error("Failed to remove item from cart.");
      }
    },
  },
};

module.exports = cartResolver;
