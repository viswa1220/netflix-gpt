import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const trendingProducts = [
  {
    id: 1,
    name: "Wireless Headphones X",
    price: "₹1,999",
    rating: 4.5,
    image: "wirelessX.png",
    description:
      "Experience immersive sound with these wireless headphones. Perfect for music, movies, and calls. Designed for comfort and long battery life.",
  },
  {
    id: 2,
    name: "Smartwatch Pro 2",
    price: "₹2,499",
    rating: 4,
    image: "smartwatchpro2.png",
    description:
      "Track your fitness and stay connected on the go. This new generation smartwatch features a sleek design and advanced health monitoring.",
  },
  {
    id: 3,
    name: "Sketchers",
    price: "₹1,299",
    rating: 4.2,
    image: "sketchers.png",
    description:
      "Low-latency earbuds for mobile gamers. Crisp audio, noise cancellation, and up to 20 hours of battery for non-stop gaming sessions.",
  },
];

const TrendingProductsSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1, // single card visible
    slidesToScroll: 1,
    arrows: false, // show next/prev arrows
    autoplay: true, // auto-rotate slides
    autoplaySpeed: 5000, // rotate every 5 seconds
    speed: 500, // transition speed
  };

  return (
    <section className="bg-gray-100 bg-gradient-to-r from-blue-200 to-blue-50 py-10 px-4 md:px-8 m-8">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
        Trending Products
      </h2>

      <Slider {...settings}>
        {trendingProducts.map((product) => (
          <div key={product.id}>
            {/* Card Container */}
            <div className="max-w-5xl mx-auto bg-gray-50 rounded-lg shadow p-6 flex flex-col md:flex-row items-center gap-6">
              {/* Left: Image */}
              <div className="md:w-1/2 flex justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                 className="w-[200px] h-[200px] object-cover"
                />
              </div>

              {/* Right: Text */}
              <div className="md:w-1/2">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  {product.name}
                </h3>

                {/* Price & Rating */}
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-lg font-bold text-gray-600">
                    {product.price}
                  </span>
                  {/* Star rating */}
                  {product.rating && (
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">
                        {"★".repeat(Math.floor(product.rating))}
                      </span>
                      <span className="text-gray-300">
                        {"★".repeat(5 - Math.floor(product.rating))}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description (up to 3 lines if you want line-clamp) */}
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default TrendingProductsSection;
