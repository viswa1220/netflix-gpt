import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

// Slick Arrow Components (optional custom)
const NextArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div
      className={`${className} !flex !items-center !justify-center !bg-yellow-500 !rounded-full !text-white !shadow-md hover:!bg-yellow-300`}
      onClick={onClick}
      style={{ right: "0", zIndex: 10 }}
    >
      &#8250;
    </div>
  );
};

const PrevArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div
      className={`${className} !flex !items-center !justify-center !bg-yellow-500 !rounded-full !text-white !shadow-md hover:!bg-yellow-300`}
      onClick={onClick}
      style={{ left: "0", zIndex: 10 }}
    >
      &#8249;
    </div>
  );
};

const RelatedProductsSection = ({ RelatedProducts, category }) => {
  const navigate = useNavigate();

  if (!Array.isArray(RelatedProducts) || RelatedProducts.length === 0) {
    return (
      <section className="p-4 w-full  rounded-md">
        <h2 className="text-3xl font-bold text-red-500 text-center uppercase mb-2">
          Related Products
        </h2>
        <p className="text-center text-gray-500">
          No related products available
        </p>
      </section>
    );
  }

  // Slider Settings
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3, // default (desktop)
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024, // below 1024px
        settings: {
          slidesToShow: 2, // tablet
        },
      },
      {
        breakpoint: 768, // below 768px
        settings: {
          slidesToShow: 1, // mobile
        },
      },
    ],
  };

  return (
    <section className="p-4 w-full   rounded-md ">
      <h2 className="text-3xl font-bold text-red-500 text-center uppercase">
        Related Products
      </h2>

      {/* React Slick Slider */}
      <div className="mt-4">
        <Slider {...settings}>
          {RelatedProducts.map((product) => (
            <div key={product.id} className="px-2">
              <div
                className="
                 bg-gradient-to-b from-gray-50 to-blue-100   rounded-lg shadow-md
                  overflow-hidden
                  flex
                  flex-col
                  h-full
                  my-4
                "
                style={{ minHeight: "400px" }}
              >
                {/* Image Container */}
                <div className="h-[250px]">
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 uppercase mb-2">
                      {product.name}
                      {product.Brand && (
                        <span className="text-gray-700 bg-purple-200 ms-1 px-2 py-1 rounded-md text-[10px] italic border border-gray-500">
                          {product.Brand}
                        </span>
                      )}
                    </h3>

                    <p className="text-red-500 font-semibold mb-1">
                      Price: ₹{product.price}
                    </p>

                    <p className="text-green-500">
                      {product.availableCount < 5
                        ? `Only ${product.availableCount} left!`
                        : `${product.availableCount} in stock`}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-red-600 bg-red-100 px-2 py-1 rounded-md text-xs font-bold">
                      {product.offer || "No Offer"}% OFF
                    </span>

                    <button
                      className="bg-blue-600 text-white text-sm py-1 px-3 rounded-md hover:bg-blue-700 transition"
                      onClick={() =>
                        navigate(`/category/${category}/${product.id}`)
                      }
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default RelatedProductsSection;
