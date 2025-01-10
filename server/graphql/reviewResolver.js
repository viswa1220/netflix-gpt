const Review = require("../models/Review");
const Product = require("../models/Product");

const reviewResolver = {
  Query: {
    getReviewsByProduct: async (_, { productId }) => {
      try {
        const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
        return reviews;
      } catch (error) {
        console.error("Error fetching reviews:", error);
        throw new Error("Failed to fetch reviews.");
      }
    },
  },
  Mutation: {
    addReview: async (_, { input }) => {
      const { productId, name, comment, rating } = input;

      try {
        const product = await Product.findById(productId);
        if (!product) throw new Error("Product not found.");

        const newReview = new Review({
          productId,
          name: name || "Unnamed User",
          comment,
          rating,
        });
        const savedReview = await newReview.save();

        const reviews = await Review.find({ productId });
        const averageRating =
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        await Product.findByIdAndUpdate(
          productId,
          { rating: Number(averageRating.toFixed(1)) },
          { new: true } // Return updated product
        );

        return savedReview;
      } catch (error) {
        console.error("Error adding review:", error);
        throw new Error("Failed to add review.");
      }
    },
  },
};

module.exports = reviewResolver;


module.exports = reviewResolver;
