import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import { CartContext } from "../../context/CartContext";
import { graphQLCommand } from "../../util";
import RelatedProductsSection from "../RelatedProductsSection/RelatedProductsSection";
const ProductDetailComponent = () => {
  const { categoryName, id } = useParams(); // Extract category and product ID from URL
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({ comment: "", rating: 0 });
  const [loading, setLoading] = useState(true);
  const [productLoaded, setProductLoaded] = useState(false); // To prevent re-fetching if already fetched
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [reviewsToShow, setReviewsToShow] = useState(5);

  const { addToCart } = useContext(CartContext);

  // Fetch product details by ID
  const fetchProductDetails = async () => {
  
    const PRODUCT_QUERY = `
      query GetProductById($id: ID!) {
        getProductById(id: $id) {
          id
          name
          price
          offer
          availableCount
          colors {
            color
            image
          }
          mainImage
          sliderImages
          productCategory{
            id
            name
          }
          video
          description
          features
          reviews {  
            name
            comment
            rating
            createdAt
          }
        }
      }
    `;

    try {
      const response = await graphQLCommand(PRODUCT_QUERY, { id });
      const fetchedProduct = response.getProductById;

      if (fetchedProduct) {
        // Combine slider images and video into one array
        const sliderContent = [
          ...(fetchedProduct.sliderImages || []),
          fetchedProduct.video ? fetchedProduct.video : null,
        ].filter(Boolean);

        // Calculate the average rating
        const reviews = fetchedProduct.reviews || []; // Ensure reviews is always an array
        const averageRating =
          reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviews.length
            : 0;

        // Set the state with the updated data
        setProduct({
          ...fetchedProduct,
          sliderContent,
          reviews,
          averageRating: averageRating.toFixed(1), // Round to 1 decimal place
        });

        if (fetchedProduct.colors?.length > 0) {
          setSelectedColor(fetchedProduct.colors[0]);
          setSelectedImage(fetchedProduct.colors[0].image);
        }
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
      setProductLoaded(true); // Set to true once the product is fetched
    }
  };
  useEffect(() => {
    fetchProductDetails(); // Only runs when `id` changes
  }, [id]);

  // Add product to cart
  const handleAddToCart = () => {
    if (!product || product.availableCount === 0) {
      alert("Product is out of stock!");
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      color: selectedColor?.color || null,
      image: selectedColor?.image || null,
      quantity: 1,
      availableCount: product.availableCount,
      offer: product.offer,
    };

    addToCart(cartItem);
    alert("Item added to cart!");
  };

  // Add review mutation
  const handleAddReview = async () => {
    const REVIEW_MUTATION = `
      mutation AddReview($input: ReviewInput!) {
        addReview(input: $input) {
          id
          name
          comment
          rating
          createdAt
        }
      }
    `;

    const userName = localStorage.getItem("userName") || "Unnamed User";

    try {
      const input = {
        productId: id, // Ensure this is the correct product ID
        name: userName,
        comment: newReview.comment,
        rating: newReview.rating,
      };

      const response = await graphQLCommand(REVIEW_MUTATION, { input });

      if (response.addReview) {
        // Refetch product details to get the latest reviews and rating
        await fetchProductDetails();

        setNewReview({ comment: "", rating: 0 });
        setShowAddReview(false);
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading product...</p>;
  }

  if (!product) {
    return <p className="text-center text-red-500">Product not found!</p>;
  }

  return (
    <div className="product">
      <NavBar />
      <div className="ProductDetail bg-gradient-to-t from-gray-50 to-yellow-100 min-h-screen py-8 px-8">
        <div className="flex flex-col lg:flex-row gap-4 px-4 lg:px-8">
          <div className="w-full  bg-gradient-to-r from-purple-50 to-purple-100 border border-gray-300 rounded-lg shadow-md border border-gray-500 p-6 max-w-full">
            <h1 className="text-3xl font-bold text-blue-800 uppercase mb-4">
              {product.name}
            </h1>
            <div className="flex flex-col lg:flex-row justify-between">
              <div className="w-full lg:w-[40%]">
                <div className="text-xl font-bold text-red-500">
                  
                  <span>₹{product.price}</span>
                </div>
                {product.offer && (
                  <p className="text-sm text-gray-700 bg-yellow-200 px-2 py-1 rounded-md inline-block mt-2">
                    {product.offer}% OFF
                  </p>
                )}
                <p className="mt-4 text-lg text-green-500 font-semibold">
                  {product.availableCount > 0
                    ? `${product.availableCount} in stock`
                    : "Out of stock"}
                </p>
                {product.colors?.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">Select Color:</h3>
                    <div className="flex space-x-4 mt-2">
                      {product.colors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedColor(color);
                            setSelectedImage(color.image);
                          }}
                          className={`w-12 h-12 rounded-full border-4 ${
                            selectedColor?.color === color.color
                              ? "border-blue-500"
                              : "border-gray-300"
                          }`}
                          style={{ backgroundColor: color.color.toLowerCase() }}
                          aria-label={color.color}
                        ></button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-6">
                  <button
                    className="bg-gray-500 text-white text-lg py-2 px-4 rounded-md hover:bg-gray-600 mr-4 my-2"
                    onClick={() => navigate("/products/All")}
                  >
                    Back to Products
                  </button>
                  <button
                    className="bg-green-500 text-white text-lg py-2 px-4 rounded-md hover:bg-green-600"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="w-full lg:w-[30%] flex justify-center items-center mt-4 me-64">
                <img
                  src={selectedImage || product.sliderImages[0]}
                  alt="Selected product view"
                  className="w-full h-[300px] object-cover"
                />
              </div>
            </div>
          </div>
        
        </div>

        {/* Product Details */}
        <div className="flex flex-col lg:flex-row gap-4 px-4 lg:px-8 mt-8">
          {/* Left Section: Description */}
          <div className="w-full lg:w-[30%] bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg shadow-md border border-gray-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Description
            </h2>
            <p className="text-gray-700 mb-6">{product.description}</p>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Features</h2>
            <ul className="list-disc list-inside text-gray-700">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          {/* Middle Section: Slider */}
          <div className="w-full lg:w-[30%] bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg shadow-md border border-gray-500">
            <div className="text-black font-bold text-2xl pb-2">More Views</div>
            <div className="relative overflow-hidden rounded-lg shadow-md">
              {/* Slider Container */}
              {product.sliderContent.map((content, index) => (
                <div
                  key={index}
                  className={`w-full h-[250px] sm:h-[350px] lg:h-[450px] transition-all duration-500 ease-in-out ${
                    activeIndex === index ? "block" : "hidden"
                  }`}
                >
                  {content.endsWith(".mp4") ? (
                    <video
                      src={content}
                      controls
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <img
                      src={content}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  )}
                </div>
              ))}

              {/* Navigation Arrows */}
              <button
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 shadow-md z-10"
                onClick={() =>
                  setActiveIndex((prevIndex) =>
                    prevIndex === 0
                      ? product.sliderContent.length - 1
                      : prevIndex - 1
                  )
                }
              >
                &#8249;
              </button>
              <button
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 shadow-md z-10"
                onClick={() =>
                  setActiveIndex((prevIndex) =>
                    prevIndex === product.sliderContent.length - 1
                      ? 0
                      : prevIndex + 1
                  )
                }
              >
                &#8250;
              </button>
            </div>

            {/* Indicator Dots */}
            <div className="flex justify-center mt-4">
              {product.sliderContent.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-3 h-3 mx-1 rounded-full cursor-pointer ${
                    idx === activeIndex
                      ? "bg-blue-500"
                      : "bg-gray-300 hover:bg-blue-400"
                  }`}
                  onClick={() => setActiveIndex(idx)}
                ></span>
              ))}
            </div>
          </div>

         
          {/* Right Section: Reviews */}
          <div className="w-full lg:w-[40%] px-6 py-8 bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg shadow-md border border-gray-500">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Reviews</h2>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={() => setShowAddReview(true)}
              >
                Add Review
              </button>
            </div>
            <div className="mt-4 text-xl text-center font-bold text-gray-800 p-2 rounded-md">
              Overall Rating: {product.averageRating}
            </div>
            {product.reviews.slice(0, reviewsToShow).map((review, index) => (
              <div key={index} className="mt-4">
                <h3 className="text-lg font-semibold">{review.name}</h3>
                <p className="text-gray-700">{review.comment}</p>
                <span className="text-yellow-500">
                  Rating: {review.rating}★
                </span>
              </div>
            ))}
            {product.reviews.length > reviewsToShow && (
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={() => setReviewsToShow((prev) => prev + 5)}
              >
                View More Reviews
              </button>
            )}
            {/* Add Review Modal */}
            {showAddReview && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-[500px]">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    Add Review
                  </h3>
                  <textarea
                    className="w-full p-2 border rounded-md mb-4"
                    placeholder="Write your review..."
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                  />
                  <input
                    type="number"
                    max="5"
                    min="1"
                    className="w-full p-2 border rounded-md mb-4"
                    placeholder="Rating (1-5)"
                    value={newReview.rating}
                    onChange={(e) =>
                      setNewReview({
                        ...newReview,
                        rating: Number(e.target.value),
                      })
                    }
                  />
                  <div className="flex justify-end">
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mr-2"
                      onClick={() => setShowAddReview(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                      onClick={handleAddReview}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="relatedProducts">

        </div>
      </div>
    </div>
  );
};

export default ProductDetailComponent;
