import React, { useState, useEffect,  } from "react";
import { graphQLCommand } from "../../util";
import { useNavigate } from 'react-router-dom';
import CategoryManagement from "../CategoryManagement/CategoryManagement";
import ProductManagement from "../ProductManagement/ProductManagement";

const CategoryAndProductManagement = () => {
  // State for categories: each category = { _id, name, categoryImage, categoryID }
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const query = `
        query {
          categories {
            id
            name
            categoryImage
            categoryID
            description
          }
        }
      `;
      try {
        const data = await graphQLCommand(query);

        // Map fetched categories to the state structure
        const catObjects = data.categories.map((cat) => ({
          _id: cat.id, // MongoDB ID
          name: cat.name, // Category Name
          categoryImage: cat.categoryImage || "", // Category Image
          categoryID: cat.categoryID || "",
          description: cat.description || "", // Category ID (fallback to empty string if not present)
        }));

        setCategories(catObjects);
        console.log("Fetched Categories:", catObjects);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);
  const handleBack = () => {
    navigate('/dashboard');
  };
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
        <button
        onClick={handleBack}
        className="bg-primaryYellow text-primaryBlack py-2 px-4 rounded-md  hover:bg-yellow-600 0"
      >
        Back 
      </button>
      </div>
    
  );
};

export default CategoryAndProductManagement;
