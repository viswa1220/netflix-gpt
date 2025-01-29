import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const RelatedProductsSection = ({ RelatedProducts, categoryName }) => {
  const navigate = useNavigate();
  

 // Custom Next Arrow
const NextArrow = ({ onClick }) => {
  return (
    <div
      className="absolute right-0 z-10 flex items-center justify-center w-8 h-8 
                 text-white bg-gray-800 rounded-full cursor-pointer 
                 top-1/2 transform -translate-y-1/2 hover:bg-gray-700"
      onClick={onClick}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
};

// Custom Previous Arrow
const PrevArrow = ({ onClick }) => {
  return (
    <div
      className="absolute left-0 z-10 flex items-center justify-center w-8 h-8 
                 text-white bg-gray-800 rounded-full cursor-pointer 
                 top-1/2 transform -translate-y-1/2 hover:bg-gray-700"
      onClick={onClick}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </div>
  );
};

  // Slider Settings
  const settings = {
    dots: false,
    infinite: RelatedProducts.length > 4, 
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, 
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768, 
        settings: { slidesToShow: 1 },
      },
    ],
    nextArrow: <NextArrow />, // Add custom next arrow
    prevArrow: <PrevArrow />, // Add custom previous arrow
  };

  return (
    <div className="p-4">
      <h2 className="text-center text-3xl font-bold text-yellow-400 mb-6 uppercase">
        Related Products
      </h2>
      {RelatedProducts?.length > 0 ? (
        <Slider {...settings} className="relative">
          {RelatedProducts.map((product) => (
            <div key={product.id} className="px-3">
              <div
                className="
                  group
                  relative
                  overflow-hidden
                  h-96
                  w-full
                  rounded-lg
                  shadow-lg
                  hover:shadow-2xl
                  cursor-pointer
                  transition-all
                "
                onClick={() => {
                  const currentCategoryName = categoryName || "All"; 
                  navigate(`/products/${currentCategoryName}/${product.id}`);
                }}
                
              >
               
                <img
                  src={product.mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Info Overlay */}
                <div className="absolute top-0 w-full px-4 py-2 text-white">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-yellow-400">
                      {product.name}
                    </h3>
                    <span className="text-red-500 font-bold ml-2">
                      ₹{product.price}
                    </span>
                  </div>
                  {product.Brand && (
                    <p className="text-sm font-light italic">
                      Brand: {product.Brand}
                    </p>
                  )}
                </div>

                {/* Rating */}
                <div
                  className="
                    absolute 
                    bottom-2 
                    left-2 
                    bg-black/60 
                    text-white 
                    text-xs 
                    px-2 
                    py-1 
                    rounded-full 
                    flex 
                    items-center 
                    space-x-1
                  "
                >
                 <span className="text-yellow-400 mr-1 text-white text-xl font-semibold">
                      {"★".repeat(Math.floor(product.rating)) +
                        "☆".repeat(5 - Math.floor(product.rating))}
                    </span>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-center text-gray-400">No related products found.</p>
      )}
    </div>
  );
};

export default RelatedProductsSection;
