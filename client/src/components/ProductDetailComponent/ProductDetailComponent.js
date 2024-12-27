// src/components/ProductDetailComponent.js
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import { CartContext } from "../../context/CartContext"; // Import the Cart Context

// Define dummyData within the component or import it if it's in a separate file
const dummyData = [
  {
    id: 1,
    name: "Airpods Pro",
    price: 2200,
    availableCount: 10,
    offer: "10% OFF",
    colors: [
      {
        color: "White",
        image: "/airpodwhite.png",
      },
      {
        color: "Black",
        image: "/airpod.png",
      },
    ],
    sizes: null,
    images: ["/airpod.png", "/airpodblack.png"],
    video: "/product_video.mp4",
    description:
      "Airpods Pro offers active noise cancellation, transparency mode, and exceptional sound quality.",
    features: [
      "Active noise cancellation",
      "Transparency mode",
      "20 hours battery life",
      "Compatible with iOS and Android",
    ],
    reviews: [
      { id: 1, name: "John Doe", comment: "Great product!", rating: 5 },
      { id: 2, name: "Jane Smith", comment: "Value for money.", rating: 4 },
      { id: 3, name: "Jane Smith", comment: "Value for money.", rating: 4 },
    ],
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 300,
    availableCount: 5,
    offer: "15% OFF",
    colors: [
      {
        color: "Green",
        image: "/airpodwhite.png",
      },
      {
        color: "Black",
        image: "/airpodwhite.png",
      },
    ],
    sizes: ["40", "42", "44", "46"], // Available sizes
    images: ["https://via.placeholder.com/400x400?text=Shoes+View"],
    description: "Durable and lightweight running shoes for daily use.",
    features: [
      "Breathable mesh material",
      "Available in multiple sizes",
      "Lightweight and comfortable",
      "Great for long-distance running",
    ],
    reviews: [
      { id: 1, name: "Alice Brown", comment: "Super comfy!", rating: 5 },
      { id: 2, name: "Bob White", comment: "Good value.", rating: 4 },
    ],
  },
];

const ProductDetailComponent = () => {
  const { id } = useParams(); // Get product ID from route params
  const [product, setProduct] = useState(null); // Current product
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [visibleReviews, setVisibleReviews] = useState(2);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    comment: "",
    rating: 0,
  });
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext); // Use the Cart Context

  // Fetch product based on ID
  useEffect(() => {
    const foundProduct = dummyData.find((p) => p.id === parseInt(id, 10));
    setProduct(foundProduct);

    if (foundProduct) {
      if (foundProduct.colors?.length > 0) {
        setSelectedColor(foundProduct.colors[0]); // Set default color
      }
      if (foundProduct.sizes?.length > 0) {
        setSelectedSize(foundProduct.sizes[0]); // Set default size
      }
    }
  }, [id]);

  // Handle adding a new review
  const handleAddReview = () => {
    if (newReview.name && newReview.comment && newReview.rating) {
      setProduct((prevProduct) => {
        return {
          ...prevProduct,
          reviews: [
            ...prevProduct.reviews,
            { ...newReview, id: prevProduct.reviews.length + 1 },
          ],
        };
      });
      setNewReview({ name: "", comment: "", rating: 0 });
      setShowAddReview(false);
    } else {
      alert("Please fill out all fields");
    }
  };

  const handleBackToProducts = () => {
    navigate("/products"); // Navigate to the products listing page
  };

  // Handlers for Slider Navigation
  const handleNext = () => {
    if (product?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrev = () => {
    if (product?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  if (!product) {
    return <p className="text-center text-gray-500">Loading product...</p>;
  }

  const handleAddToCart = () => {
    if (product.availableCount === 0) {
      alert("Product is out of stock!");
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price, 
      color: selectedColor?.color || null,
      size: selectedSize || null,
      image: selectedColor?.image || null,
      quantity: 1,
      availableCount: product.availableCount,
      offer: product.offer, 
    };

    addToCart(cartItem); // Add item to the global cart
    alert("Item added to cart!");
  };

  return (
    <div className="ProductDetail bg-gradient-to-t from-gray-50 to-yellow-100">
      <NavBar />
      <div className="w-full flex flex-col items-center">
        {/* Slider and Video Section */}
        <section className="w-11/12 flex flex-col lg:flex-row gap-6 mb-8 mt-4">
          {/* Manual Slider Section */}
          <div className="w-full lg:w-1/2 relative shadow-xl">
            {product.images?.length > 0 ? (
              <>
                <div className="relative">
                  <img
                    src={product.images[currentImageIndex]}
                    alt={`Product view ${currentImageIndex + 1}`}
                    className="w-full h-[400px] object-cover rounded-md"
                  />
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-2xl px-2 py-1 bg-black bg-opacity-50 rounded-full"
                >
                  ⬅
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-2xl px-2 py-1 bg-black bg-opacity-50 rounded-full"
                >
                  ➡
                </button>
              </>
            ) : (
              <p className="text-gray-500 text-center">No images available</p>
            )}
          </div>

          {/* Video Section */}
          <div className="w-full lg:w-1/2 flex items-center justify-center relative shadow-xl">
            {product.video ? (
              <video
                src={product.video}
                controls
                className="w-full h-[400px] object-cover rounded-md shadow-md"
              />
            ) : (
              <p className="text-gray-500 text-center">No video available</p>
            )}
          </div>
        </section>

        <div className="w-full grid grid-cols-1 lg:grid-cols-5 gap-6 px-4">
          <div className="lg:col-span-2 px-6 py-8 rounded-lg shadow-md flex flex-col lg:flex-row space-y-6 lg:space-y-0 border border-gray-300 hover:shadow-xl bg-gradient-to-r from-blue-100 to-blue-50">
            {/* Left: Product Details */}
            <div className="space-y-4 flex-1 lg:pr-4">
              <h1 className="text-3xl font-bold text-blue-800 uppercase">
                {product.name}
              </h1>

              {/* Display Original and Discounted Price */}
              <div className="text-xl font-bold text-red-500">
                <span className="text-red-800 mr-2">₹{product.price}</span>
              </div>

              {/* Available Count */}
              {product.availableCount !== undefined && (
                <p className="text-lg text-green-500 font-semibold">
                  {product.availableCount > 0
                    ? `${product.availableCount} in stock`
                    : "Out of stock"}
                </p>
              )}

              {product.offer && (
                <p className="text-sm text-gray-700 bg-yellow-200 inline-block px-2 py-1 rounded-md w-fit">
                  {product.offer}
                </p>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Select Color:
                  </h3>
                  <div className="flex space-x-4 mt-2">
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 ${
                          selectedColor?.color === color.color
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                        style={{
                          backgroundColor: color.color.toLowerCase(),
                        }}
                        aria-label={color.color}
                      ></button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Select Size:
                  </h3>
                  <div className="flex space-x-4 mt-2">
                    {product.sizes.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-md border-2 ${
                          selectedSize === size
                            ? "border-blue-500 bg-blue-100"
                            : "border-gray-300"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <div className="mt-6 flex space-x-4">
                <button
                  className="w-40 bg-gray-500 text-white text-lg font-semibold py-2 px-2 rounded-md hover:bg-gray-600 transition"
                  onClick={handleBackToProducts}
                >
                  Back to Products
                </button>
                <button
                  className="w-32 bg-green-500 text-white text-lg font-semibold py-2 rounded-md hover:bg-green-600 transition"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Right Image - Now it comes below the product details on mobile */}
            {selectedColor?.image && (
              <img
                src={selectedColor.image}
                alt={`${selectedColor.color} view`}
                className="w-full lg:w-1/2 md:w-1/2 h-auto object-cover rounded-md shadow-md mt-6 lg:mt-0 md:mt-0"
              />
            )}
          </div>

          {/* Right: Description and Features */}
          <div className="lg:col-span-3 bg-gradient-to-r from-blue-100 to-blue-50 px-6 py-8 rounded-lg shadow-md flex flex-col space-y-4 border border-gray-300 hover:shadow-xl">
            <h2 className="text-2xl font-bold text-blue-700">Description</h2>
            <p className="text-gray-700 text-black">{product.description}</p>

            {product.features && (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mt-4">
                  Features
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Review Section */}
      <div className="sm:w-[96%] md:w-[96%] lg:w-[96%] m-8 p-4 border border-gray-300 rounded-md hover:shadow-xl bg-gradient-to-r from-blue-100 to-blue-50 text-left">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-gray-800">Reviews</h2>
          <button
            className="w-32 bg-gray-500 text-white text-sm font-semibold py-1 px-3 rounded-md hover:bg-gray-600 transition mt-2 sm:mt-4"
            onClick={() => setShowAddReview(true)}
          >
            Add Review
          </button>
        </div>

        {product.reviews?.length > 0 ? (
          product.reviews.slice(0, visibleReviews).map((review) => (
            <div key={review.id} className="mt-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {review.name}
              </h3>
              <p className="text-gray-600">{review.comment}</p>
              <span className="text-yellow-500">Rating: {review.rating}★</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            No reviews available for this product.
          </p>
        )}

        {visibleReviews < product.reviews?.length && (
          <div className="text-center mt-2">
            <button
              className="bg-gray-200 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-300"
              onClick={() => setVisibleReviews((prev) => prev + 2)}
            >
              View More
            </button>
          </div>
        )}
      </div>

      {/* Add Review Modal */}
      {showAddReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg space-x-4">
            <h2 className="text-xl font-bold mb-4">Add Review</h2>
            <input
              type="text"
              placeholder="Your Name"
              value={newReview.name}
              onChange={(e) =>
                setNewReview({ ...newReview, name: e.target.value })
              }
              className="w-full mb-4 p-2 border border-gray-300 rounded-md"
            />
            <textarea
              placeholder="Your Comment"
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              className="w-full mb-4 p-2 border border-gray-300 rounded-md"
            ></textarea>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Rating:</h3>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className={`text-2xl ${
                      newReview.rating >= star
                        ? "text-yellow-500"
                        : "text-gray-400"
                    }`}
                    aria-label={`${star} Star`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={() => setShowAddReview(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={handleAddReview}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailComponent;
