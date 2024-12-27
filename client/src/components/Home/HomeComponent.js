import React from "react";
import SliderComponent from "../SliderComponent/SliderComponent";
import TrendingProductsSection from "../TrendingProductsSection/TrendingProductsSection";
import NavBar from "../NavBar/NavBar";
const products = [
  {
    id: 1,
    title: "Airpods Pro Black Mastercopy",
    image: "airpodblack.png",
    oldPrice: "₹2,000.00",
    newPrice: "₹1,600.00",
    rating: 4.5,
  },
  {
    id: 2,
    title: "Ultra Watch Gold 49mm",
    image: "analogwatch1.png",
    oldPrice: "₹3,000.00",
    newPrice: "₹2,200.00",
    rating: 4,
  },
  {
    id: 3,
    title: "Silicone case for Airpods Pro 2nd Generation",
    image: "airpodwhite.png",
    oldPrice: "",
    newPrice: "₹120.00",
    rating: 4,
  },
  {
    id: 4,
    title: "Apple Ultra 2 Smartwatch Copy",
    image: "smartwatchpro2.png",
    oldPrice: "",
    newPrice: "₹2,900.00",
    rating: 4.2,
  },
  {
    id: 5,
    title: "Sketchers",
    image: "sketchers.png",
    oldPrice: "",
    newPrice: "₹2,900.00",
    rating: 4.2,
  },
  {
    id: 6,
    title: "Shoes",
    image: "shoes2.png",
    oldPrice: "",
    newPrice: "₹2,900.00",
    rating: 4.2,
  },
];

const HomeComponent = () => {
  return (
    <div className="font-sans">
      <NavBar/>
      {/* Hero Section */}
      <section className="bg-yellow-400 py-8 px-4 md:px-8">
        {/* 
       
      */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left: Text Content */}
          <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Welcome to Scroll And Shop
            </h1>
            <h1 className="text-2xl md:text-2xl font-bold text-black mb-4">
              Discover Our Latest Tech & Accessories
            </h1>
            <p className="text-lg text-gray-800 mb-6 leading-relaxed text-white">
              From headphones and smartwatches to covers, straps, and chargers—
              we have everything you need for your digital lifestyle. Enjoy top
              brands, budget-friendly combos, and exclusive offers.
            </p>
            <a
              href="/shop"
              className="inline-block bg-black text-white px-6 py-2 rounded-md hover:bg-gray-900 transition"
            >
              Shop Now
            </a>
          </div>

          {/* Right: Image */}
          <div className="md:w-1/2 flex justify-center ">
            <img
              src="hero_home.jpg"
              alt="Hero showcasing products"
              className="max-w-sm w-full h-auto object-contain"
            />
          </div>
        </div>
      </section>
      {/* Slider Section */}
      <SliderComponent />

      
      <div className="py-12 px-8 ">
        <h2 className="text-3xl font-semibold text-center mb-8">
          Explore Categories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            {
              title: "Men's Collection",
              description: "Shoes, gadgets, and more for men.",
              img: "mens.png",
            },
            {
              title: "Women's Collection",
              description: "Style and gadgets for women.",
              img: "womens.png",
            },
            {
              title: "Kids' Collection",
              description: "Style and gadgets for kids.",
              img: "kids.png",
            },
          ].map((category, index) => (
            <div
              key={index}
              className="
        bg-gradient-to-r from-blue-100 to-blue-50
          border border-gray-300 
          rounded-lg 
          shadow-md 
          hover:shadow-xl
          overflow-hidden 
           
          transition
        "
            >
              {/* Image with 'pop-in' animation */}
              <img
                src={category.img}
                alt={category.title}
                className="
            w-full
            h-48
            object-cover
            p-4
           
          "
              />

              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600">{category.description}</p>

                <button
                  className="
              mt-4
              bg-blue-600
              text-white
              py-2
              px-4
              rounded
              hover:bg-blue-700
              transition
            "
                >
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="bg-gradient-to-r from-yellow-200 to-yellow-50 py-10 px-8 mx-8">
        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          Big Savings on Big SALE!!!
        </h2>

        {/* Grid of Products */}
        <div
          className="
      grid 
      grid-cols-1 
      sm:grid-cols-2 
      md:grid-cols-3 
      xl:grid-cols-6 
      gap-4 
      w-full
    "
        >
          {products.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-lg flex flex-col overflow-hidden"
            >
              <div className="relative w-full pb-[100%] overflow-hidden rounded-lg">
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Card Content */}
              <div className="p-4 flex flex-col h-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>

                {/* Pricing */}
                <div className="flex items-center mb-2">
                  {item.oldPrice && (
                    <span className="text-sm text-gray-400 line-through mr-2">
                      {item.oldPrice}
                    </span>
                  )}
                  <span className="text-md font-bold text-gray-800">
                    {item.newPrice}
                  </span>
                </div>

                {/* Ratings (simple stars) */}
                {item.rating && (
                  <div className="flex items-center mb-4">
                    <span className="text-yellow-400 mr-1">
                      {"★".repeat(Math.floor(item.rating))}
                    </span>
                    <span className="text-gray-300">
                      {"★".repeat(5 - Math.floor(item.rating))}
                    </span>
                  </div>
                )}

                {/* Button at bottom */}
                <div className="mt-auto">
                  <button
                    className="
                bg-blue-600
                text-white
                text-sm
                py-2
                px-3
                rounded
                hover:bg-blue-700
                transition
              "
                  >
                    Explore Products
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <TrendingProductsSection />
    
    </div>
    
  );
};

export default HomeComponent;
