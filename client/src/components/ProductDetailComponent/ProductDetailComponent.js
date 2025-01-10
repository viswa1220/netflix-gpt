import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import { CartContext } from "../../context/CartContext";
import { graphQLCommand } from "../../util";
import RelatedProductsSection from "../RelatedProductsSection/RelatedProductsSection";
const ProductDetailComponent = () => {
  const { categoryName, id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({ comment: "", rating: 0 });
  const [loading, setLoading] = useState(true);
  const [productLoaded, setProductLoaded] = useState(false);
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [reviewsToShow, setReviewsToShow] = useState(5);
  const [RelatedData, setRelatedData] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

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
        const sliderContent = [
          ...(fetchedProduct.sliderImages || []),
          fetchedProduct.video ? fetchedProduct.video : null,
        ].filter(Boolean);

        const reviews = fetchedProduct.reviews || [];
        const averageRating =
          reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviews.length
            : 0;

        setProduct({
          ...fetchedProduct,
          sliderContent,
          reviews,
          averageRating: averageRating.toFixed(1),
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
      setProductLoaded(true);
    }
  };
  useEffect(() => {
    fetchProductDetails();
  }, [id]);
  useEffect(() => {
    fetchAllProduct();
  }, [categoryName, id]);
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
  const fetchAllProduct = async () => {
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
          productCategory { id name }
          reviews { id rating }
        }
      }
    `;
    const response = await graphQLCommand(query);

    const filteredData =
      categoryName === "All"
        ? response.getAllProducts.filter(
            (item, index, self) =>
              index === self.findIndex((p) => p.id === item.id) // Ensure uniqueness
          )
        : response.getAllProducts
            .filter(
              (item) =>
                item.productCategory.name.includes(categoryName) &&
                item.id !== id
            )
            .filter(
              (item, index, self) =>
                index === self.findIndex((p) => p.id === item.id) // Ensure uniqueness
            );

    console.log("Filtered Related Data (Unique):", filteredData);
    setRelatedData(filteredData);
  };

  if (loading) {
    return <p className="text-center text">Loading product...</p>;
  }

  if (!product) {
    return <p className="text-center text-red-500">Product not found!</p>;
  }

  return (
    <div className="product">
      <NavBar />
      <div className="ProductDetail bg-gradient-to-t from-gray-50 to-yellow-100 min-h-screen py-8 ">
        <div className="flex flex-col lg:flex-row gap-4 px-4 lg:px-8">
        <div className="w-full  bg-gradient-to-b from-gray-50 to-blue-100 flex-1 rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-blue-800 uppercase mb-4">
              {product.name}
            </h1>
            <div className="flex flex-col lg:flex-row justify-between">
              <div className="w-full lg:w-[50%]">
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
                          className={`w-12 h-12 rounded-full ${
                            selectedColor?.color === color.color
                              ? "border-4 border-gray-300"
                              : "border--4 border-gray-500"
                          }`}
                          style={{ backgroundColor: color.color.toLowerCase() }}
                          aria-label={color.color}
                        ></button>
                      ))}
                    </div>
                  </div>
                )}
                {product.sizes?.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">Select Size:</h3>
                    <div className="flex space-x-4 mt-2">
                      {product.sizes.map((size, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            alert(`Selected size: ${size}`);
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg"
                        >
                          {size}
                        </button>
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

                  <div className="w-full">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      Description And Features
                    </h2>
                    <p
                      className={`text-gray-700 ${
                        isExpanded ? "" : "line-clamp-6"
                      } whitespace-pre-wrap`}
                    >
                      {product.description}
                    </p>
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="mt-2 text-blue-500 underline"
                    >
                      {isExpanded ? "Show Less" : "Read More"}
                    </button>

                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-gray-800">
                        Reviews
                      </h2>
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
                    {product.reviews
                      .slice(0, reviewsToShow)
                      .map((review, index) => (
                        <div key={index} className="mt-4">
                          <h3 className="text-lg font-semibold">
                            {review.name}
                          </h3>
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
                  </div>
                  {showAddReview && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-[500px]">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                          Add Review
                        </h3>
                        <textarea
                          className="w-full p-2  rounded-md mb-4"
                          placeholder="Write your review..."
                          value={newReview.comment}
                          onChange={(e) =>
                            setNewReview({
                              ...newReview,
                              comment: e.target.value,
                            })
                          }
                        />
                        <input
                          type="number"
                          max="5"
                          min="1"
                          className="w-full p-2  rounded-md mb-4"
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
                            className="bg text-white px-4 py-2 rounded-md hover:bg-gray-600 mr-2"
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
              <div className="w-full lg:w-[50%] m-4 flex justify-center">
                <img
                  src={selectedImage || product.sliderImages[0]}
                  alt="Selected product view"
                  className="w-full h-[500px] object-cover"
                />
              </div>
            </div>
          </div>
          
          

          {/*  <div className="relatedProducts w-full">
            <RelatedProductsSection
              RelatedProducts={RelatedData}
              category={categoryName}
            ></RelatedProductsSection>
          </div> */}
        </div>

        {/* Product Details */}
        <div className="w-full h-auto bg-gradient-to-b from-gray-50 to-blue-100 p-6 rounded-lg shadow-md self-start">
            <div className="text-black font-bold text-2xl pb-2">
              More Details
            </div>
            <div className="relative overflow-hidden rounded-lg shadow-md">
              {/* Slider Container */}
              {product.sliderContent.map((content, index) => (
                <div
                  key={index}
                  className={`w-full h-[550px] sm:h-[550px] lg:h-[600px] transition-all duration-500 ease-in-out ${
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
              <div
                className="absolute left-2 flex items-center justify-center w-8 h-8 -mr-4 text-white bg-gray-800 rounded-full cursor-pointer top-1/2 transform -translate-y-1/2 hover:bg-gray-700"
                onClick={() =>
                  setActiveIndex((prevIndex) =>
                    prevIndex === 0
                      ? product.sliderContent.length - 1
                      : prevIndex - 1
                  )
                }
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </div>
              {/*  <button
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-yellow-500 text-white rounded-full p-2  hover:bg-yellow-300 shadow-md z-10"
                onClick={() =>
                  setActiveIndex((prevIndex) =>
                    prevIndex === 0
                      ? product.sliderContent.length - 1
                      : prevIndex - 1
                  )
                }
              >
                &#8249;
              </button> */}
              <div
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white rounded-full p-2 shadow-md z-10 bg-gray-800 rounded-full cursor-pointer"
                onClick={() =>
                  setActiveIndex((prevIndex) =>
                    prevIndex === product.sliderContent.length - 1
                      ? 0
                      : prevIndex + 1
                  )
                }
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>

            {/* Indicator Dots */}
            <div className="flex justify-center mt-4">
              {product.sliderContent.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-3 h-3 mx-1 rounded-full cursor-pointer ${
                    idx === activeIndex ? "bg-blue-500" : "bg hover:bg-blue-400"
                  }`}
                  onClick={() => setActiveIndex(idx)}
                ></span>
              ))}
            </div>
          </div>
        <div className="relatedProducts w-full mt-2">
          <RelatedProductsSection
            RelatedProducts={RelatedData}
            category={categoryName}
          ></RelatedProductsSection>
        </div>
       
      </div>
    </div>
  );
};

export default ProductDetailComponent;
