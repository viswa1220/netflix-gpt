import React, { useState, useEffect } from "react";
import NavBar from "../NavBar/NavBar";

import { graphQLCommand } from "../../util";
import SliderComponent from "../SliderComponent/SliderComponent";
import { useNavigate } from "react-router-dom";
import RecommendationSection from "../RecommendationSection/RecommendationSection";
import TopSellingProducts from "../TopSellingProducts/TopSellingProducts";

const HomeComponent = () => {
  const [products, setProducts] = useState([]);
  const [recProducts, setRecProducts] = useState([]);
  const navigate = useNavigate();

  // Slides for the Hero Slider
  const slides = [
    {
      id: 1,
      image: "hero_home.png",
      headline: "Welcome to Scroll and Shop",
      subHeadline: "Your one-stop destination for gadgets & more",
      description:
        "From phones to shoes, we have it all.\nShop with convenience and ease.",
      buttonText: "Explore Now",
      url: "/products/All",
    },
    {
      id: 2,
      image: "airpodblack.png",
      headline: "AirPods - Wireless Freedom",
      subHeadline: "Experience true wireless audio",
      description:
        "Seamless pairing, immersive sound, and a sleek design for your lifestyle.",
      buttonText: "Shop AirPods",
      url: "/products/Airpods",
    },
    {
      id: 3,
      image: "analog_01.png",
      headline: "Timeless Analog Watches",
      subHeadline: "Classic style meets modern convenience",
      description:
        "Explore our premium analog watch collection for every occasion.",
      buttonText: "Browse Watches",
      url: "/products/Analog Watches",
    },
  ];

  // Slider state & auto-slide effect
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideCount = slides.length;

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

  // Navigate to slide's URL if set
  const handleSlideButton = (url) => {
    if (url) {
      navigate(url);
    }
  };

  // Fetch products from backend
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
          createdAt
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

      setProducts(saleProducts); // For SALE section
      setRecProducts(allProducts); // For the recommendation section
    } catch (error) {
      console.error("Error fetching product details:", error.message);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  return (
    <div className="font-sans text-[#FFD65A]">
      <NavBar />

      {/* Hero Slider Section */}
      <section className="relative w-full overflow-hidden">
        {/* Slides Container */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="
                flex-shrink-0
                w-full
                h-full
                relative
                flex
                items-center
                justify-center
                py-10
                px-4
                md:px-8
                text-center
                md:text-left
                bg-cover
                bg-center
              "
              style={{
                minWidth: "100%",
                // Adjust height for mobile vs. desktop via Tailwind
                // e.g., min-h-[40vh] for mobile, min-h-[60vh] for desktop
                minHeight: "60vh",

                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* Overlay to darken the background image */}
              <div className="absolute inset-0 bg-black/40"></div>

              {/* Slide Text/Content */}
              <div className="relative z-10 max-w-6xl mx-auto md:w-1/2">
                <h2 className="text-yellow-400 text-3xl md:text-4xl font-bold mb-2">
                  {slide.headline}
                </h2>
                <h3 className="text-white text-xl md:text-2xl font-semibold mb-4">
                  {slide.subHeadline}
                </h3>
                <p className="text-gray-300 text-base md:text-lg whitespace-pre-line mb-6">
                  {slide.description}
                </p>
                <button
                  onClick={() => handleSlideButton(slide.url)}
                  className="
                    inline-flex
                    items-center
                    bg-yellow-400
                    text-black
                    py-2
                    px-4
                    rounded-full
                    font-semibold
                    hover:bg-yellow-300
                    transition
                  "
                >
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
            </div>
          ))}
        </div>

        {/* Left Arrow (smaller on mobile) */}
        <button
          onClick={goToPrev}
          className="
            absolute left-2 
            top-1/2 transform -translate-y-1/2
            md:w-10 md:h-10 w-6 h-6
            rounded-full border border-white
            flex items-center justify-center
            text-white
            hover:bg-white hover:text-black
            transition
            z-10
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="md:w-4 md:h-4 w-3 h-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        {/* Right Arrow (smaller on mobile) */}
        <button
          onClick={goToNext}
          className="
            absolute right-2
            top-1/2 transform -translate-y-1/2
            md:w-10 md:h-10 w-6 h-6
            rounded-full border border-white
            flex items-center justify-center
            text-white
            hover:bg-white hover:text-black
            transition
            z-10
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="md:w-4 md:h-4 w-3 h-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>

        {/* Indicator dots (optional, if you want them) */}
        {/* 
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`
                w-3 h-3 rounded-full border-2
                transition-all duration-300
                ${
                  currentSlide === idx
                    ? "bg-yellow-400 border-yellow-400"
                    : "border-white"
                }
              `}
            />
          ))}
        </div>
        */}
      </section>

      {/* Optional Additional Slider */}
      <SliderComponent />
      <div className="mx-16 mb-3 text-gray-800 leading-relaxed">
          <p className="mb-3">
            Ready to <strong>scroll and shop</strong>? From trending wearables
            to must-have gadgets, our range is tailored for every taste and
            budget. Keep scrolling to uncover hidden gems and snag them before
            they’re gone!
          </p>
        </div>
      {/* SALE Section */}
      <section className="mx-16 my-8 bg-white">
        <h2 className="text-2xl text-[#8B4513] md:text-4xl font-bold text-center mb-8">
          Big Savings on Big SALE!!!
        </h2>
        {products.length > 0 ? (
          <div
            className="
        grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6
      "
          >
            {products.map((item) => (
             <div
             key={item.id}
             className="
               relative w-full bg-gray-100 rounded-lg overflow-hidden
               aspect-square transform transition duration-300
               hover:scale-105 cursor-pointer
             "
             onClick={() => {
               navigate(`/products/${item.productCategory.name}/${item.id}`);
             }}
           >
             {/* Product Image */}
             <img
               src={item.mainImage}
               alt={item.name}
               className="absolute inset-0 w-full h-full object-cover"
             />
           
             {/* Top-to-Bottom and Bottom-to-Center Gradient */}
             <div
               className="
                h-1/2  absolute 
                  top-0 
                  w-full 
                  bg-gradient-to-b
                  from-black/50
                  to-transparent
               "
             />
             <div
               className="
                 absolute inset-0
                 bg-gradient-to-t from-black/40 to-transparent
               "
             />
           
             {/* Product Name */}
             <div className="absolute top-2 left-2">
               <h3 className="text-xl font-bold text-yellow-400">{item.name}</h3>
             </div>
           
             {/* Price (Top-Right) */}
             <div className="absolute top-3 right-2">
               <span className="text-[#39FF14] text-xl font-bold">
                 ₹ {item.price}
               </span>
             </div>
           
             {/* Bottom Overlay */}
             <div
               className="
                 absolute bottom-0 left-0 w-full p-3
                 bg-gradient-to-t from-black/10 to-transparent
                 text-white flex flex-col gap-2
               "
             >
               {/* Ratings */}
               <div className="flex items-center">
                 <span className="text-yellow-400 mr-1 text-white text-xl font-semibold">
                   {"★".repeat(Math.floor(item.rating)) +
                     "☆".repeat(5 - Math.floor(item.rating))}
                 </span>
               </div>
             </div>
           </div>
           
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-lg">
            No products available on sale at the moment.
          </div>
        )}
      </section>

      <RecommendationSection products={recProducts} />

      <TopSellingProducts></TopSellingProducts>
    </div>
  );
};

export default HomeComponent;
