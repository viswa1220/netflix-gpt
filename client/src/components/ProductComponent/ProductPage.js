import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // To get the category name from URL
import { graphQLCommand } from "../../util"; // Import the utility function

const ProductPage = () => {
  const { categoryName } = useParams(); // Get the category name from the URL
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); // Initialize as an empty array, not null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products by category
  const fetchProductsByCategory = async (categoryName) => {
    const query = `
      query($name: String!) {
        productsByCategory(name: $name) {
          id
          name
          price
          availableCount
          description
          mainImage
          Brand
          offer
          productCategory {
            id
            name
          }
          reviews {
            id
            rating
          }
        }
      }
    `;
  
    try {
      setLoading(true);
      const data = await graphQLCommand(query, { name: categoryName });
      const products = data.productsByCategory || [];
  console.log(products)
      const productsWithRating = products.map((product) => {
        const reviews = product.reviews || [];
        const totalRating = reviews.reduce(
          (acc, review) => acc + (review.rating || 0),
          0
        );
        const averageRating =
          reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : "N/A"; // Set "N/A" if no reviews
        return { ...product, rating: averageRating };
      });
  
      setProducts(productsWithRating);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  // Fetch all products when category is "All"
  const fetchAllProducts = async () => {
    const query = `
      query {
        getAllProducts {
          id
          name
          price
          availableCount
          description
          mainImage
          Brand
          offer
          productCategory {
            id
            name
          }
          reviews {
            id
            rating
          }
        }
      }
    `;
  
    try {
      setLoading(true);
      const data = await graphQLCommand(query);
      const products = data.getAllProducts || [];
  
      const productsWithRating = products.map((product) => {
        const reviews = product.reviews || [];
        const totalRating = reviews.reduce(
          (acc, review) => acc + (review.rating || 0),
          0
        );
        const averageRating =
          reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : "N/A"; // Set "N/A" if no reviews
        return { ...product, rating: averageRating };
      });
  
      setProducts(productsWithRating);
    } catch (error) {
      console.error("Error fetching all products:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  // Trigger data fetch based on category
  useEffect(() => {
    if (categoryName) {
      if (categoryName === "All") {
        fetchAllProducts(); // Fetch all products if "All" is the category
      } else {
        fetchProductsByCategory(categoryName); // Fetch products by category name
      }
    } else {
      setError("Category name is missing"); // If categoryName is undefined or empty, handle it
    }
  }, [categoryName]);

  // Check if products is an empty array or undefined, then display appropriate message
  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 py-4">Error: {error}</div>;

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Video Background */}
      <section className="relative min-h-[30vh] flex items-center">
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/product_video.mp4" type="video/mp4" />
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-10"></div>
        <div className="relative w-full max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex flex-col space-y-4 z-10 text-white">
              <h1 className="text-3xl font-bold">Explore our Products</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Product List Section */}
      <section className="flex-1 p-6 bg-gradient-to-b from-gray-50 to-yellow-100">
        <h2 className="text-3xl font-bold mb-4 text-red-500 text-center uppercase">
          {categoryName === "All" ? "All Products" : categoryName}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="rounded-lg shadow-lg p-4 flex flex-col hover:shadow-2xl transition-shadow bg-gradient-to-r from-purple-50 to-purple-100 border border-gray-500"
              >
                <div className="p-2">
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="w-full h-64 object-cover mb-3 rounded-md shadow-md"
                  />
                </div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-2xl font-bold text-gray-800 uppercase">
                    {product.name}
                    <span className="text-gray-700 bg-purple-200 ms-1 px-2 py-1 rounded-md text-[10px] mt-0 italic border border-gray-500">
                      {product.Brand || null}
                    </span>
                  </h3>
                  <span className="text-green-500 bg-green-100 px-2 py-1 rounded-md font-semibold">
                    ★ {product.rating}
                  </span>
                </div>
                <p className="text-red-500 font-semibold mb-1">
                  Price: ₹{product.price}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-green-500">
                    {product.availableCount < 5
                      ? `Only ${product.availableCount} left!`
                      : `${product.availableCount} in stock`}
                  </p>
                  <span className="text-red-600 bg-red-100 px-2 py-1 rounded-md text-xs font-bold">
                    {product.offer || "No Offer"}% OFF
                  </span>
                  <button
                    className="bg-blue-600 text-white text-sm py-1 px-3 rounded-md hover:bg-blue-700 transition"
                    onClick={() =>
                      navigate(`/category/${categoryName}/${product.id}`)
                    }
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No products found.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
