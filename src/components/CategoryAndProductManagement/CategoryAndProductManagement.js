import React, { useState } from "react";
import ProductManagement from "../ProductManagement/ProductManagement";
import CategoryManagement from "../CategoryManagement/CategoryManagement";

const CategoryAndProductManagement = () => {
  const [categories, setCategories] = useState(["Electronics", "Clothing", "Home"]);
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Smartphone",
      price: 699,
      availableCount: 25,
      offer: "10%",
      productCategory: "Electronics",
      description: "A high-end smartphone.",
      features: ["4G Support", "AMOLED Display"],
      colors: [{ color: "Black", image: null }],
      mainImage: null,
      sliderImages: [],
      video: null,
      sizes: ["M", "L"],
      rating: 4.5,
      saleStatus: true,
      trendingStatus: false,
    },
    {
      id: 2,
      name: "Running Shoes",
      price: 120,
      availableCount: 50,
      offer: "5%",
      productCategory: "Clothing",
      description: "Lightweight running shoes.",
      features: ["Comfortable", "Durable"],
      colors: [{ color: "Red", image: null }],
      mainImage: null,
      sliderImages: [],
      video: null,
      sizes: ["S", "M"],
      rating: 4.0,
      saleStatus: false,
      trendingStatus: true,
    },
  ]);

  const [editingProduct, setEditingProduct] = useState(null);

  // Handle saving a product (new or edited)
  const handleSaveProduct = (updatedProduct) => {
    if (updatedProduct.id) {
      // Edit existing product
      setProducts((prev) =>
        prev.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
    } else {
      // Add new product
      setProducts((prev) => [
        ...prev,
        { ...updatedProduct, id: Date.now() }, // Assign unique ID
      ]);
    }
    setEditingProduct(null); // Reset editing state
  };

  // Handle edit click
  const handleEditProduct = (productId) => {
    const productToEdit = products.find((product) => product.id === productId);
    setEditingProduct(productToEdit);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 lg:p-8">
      {/* Product Management */}
      <div className=" p-4 ">
        <ProductManagement
          categories={categories}
          editingProduct={editingProduct}
          onSave={handleSaveProduct}
        />
      </div>

      {/* Category Management */}
      <div className=" p-4 ">
        <CategoryManagement categories={categories} setCategories={setCategories} />
      </div>
    </div>
  );
};

export default CategoryAndProductManagement;
