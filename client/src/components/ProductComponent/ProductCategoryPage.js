import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { graphQLCommand } from '../../util'; // Assuming graphQLCommand is used to call GraphQL

const ProductCategoryPage = ({ categories }) => {
  const { categoryName } = useParams();  // Extract categoryName from URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(6);

  const navigate = useNavigate(); // For navigation

  // Fetch all products based on categoryId
  const fetchProductsByCategory = async (categoryId) => {
    const PRODUCT_QUERY = `
      query GetProductsByCategory($categoryId: ID!) {
        productsByCategory(categoryId: $categoryId) {
          id
          name
          price
          availableCount
          Brand
          gender
          offer
          mainImage
          reviews {
            id
            name
            comment
            rating
            createdAt
          }
        }
      }
    `;
    try {
      const response = await graphQLCommand(PRODUCT_QUERY, { categoryId });
      setProducts(response.productsByCategory || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const category = categories.find((cat) => cat.name.toLowerCase() === categoryName.toLowerCase());
        if (category) {
          fetchProductsByCategory(category.id);  // Fetch products based on categoryId
        } else {
          console.error("Category not found.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchData();
    }
  }, [categoryName, categories]);

  // Show loading while fetching data
  if (loading) {
    return <div>Loading products...</div>;
  }

  // View More functionality
  const handleViewMore = () => {
    setLimit((prev) => prev + 6); // Increment the limit to load more products
  };

  // Get the next and previous category
  const currentCategoryIndex = categories.findIndex(
    (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
  );

  const prevCategory = categories[currentCategoryIndex - 1];
  const nextCategory = categories[currentCategoryIndex + 1];

  return (
    <div className="w-full min-h-screen flex flex-col">
      <section className="flex-1 p-6 bg-gradient-to-b from-gray-50 to-yellow-100">
        <h2 className="text-3xl font-bold mb-4 text-red-500 text-center uppercase">
          {categoryName} Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.slice(0, limit).map((p) => (
              <div
                key={p.id}
                className="rounded-lg shadow-lg p-4 flex flex-col hover:shadow-2xl transition-shadow bg-gradient-to-r from-purple-50 to-purple-100 border border-gray-500"
              >
                <div className="p-2">
                  <img
                    src={p.mainImage}
                    alt={p.name}
                    className="w-full h-64 object-cover mb-3 rounded-md shadow-md"
                  />
                </div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-2xl font-bold text-gray-800 uppercase">{p.name}</h3>
                  <span className="text-green-500 bg-green-100 px-2 py-1 rounded-md font-semibold">
                    ★ {p.reviews ? p.reviews.reduce((sum, review) => sum + review.rating, 0) / p.reviews.length : '0'}
                  </span>
                </div>
                <p className="text-red-500 font-semibold mb-1">Price: ₹{p.price}</p>
                <div className="flex justify-between items-center">
                  <p className="text-green-500">
                    {p.availableCount < 5
                      ? `Only ${p.availableCount} left!`
                      : `${p.availableCount} in stock`}
                  </p>
                  <span className="text-red-600 bg-red-100 px-2 py-1 rounded-md text-xs font-bold">
                    {p.offer || "No Offer"}% OFF
                  </span>
                  <button
                    className="bg-blue-600 text-white text-sm py-1 px-3 rounded-md hover:bg-blue-700 transition"
                    onClick={() => navigate(`/products/${categoryName}/${p.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No products found in this category.</p>
          )}
        </div>

        {/* View More Button */}
        {products.length > limit && (
          <div className="flex justify-center mt-4">
            <button
              className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-700"
              onClick={handleViewMore}
            >
              View More
            </button>
          </div>
        )}

        {/* Next and Previous Category Navigation */}
        <div className="flex justify-between mt-6">
          {prevCategory && (
            <button
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              onClick={() => navigate(`/products/${prevCategory.name}`)}
            >
              Previous Category
            </button>
          )}
          {nextCategory && (
            <button
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              onClick={() => navigate(`/products/${nextCategory.name}`)}
            >
              Next Category
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductCategoryPage;
