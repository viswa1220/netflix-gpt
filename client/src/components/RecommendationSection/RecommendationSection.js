import React from "react";
import { Link } from "react-router-dom";

function getTopRated(products, count = 5) {
  return [...products].sort((a, b) => b.rating - a.rating).slice(0, count);
}

const RecommendationSection = ({ products }) => {
  if (!products || products.length === 0) return null;
  
  const topRated = getTopRated(products, 5);

  return (
    <div className="w-full bg-white">
      {/* 35px margin on left/right, some vertical spacing */}
      <div className="mx-16 my-8">
        <section>
          <h2 className="text-2xl mb-6 font-bold  text-center text-[#8B4513]">
            Top Rated
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6">
            {topRated.map((product) => (
             
              <div
                key={product.id}
                className=" relative w-full  rounded-lg overflow-hidden
                  aspect-square transform transition duration-300
                  hover:scale-105 cursor-pointer"
              >
                <Link to={`/products/All/${product.id}`}>
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                   
                </Link>
              
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

                {/* No star here for Top Rated */}
                <div className="absolute top-2 left-2 text-xl font-bold text-yellow-300">
                  {product.name}
                </div>
                <div className="absolute top-2 right-2 text-[#39FF14] text-xl font-bold">
                  ₹{product.price}
                </div>
                <div className="absolute bottom-2 left-2 text-red-800 text-xl font-semibold">
                  <span className="text-yellow-400 ">
                    {"★".repeat(Math.floor(product.rating)) +
                      "☆".repeat(5 - Math.floor(product.rating))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RecommendationSection;
