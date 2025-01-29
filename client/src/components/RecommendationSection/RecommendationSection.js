import React from "react";
import { Link } from "react-router-dom";

// Check if product is within the last 2 days
function isNewWithinTwoDays(product) {
  if (!product.createdAt) return false;
  const createdAtMillis = Number(product.createdAt);
  const createdAtDate = new Date(createdAtMillis);
  const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
  return createdAtDate.getTime() >= twoDaysAgo;
}

function getNewArrivals(products, count = 5) {
  return [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, count);
}

function getTopRated(products, count = 5) {
  return [...products].sort((a, b) => b.rating - a.rating).slice(0, count);
}

const RecommendationSection = ({ products }) => {
  if (!products || products.length === 0) return null;

  const newArrivals = getNewArrivals(products, 5);
  const topRated = getTopRated(products, 5);

  return (
    <div className="w-full bg-white">
      {/* 35px margin on left/right, some vertical spacing */}
      <div className="mx-16 my-8">
        {/* --- Introductory Text Above New Arrivals --- */}
        <div className="text-gray-800 leading-relaxed">
          <h3 className="text-xl font-bold mb-2 text-[#8B4513] text-center">
            Discover Our Freshest Finds
          </h3>
          <p className="text-center">
            Welcome to our newest collection! We constantly update our offerings
            so you can stay ahead of the trends. Whether you're hunting for the
            latest tech or chic fashion statements, each item is carefully
            curated to ensure quality.
          </p>
        </div>

        {/* --- New Arrivals Section --- */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold m-6 text-center text-[#8B4513]">
            New Arrivals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6">
            {newArrivals.map((product) => (
              <div
                key={product.id}
                className="relative w-full bg-gray-100 rounded-lg overflow-hidden
                  aspect-square transform transition duration-300
                  hover:scale-105 cursor-pointer"
              >
                {/* Clickable image */}
                <Link
                  to={`/products/${product.productCategory?.name}/${product.id}`}
                >
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    // Higher (square-ish) height
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </Link>

               
                {isNewWithinTwoDays(product) && (
                  <div
                    className="absolute top-2 right-2 text-green-500 text-md"
                    title="Newly added!"
                  >
                    Added recently
                  </div>
                )}

                {/* Overlaid text: name top-left in white, price bottom-left in red, bookings bottom-right in white */}
                <div className="absolute top-2 left-2 text-white text-xl font-semibold">
                  {product.name}
                </div>
                <div className="absolute bottom-2 left-2 text-red-500 text-xl font-semibold">
                  ₹{product.price}
                </div>
                <div className="absolute bottom-2 right-2 text-red-500 text-xl font-semibold">
                  <span className="text-yellow-400 ">
                    {"★".repeat(Math.floor(product.rating)) +
                      "☆".repeat(5 - Math.floor(product.rating))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- Some Middle Content (Optional) --- */}
        <div className="mb-10 text-gray-800 leading-relaxed">
          <p className="mb-3">
            Ready to <strong>scroll and shop</strong>? From trending wearables
            to must-have gadgets, our range is tailored for every taste and
            budget. Keep scrolling to uncover hidden gems and snag them before
            they’re gone!
          </p>
        </div>

        {/* --- Top Rated Section (No Star) --- */}
        <section>
          <h2 className="text-2xl mb-6 font-bold  text-center text-[#8B4513]">
            Top Rated
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6">
            {topRated.map((product) => (
              <div
                key={product.id}
                className=" relative w-full bg-gray-100 rounded-lg overflow-hidden
                  aspect-square transform transition duration-300
                  hover:scale-105 cursor-pointer"
              >
                <Link
                  to={`/products/${product.productCategory?.name}/${product.id}`}
                >
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </Link>

                {/* No star here for Top Rated */}
                <div className="absolute top-2 left-2 text-white text-xl font-semibold">
                  {product.name}
                </div>
                <div className="absolute bottom-2 left-2 text-red-500 text-xl font-semibold">
                  ₹{product.price}
                </div>
                <div className="absolute top-2 right-2 text-red-500 text-xl font-semibold">
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
