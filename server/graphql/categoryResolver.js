const Category = require("../models/Category");

const categoryResolver = {
  Query: {
    // Fetch all categories sorted by creation date in descending order
    categories: async () => {
      return await Category.find();
    },

    // Fetch a single category by name
    getCategoryByName: async (_, { name }) => {
      try {
        const category = await Category.findOne({ name });
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
    // Add a new category
    addCategory: async (_, { name, categoryImage, categoryID,description }) => {
      const existingCategory = await Category.findOne({ categoryID });
      if (existingCategory) {
        throw new Error("Category with this categoryID already exists");
      }

      const category = new Category({
        name,
        categoryImage,
        categoryID,
        description
      });
      return await category.save();
    },

    // Update an existing category by id
    updateCategory: async (_, { id, name, categoryImage, categoryID,description }) => {
      const category = await Category.findById(id);
      if (!category) {
        throw new Error("Category not found");
      }

      // Update fields
      if (name) category.name = name;
      if (categoryImage) category.categoryImage = categoryImage;
      if (categoryID) category.categoryID = categoryID;
      if(description)category.description=description;

      await category.save();
      return category;
    },

    // Delete a category by id
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
