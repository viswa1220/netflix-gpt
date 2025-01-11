const Product = require("../models/Product");
const Category = require("../models/Category");
const Review = require("../models/Review");
const { Types } = require("mongoose");

const generateUniqueProductId = async (name) => {
  const baseProductId = name.substring(0, 4).toLowerCase(); // Take the first 4 characters of the product name
  let uniqueId = 1;

  let generatedProductId;
  do {
    generatedProductId = `${baseProductId}${uniqueId.toString().padStart(2, "0")}`; // Format: first4chars + padded number (e.g., airp01)
    const existingProduct = await Product.findOne({ productId: generatedProductId });
    if (!existingProduct) break; // Ensure the ID is unique
    uniqueId++;
  } while (true);

  return generatedProductId;
};

const productResolver = {
  Query: {
    // Other queries remain the same...
    productsByCategory: async (_, { name }) => {
      try {
        // Find the category based on the name
        const category = await Category.findOne({ name });
        if (!category) {
          throw new Error("Category not found");
        }
  
        // Find all products linked to the category
        const products = await Product.find({ productCategory: category._id })
          .populate("productCategory", "id name");
  
        return products.map((product) => ({
          ...product.toObject(),
          id: product._id.toString(), // Convert _id to id
          productCategory: {
            ...product.productCategory.toObject(),
            id: product.productCategory._id.toString(),
          },
        }));
      } catch (error) {
        console.error("Error fetching products by category:", error);
        throw new Error("Failed to fetch products by category.");
      }
    },
    getAllProducts: async () => {
      try {
        // Fetch products and populate both 'productCategory' and 'reviews'
        const products = await Product.find()
          .populate("productCategory") 
          .populate({
            path: "reviews", 
            select: "rating comment", 
          });

        if (!products || products.length === 0) {
          console.log("No products found in the database.");
        }
        return products;
      } catch (error) {
        console.error("Error fetching all products:", error);
        throw new Error("Failed to fetch products.");
      }
    },
    products: async () => {
      try {
        const products = await Product.find()
          .populate("productCategory", "id name")
          .sort({ createdAt: -1 });

        return products.map((doc) => {
          const obj = doc.toObject();
          obj.id = doc._id.toString();
          delete obj._id;

          if (obj.productCategory?._id) {
            obj.productCategory.id = obj.productCategory._id.toString();
            delete obj.productCategory._id;
          }

          return obj;
        });
      } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products.");
      }
    },

    getProductById: async (_, { id }) => {
      try {
        const product = await Product.findById(id).populate("productCategory");
        if (!product) {
          throw new Error("Product not found");
        }

        const reviews = await Review.find({ productId: id }).sort({
          createdAt: -1,
        });

        return {
          ...product.toObject(),
          id: product._id.toString(),
          productCategory: {
            ...product.productCategory.toObject(),
            id: product.productCategory._id.toString(),
          },
          reviews: reviews.map((review) => ({
            ...review.toObject(),
            id: review._id.toString(),
          })),
        };
      } catch (error) {
        console.error("Error fetching product by ID:", error);
        throw new Error("Failed to fetch product");
      }
    },
  },

  Mutation: {
    // Add a new product
    addProduct: async (_, { input }) => {
      try {
        const { name, price, productCategory, description } = input;

        // Validate required fields
        if (!name || !price || !productCategory) {
          throw new Error(
            "Missing required fields: name, price, or productCategory."
          );
        }

        // Validate that the category exists
        const categoryExists = await Category.findById(productCategory);
        if (!categoryExists) {
          throw new Error("Invalid productCategory: Category does not exist.");
        }

        // Generate a unique productId
        const productId = await generateUniqueProductId(name);

        // Prepare product data
        const productData = {
          ...input,
          productId,
          productCategory: categoryExists._id,
          description: description || "",
          mainImage: input.mainImage || "",
          sliderImages: input.sliderImages || [],
          video: input.video || "",
        };

        // Save the new product
        const newProduct = new Product(productData);
        const savedProduct = await newProduct.save();

        // Format the result object
        const resultObj = savedProduct.toObject();
        resultObj.id = savedProduct._id.toString(); // Convert _id to id

        // Return the formatted product result
        return resultObj;
      } catch (error) {
        console.error("Error adding product:", error);
        throw new Error("Failed to add product.");
      }
    },

    // Update a product
    updateProduct: async (_, { id, input }) => {
      try {
        const product = await Product.findOne({ productId: id });
        if (!product) {
          throw new Error("Product not found.");
        }

        Object.assign(product, input);

        const updatedProduct = await product.save();

        const resultObj = updatedProduct.toObject();
        resultObj.id = updatedProduct._id.toString();
        if (resultObj.productCategory instanceof Types.ObjectId) {
          resultObj.productCategory = resultObj.productCategory.toString();
        }

        return resultObj;
      } catch (error) {
        console.error(`Error updating product (${id}):`, error);
        throw new Error("Failed to update product.");
      }
    },

    // Delete a product
    deleteProduct: async (_, { id }) => {
      try {
        const product = await Product.findOne({ productId: id });
        if (!product) {
          throw new Error("Product not found.");
        }

        await product.delete();
        return { message: `Product with ID ${id} deleted successfully.` };
      } catch (error) {
        console.error(`Error deleting product (${id}):`, error);
        throw new Error("Failed to delete product.");
      }
    },
  },
};

module.exports = productResolver;
