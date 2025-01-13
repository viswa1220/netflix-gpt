import React, { useState, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import RecommendationSection from "../RecommendationSection/RecommendationSection";
import Testimonial from "../Testimonial/Testimonial";
import { graphQLCommand } from "../../util";
import SliderComponent from "../SliderComponent/SliderComponent";
import { useNavigate } from "react-router-dom";

const HomeComponent = () => {
  const [products, setProducts] = useState([]);
  const [recProducts, setRecProducts] = useState([]);
  const navigate = useNavigate();
  const slides = [
    {
      id: 1,
      image: "hero_image.png",
      headline: "FREE Galaxy S22",
      subHeadline: "with our 50GB Airtime Plan.",
      description:
        "All credit types welcome\n*Handset loaned at no additional cost",
      buttonText: "Browse Our Plans",
    },
    {
      id: 2,
      image: "hero_home.png", // Or another image
      headline: "Welcome to Scroll And Shop",
      subHeadline: "Discover Our Latest Tech & Accessories",
      description:
        "From headphones and smartwatches to covers, straps, and chargers—\nwe have everything you need for your digital lifestyle.",
      buttonText: "Shop Now",
    },
  ];

  // 2. Slider State & Handlers
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideCount = slides.length;

  // Optional: Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [currentSlide]);

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === slideCount - 1 ? 0 : prev + 1));
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slideCount - 1 : prev - 1));
  };

  const fetchProductDetails = async () => {
    const query = `
      query {
        getAllProducts {
          id
          mainImage
          name
          price
          trendingStatus
          description
          saleStatus
          rating
          productCategory {
            name
          }
        }
      }
    `;
    try {
      const response = await graphQLCommand(query);
      const allProducts = response.getAllProducts || [];

      // Filter products with saleStatus === true
      const saleProducts = allProducts.filter((product) => product.saleStatus);

      setProducts(saleProducts); // Update the sale products in state
      setRecProducts(allProducts); // Update the full products in the recommendation state
    } catch (error) {
      console.error("Error fetching product details:", error.message);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="font-sans text-[#FFD65A]">
      <NavBar />

      {/* 4. Integrated Slider Section (Hero) */}
      <section className="relative w-full min-h-[55vh] bg-primaryBlack overflow-hidden">
        {/* Slides Wrapper (horizontal slide) */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => {
            const isActive = currentSlide === index;
            return (
              <div
                key={slide.id}
                className="flex-shrink-0 w-full h-full flex items-center justify-center px-4 md:px-8"
                style={{ minWidth: "100%", minHeight: "55vh" }}
              >
                {/* Slide Content */}
                <div className="flex flex-col-reverse md:flex-row items-center justify-between w-full max-w-6xl mx-auto">
                  {/* Left: Text */}
                  <div className="md:w-1/2 mt-8 md:mt-0 text-center md:text-left">
                    <h2 className="text-yellow-400 text-3xl md:text-4xl font-bold mb-2">
                      {slide.headline}
                    </h2>
                    <h3 className="text-white text-xl md:text-2xl font-semibold mb-4">
                      {slide.subHeadline}
                    </h3>
                    <p className="text-gray-300 text-base md:text-lg whitespace-pre-line mb-6">
                      {slide.description}
                    </p>
                    <button className="inline-flex items-center bg-yellow-400 text-black py-2 px-4 rounded-full font-semibold hover:bg-yellow-300 transition">
                      {slide.buttonText}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="ml-2 w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5l6 6m0 0-6 6m6-6H4.5"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Right: Image with slide-up animation */}
                  <div className="md:w-1/2 flex justify-center">
                    <img
                      src={slide.image}
                      alt={slide.headline}
                      style={{
                        animationName: "slideInUp",
                        animationDuration: "1s",
                        animationFillMode: "both",
                        animationIterationCount: 1,
                      }}
                      className={`
                        w-full h-full  object-contain
                        transition-all duration-700 ease-in-out
                        transform
                        ${
                          isActive
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                        }
                      `}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Left Arrow */}
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2
                     w-10 h-10 rounded-full border border-white
                     flex items-center justify-center
                     text-white hover:bg-white hover:text-black
                     transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        {/* Right Arrow */}
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2
                     w-10 h-10 rounded-full border border-white
                     flex items-center justify-center
                     text-white hover:bg-white hover:text-black
                     transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full border-2
                          transition-all duration-300
                          ${
                            currentSlide === idx
                              ? "bg-yellow-400 border-yellow-400"
                              : "border-white"
                          }`}
            />
          ))}
        </div>
      </section>

      {/* Optional Slider Below (if you want both sliders) */}
      <SliderComponent />

      {/* Sale Section */}
      {/* Sale Section */}
      <section className="py-10 px-8 mx-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Big Savings on Big SALE!!!
        </h2>

        {/* Check if there are products with saleStatus */}
        {products.length > 0 ? (
          <div
            className="
      grid 
      grid-cols-1 
      sm:grid-cols-2 
      md:grid-cols-3 
      xl:grid-cols-6 
      gap-6 
      w-full
    "
          >
            {products.map((item) => (
              <div
                key={item.id}
                className="
          relative 
          w-full 
          bg-gray-100 
          rounded-lg 
          overflow-hidden
          aspect-square
          transform
          transition
          duration-300
          hover:scale-105
          cursor-pointer
        "
                onClick={() => {
                  navigate(`/products/${item.productCategory.name}/${item.id}`);
                }}
              >
                {/* Background Image */}
                <img
                  src={item.mainImage}
                  alt={item.name}
                  className="
            absolute 
            inset-0 
            w-full 
            h-full 
            object-cover
          "
                />

                {/* Top: Product Name */}
                <div className="absolute top-2 left-2">
                  <h3 className="text-white px-2 py-1 text-sm sm:text-base">
                    {item.name}
                  </h3>
                </div>

                {/* Bottom Overlay with Details */}
                <div
                  className="
          absolute
          bottom-0
          left-0
          w-full
          p-3
          bg-gradient-to-t 
          from-black/80     
          to-transparent    
          text-white
          flex
          flex-col
          gap-2
        "
                >
                  {/* Pricing */}
                  <div className="flex items-center">
                    {item.price && (
                      <span className="text-sm font-bold mr-2">
                        ₹ {item.price}
                      </span>
                    )}
                  </div>

                  {/* Ratings */}
                  {item.rating && (
                    <div className="flex items-center ">
                      <span className="text-yellow-400   mr-1">
                        {"★".repeat(Math.floor(item.rating))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // If no products with saleStatus, display a message
          <div className="text-center text-gray-500 text-lg">
            No products available on sale at the moment.
          </div>
        )}
      </section>
      <RecommendationSection products={products}></RecommendationSection>

      {/* Trending Products Section */}
      <Testimonial></Testimonial>
    </div>
  );
};

export default HomeComponent;
