import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { graphQLCommand } from "../../util"; // Replace with your GraphQL fetch function

const NavBar = () => {
  const [categories, setCategories] = useState([]);

  // Fetch categories from backend
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
        const response = await graphQLCommand(query);
        const fetchedCategories = response.categories || [];
        // Add "All" category as the default option
        const allCategories = [{ id: "all", name: "All" }, ...fetchedCategories];
        setCategories(allCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav className="bg-[#252F3B] shadow">
      <div className="h-26 px-4 flex items-center justify-between">
        {/* Left: Logo / Brand */}
        <Link to="/" className="text-xl font-bold text-[#FFD65A]">
          <img src="/logo.png" alt="logo for website" />
        </Link>

        {/* Middle: Nav links (hidden on small screens) */}
        <div className="hidden md:flex space-x-6">
          {/* Map over fetched categories */}
          {categories.map((category) => (
            <Link
              key={category.id}
              to={
                category.name === "All"
                  ? "/products/All"
                  : `/products/${encodeURIComponent(category.name)}`
              }
              className="text-[#FFD65A] font-normal text-lg"
            >
              {category.name}
            </Link>
          ))}
          {/* Add additional static links */}
          <Link to="/cart" className="text-[#FFD65A] font-normal text-lg">
            Cart
          </Link>
        </div>

        {/* Right: Login & Sign Up */}
        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-blue-600 text-white font-medium py-1.5 px-4 rounded hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
