import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const RelatedProductsSection = ({ RelatedProducts, categoryName }) => {
  const navigate = useNavigate();

  // Custom Arrow for Slider Navigation
  const CustomArrow = ({ className, onClick }) => (
    <div
      className={`${className} bg-yellow-400 hover:bg-yellow-300 rounded-full p-3`}
      onClick={onClick}
      style={{
        zIndex: 2,
      }}
    />
  );

  // Slider Settings
  const settings = {
    dots: false,
    infinite: RelatedProducts.length > 4, // Infinite scroll only if >4 products
    speed: 500,
    slidesToShow: 4,// Show up to 4 slides
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024, // Tablets
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768, // Mobile
        settings: { slidesToShow: 1 },
      },
    ],
    nextArrow: <CustomArrow />,
    prevArrow: <CustomArrow />,
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
                onClick={() =>
                  navigate(`/products/${categoryName}/${product.id}`)
                }
              >
                {/* Product Image */}
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
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-yellow-300"
                  >
                    <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.79 1.402 8.168L12 18.896l-7.336 3.872 1.402-8.168L.132 9.21l8.2-1.192z" />
                  </svg>
                  <span>
                    {product.rating ? product.rating.toFixed(1) : "N/A"}
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
