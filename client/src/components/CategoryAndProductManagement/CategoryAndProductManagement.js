import React, { useState, useEffect } from "react";
import { graphQLCommand } from "../../util"; // your fetch-based GraphQL
import CategoryManagement from "../CategoryManagement/CategoryManagement";
import ProductManagement from "../ProductManagement/ProductManagement";

const CategoryAndProductManagement = () => {
  // State for categories: each category = { _id, name }
  const [categories, setCategories] = useState([]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const query = `
        query {
          categories {
            id
            name
          }
        }
      `;
      try {
        const data = await graphQLCommand(query);
        // Convert {id, name} to {_id, name} for consistency
        const catObjects = data.categories.map((cat) => ({
          _id: cat.id,
          name: cat.name,
        }));
        setCategories(catObjects);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 lg:p-8">
      {/* Left side: Category Management */}
      <div className="p-4">
        <CategoryManagement 
          categories={categories} 
          setCategories={setCategories} 
        />
      </div>

      {/* Right side: Product Management */}
      <div className="p-4">
        <ProductManagement categories={categories} />
      </div>
    </div>
  );
};

export default CategoryAndProductManagement;
