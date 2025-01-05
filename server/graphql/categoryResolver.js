const Category = require("../models/Category");

const categoryResolver = {
  Query: {
    // Fetch all categories sorted by creation date in descending order
    categories: async () => {
      return await Category.find().sort({ createdAt: -1 });
    },

    // Fetch a single category by name
    getCategoryByName: async (_, { name }) => {
      try {
        const category = await Category.findOne({ name: name });
        if (!category) {
          throw new Error("Category not found");
        }
        return category;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },

  Mutation: {
    // Add a new category by name
    addCategory: async (_, { name }) => {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        throw new Error("Category already exists");
      }
      const category = new Category({ name });
      return await category.save();
    },

    // Update an existing category by _id
    updateCategory: async (_, { id, name }) => {
      const category = await Category.findById(id);
      if (!category) {
        throw new Error("Category not found");
      }

      // Change the name of the category
      category.name = name;
      await category.save();
      return category;
    },

    // Delete a category by _id
    deleteCategory: async (_, { id }) => {
      const category = await Category.findById(id);
      if (!category) {
        throw new Error("Category not found");
      }

      await category.delete();
      return { message: "Category deleted successfully" };
    },
  },
};

module.exports = categoryResolver;
