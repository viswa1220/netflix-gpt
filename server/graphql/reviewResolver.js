const Review = require("../models/Review");
const Product = require("../models/Product");

const reviewResolver = {
  Query: {
    // Fetch all reviews for a specific product
    getReviewsByProduct: async (_, { productId }) => {
      try {
        const reviews = await Review.find({ productId }).sort({
          createdAt: -1,
        });
        return reviews;
      } catch (error) {
        console.error("Error fetching reviews:", error);
        throw new Error("Failed to fetch reviews.");
      }
    },
  },

  Mutation: {
    // Add a new review for a product
    addReview: async (_, { input }) => {
      const { productId, name, comment, rating } = input;

      try {
        // Validate product existence
        const product = await Product.findById(productId);
        if (!product) {
          throw new Error("Product not found.");
        }

        // Create and save the review
        const newReview = new Review({
          productId,
          name: name || "Unnamed User",
          comment,
          rating,
        });
        const savedReview = await newReview.save();

        // Update product's average rating
        const reviews = await Review.find({ productId });
        const averageRating =
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        product.rating = Number(averageRating.toFixed(1));
        await product.save();

        return savedReview;
      } catch (error) {
        console.error("Error adding review:", error);
        throw new Error("Failed to add review.");
      }
    },
  },

  Review: {
    // Resolve product field for the Review type if needed
    product: async (review) => {
      try {
        return await Product.findById(review.productId);
      } catch (error) {
        console.error("Error resolving product for review:", error);
        throw new Error("Failed to resolve product.");
      }
    },
  },
};

module.exports = reviewResolver;
