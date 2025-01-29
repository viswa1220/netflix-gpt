import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";

import { graphQLCommand } from "../../util";
import RelatedProductsSection from "../RelatedProductsSection/RelatedProductsSection";

const ProductDetailComponent = () => {
  const { categoryName, id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Slider
  const [activeIndex, setActiveIndex] = useState(0);

  // Reviews
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({ comment: "", rating: 0 });
  const [reviewsToShow, setReviewsToShow] = useState(5);

  // Description read-more
  const [isExpanded, setIsExpanded] = useState(false);

  // Related
  const [RelatedData, setRelatedData] = useState([]);

  // Selected size
  const [selectedSize, setSelectedSize] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Fetch product details
  const fetchProductDetails = async () => {
    const PRODUCT_QUERY = `
      query GetProductById($id: ID!) {
        getProductById(id: $id) {
          id
          name
          price
          offer
          availableCount
          mainImage
          sliderImages
          video
          sizes
           rating
          description
          productCategory { id name }
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
        // Combine images + optional video
        const sliderContent = [
          ...(fetchedProduct.sliderImages || []),
          fetchedProduct.video ? fetchedProduct.video : null,
        ].filter(Boolean);

        // Calculate average rating
        const reviews = fetchedProduct.reviews || [];
        const avgRating =
          reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        setProduct({
          ...fetchedProduct,
          sliderContent,
          reviews,
          averageRating: avgRating.toFixed(1),
        });
        // Set the first size as default if available
        if (fetchedProduct.sizes?.length > 0) {
          setSelectedSize(fetchedProduct.sizes[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch related
  const fetchAllProduct = async () => {
    const query = `
      query {
        getAllProducts {
          id
          name
          price
          availableCount
          description
          sizes
          mainImage
          rating
          Brand
          offer
          productCategory { id name }
          reviews { id rating }
        }
      }
    `;
    try {
      const response = await graphQLCommand(query);
   
      const filteredData = response.getAllProducts
        .filter(
          (item) =>
            categoryName === "All" || item.productCategory.name === categoryName
        )
        .filter((item) => item.id !== id)
        .reduce((unique, current) => {
          if (!unique.some((item) => item.id === current.id)) {
            unique.push(current);
          }
          return unique;
        }, []);

      setRelatedData(filteredData);
      console.log(categoryName);
    } catch (error) {
      console.error("Error fetching products for related data:", error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    console.log(
      `Fetching related products for category: ${categoryName} and id: ${id}`
    );
    fetchAllProduct();
  }, [categoryName, id]);

  const fetchCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const CART_QUERY = `
      query GetCart($userId: ID!) {
        getCart(userId: $userId) {
          productId
          name
        }
      }
    `;
    try {
      const response = await graphQLCommand(CART_QUERY, { userId });
      setCartItems(response.getCart || []);
      console.log(categoryName);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    fetchCart();
  }, [id]);

  // Check if product is already in cart
  const isInCart = cartItems.some((item) => item.productId === product?.id);

  const handleAddToCart = async () => {
    if (!product || product.availableCount === 0) {
      alert("Product is out of stock!");
      return;
    }

    if (product.sizes?.length > 0 && !selectedSize) {
      alert("Please select a size before adding to cart!");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in to add items to the cart.");
      return;
    }

    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      offer: product.offer ? parseFloat(product.offer) : null,
      quantity: 1,
      size: selectedSize,
      image: product.mainImage,
      categoryName: categoryName,
    };

    const ADD_TO_CART_MUTATION = `
      mutation AddToCart($userId: ID!, $input: CartItemInput!) {
        addToCart(userId: $userId, input: $input) {
          id
          name
          quantity
          size
        }
      }
    `;

    try {
      const response = await graphQLCommand(ADD_TO_CART_MUTATION, {
        userId,
        input: cartItem,
      });

      if (response.addToCart) {
        alert("Item added to cart!");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart!");
    }
  };

  // Add Review
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
    const userName = localStorage.getItem("userId") || "Unnamed User";
    try {
      const input = {
        productId: id,
        name: userName,
        comment: newReview.comment,
        rating: newReview.rating,
      };
      const response = await graphQLCommand(REVIEW_MUTATION, { input });
      if (response.addReview) {
        await fetchProductDetails();
        setNewReview({ comment: "", rating: 0 });
        setShowAddReview(false);
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  if (loading) {
    return <p className="text-center mt-8">Loading product...</p>;
  }

  if (!product) {
    return <p className="text-center text-red-600 mt-8">Product not found!</p>;
  }

  return (
    <div className="bg-white min-h-screen">
      <NavBar />

      {/* Wrapper with about 20px horizontal padding (px-20) */}
      <div className="w-full px-4 py-2">
        {/* Title & Buttons row */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold uppercase text-primaryBlack">
            {product.name}
          </h1>
          {/* Add to Cart + Back Button */}
          <div className="flex flex-col lg:flex-row lg:space-x-4 mt-4  lg:mt-0">
            <button
              className={`
                ${
                  isInCart
                    ? "bg-green-600 cursor-not-allowed"
                    : "bg-primaryYellow hover:opacity-80"
                }
                text-primaryBlack 
                font-semibold
                text-lg 
                py-2 
                px-4 
                m-2
                rounded-md
              `}
              onClick={handleAddToCart}
              disabled={isInCart}
            >
              {isInCart ? "Already in Cart" : "Add to Cart"}
            </button>
            <button
              className="
      bg-gray-500
      text-white
      text-lg
      py-2
      px-4
      rounded-md
      hover:bg-gray-600
    "
              onClick={() => navigate("/products/All")}
            >
              Back
            </button>
          </div>
        </div>

        {/* Price & Offer */}
        <div className="text-xl font-bold text-red-600 mb-2">
          ₹{product.price}
          {product.offer && (
            <span className="ml-2 text-sm text-black bg-primaryYellow px-2 py-1 rounded-md">
              {product.offer}% OFF
            </span>
          )}
        </div>
        <p className="mt-1 mb-4 font-semibold text-green-600">
          {product.availableCount > 0
            ? `${product.availableCount} in stock`
            : "Out of stock"}
        </p>
        {/* Sizes - Show only if available */}
        {product.sizes?.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-bold text-primaryYellow mb-2">
              Select Size:
            </h3>
            <div className="flex space-x-4">
              {product.sizes.map((size, index) => (
                <button
                  key={index}
                  className={`
                    px-4 py-2 rounded-md border 
                    ${
                      selectedSize === size
                        ? "bg-primaryYellow text-primaryBlack"
                        : "bg-gray-200 text-black hover:bg-primaryYellow"
                    }
                  `}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 ">
          <div className="flex-1 flex flex-col lg:flex-row gap-4">
            {/* Main Image/Video */}
            <div className="flex-1 flex items-center justify-center  rounded-md shadow-sm bg-primaryBlack">
              {product.sliderContent?.[activeIndex]?.endsWith(".mp4") ? (
                <video
                  src={product.sliderContent[activeIndex]}
                  controls
                  className="object-contain max-h-[550px] rounded-md"
                />
              ) : (
                <img
                  src={
                    product.sliderContent?.[activeIndex] || product.mainImage
                  }
                  alt={product.name}
                  className="object-contain max-h-[550px] rounded-md"
                />
              )}
            </div>

            {/* Thumbnails */}
            {product.sliderContent?.length > 1 && (
              <div
                className="
                  flex 
                  flex-row 
                  lg:flex-col 
                  gap-2 
                  overflow-auto 
                  max-h-[550px]
                "
              >
                {product.sliderContent.map((content, idx) => {
                  const isVideo = content.endsWith(".mp4");
                  return (
                    <div
                      key={idx}
                      className={`
                        w-20 h-20 
                        bg-white 
                        border 
                        rounded-md 
                        shadow-sm 
                        flex 
                        items-center 
                        justify-center
                        cursor-pointer
                        hover:shadow-md 
                        transition
                        ${
                          activeIndex === idx
                            ? "border-primaryYellow"
                            : "border-gray-300"
                        }
                      `}
                      onClick={() => setActiveIndex(idx)}
                    >
                      {isVideo ? (
                        <video
                          src={content}
                          muted
                          className="max-w-full max-h-full object-cover"
                        />
                      ) : (
                        <img
                          src={content}
                          alt={`Thumb ${idx + 1}`}
                          className="max-w-full max-h-full object-cover rounded"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right side: info card (description, reviews) */}
          <div
            className="
              flex-[1.1] 
              p-4 
              rounded-md 
              shadow-md 
              bg-primaryBlack 
              text-white 
              flex 
              flex-col 
              max-h-[550px]
              overflow-y-auto
            "
          >
            {/* Description */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-primaryYellow mb-2">
                Description
              </h2>
              <p
                className={`leading-relaxed ${
                  !isExpanded && "line-clamp-4"
                } whitespace-pre-wrap`}
              >
                {product.description}
              </p>
              {product.description?.length > 100 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 text-blue-300 underline"
                >
                  {isExpanded ? "Show Less" : "Read More"}
                </button>
              )}
            </div>

            {/* Reviews */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-primaryYellow">
                  Reviews ({product.reviews.length})
                </h2>
                <button
                  className="
                    bg-blue-600 
                    text-white 
                    px-3 
                    py-1 
                    rounded-md 
                    hover:bg-blue-700
                  "
                  onClick={() => setShowAddReview(true)}
                >
                  Add Review
                </button>
              </div>
              <p className="text-md font-bold mt-2">
                Overall Rating: {product.averageRating} ★
              </p>

              {product.reviews.slice(0, reviewsToShow).map((review, i) => (
                <div key={i} className="mt-2 border-b border-gray-600 pb-2">
                  <h3 className="text-md font-semibold text-primaryYellow">
                    {review.name}
                  </h3>
                  <p>{review.comment}</p>
                  <span className="text-yellow-300">
                    Rating: {review.rating} ★
                  </span>
                </div>
              ))}
              {product.reviews.length > reviewsToShow && (
                <button
                  className="mt-3 text-blue-300 underline"
                  onClick={() => setReviewsToShow((prev) => prev + 5)}
                >
                  View More Reviews
                </button>
              )}
            </div>
          </div>
        </div>

        {showAddReview && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-[500px]">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Add Review</h3>
      <textarea
        className="w-full p-2 border rounded-md mb-4"
        placeholder="Write your review..."
        value={newReview.comment}
        onChange={(e) =>
          setNewReview({ ...newReview, comment: e.target.value })
        }
      />
      {/* Star Rating Section */}
      <div className="flex items-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            onClick={() =>
              setNewReview({ ...newReview, rating: star })
            }
            xmlns="http://www.w3.org/2000/svg"
            fill={newReview.rating >= star ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            className={`w-8 h-8 cursor-pointer ${
              newReview.rating >= star
                ? "text-yellow-500"
                : "text-gray-300"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.905c.969 0 1.371 1.24.588 1.81l-3.974 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.974-2.89a1 1 0 00-1.175 0l-3.974 2.89c-.784.57-1.838-.197-1.54-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 9.4c-.784-.57-.38-1.81.588-1.81h4.905a1 1 0 00.95-.69l1.518-4.674z"
            />
          </svg>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 mr-2"
          onClick={() => setShowAddReview(false)}
        >
          Cancel
        </button>
        <button
          className="
            bg-primaryBlack
            text-primaryYellow
            px-4 py-2
            rounded-md
            hover:opacity-80
          "
          onClick={handleAddReview}
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}


        {/* Related Products */}
        <div className="my-2">
          {<>{console.log(categoryName, "from parent")}</>}
          <RelatedProductsSection
            RelatedProducts={RelatedData}
            category={categoryName}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailComponent;
