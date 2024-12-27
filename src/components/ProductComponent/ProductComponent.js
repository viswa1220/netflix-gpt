import React, { useState, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import { useNavigate } from "react-router-dom";

const data = [
  {
    categoryName: "Airpods",
    products: [
      {
        id: 1,
        name: "Airpods Gen 2",
        price: 1600,
        availableCount: 10,
        image: "https://via.placeholder.com/300x200?text=Airpods+Gen+2",
        discount: 10,
        rating: 4.5,
      },
      {
        id: 2,
        name: "Airpods Pro",
        price: 2200,
        availableCount: 5,
        image: "https://via.placeholder.com/300x200?text=Airpods+Pro",
        discount: 15,
        rating: 4.8,
      },
      {
        id: 3,
        name: "Airpods Max",
        price: 3800,
        availableCount: 8,
        image: "https://via.placeholder.com/300x200?text=Airpods+Max",
        discount: 20,
        rating: 4.7,
      },
      {
        id: 4,
        name: "Airpods Lite",
        price: 1200,
        availableCount: 15,
        image: "https://via.placeholder.com/300x200?text=Airpods+Lite",
        discount: 5,
        rating: 4.3,
      },
      {
        id: 5,
        name: "Airpods Ultra",
        price: 4500,
        availableCount: 2,
        image: "https://via.placeholder.com/300x200?text=Airpods+Ultra",
        discount: 25,
        rating: 4.9,
      },
      {
        id: 6,
        name: "Airpods X",
        price: 1999,
        availableCount: 12,
        image: "https://via.placeholder.com/300x200?text=Airpods+X",
        discount: 10,
        rating: 4.2,
      },
      {
        id: 7,
        name: "Airpods Y",
        price: 2499,
        availableCount: 6,
        image: "https://via.placeholder.com/300x200?text=Airpods+Y",
        discount: 15,
        rating: 4.6,
      },
      {
        id: 8,
        name: "Airpods Z",
        price: 1500,
        availableCount: 18,
        image: "https://via.placeholder.com/300x200?text=Airpods+Z",
        discount: 8,
        rating: 4.1,
      },
      {
        id: 9,
        name: "Airpods Classic",
        price: 1700,
        availableCount: 9,
        image: "https://via.placeholder.com/300x200?text=Airpods+Classic",
        discount: 12,
        rating: 4.4,
      },
      {
        id: 10,
        name: "Airpods Studio",
        price: 3999,
        availableCount: 4,
        image: "https://via.placeholder.com/300x200?text=Airpods+Studio",
        discount: 18,
        rating: 4.7,
      },
      {
        id: 11,
        name: "Airpods Premium",
        price: 4999,
        availableCount: 3,
        image: "https://via.placeholder.com/300x200?text=Airpods+Premium",
        discount: 20,
        rating: 4.9,
      },
      {
        id: 12,
        name: "Airpods Mini",
        price: 1400,
        availableCount: 20,
        image: "https://via.placeholder.com/300x200?text=Airpods+Mini",
        discount: 5,
        rating: 4.2,
      },
      {
        id: 13,
        name: "Airpods Limited Edition",
        price: 5500,
        availableCount: 1,
        image:
          "https://via.placeholder.com/300x200?text=Airpods+Limited+Edition",
        discount: 30,
        rating: 5.0,
      },
    ],
  },
  {
    categoryName: "Shoes",
    products: [
      {
        id: 3,
        name: "Running Shoe",
        price: 1200,
        availableCount: 8,
        image: "https://via.placeholder.com/300x200?text=Running+Shoe",
        discount: 5,
        rating: 4.2,
      },
      {
        id: 4,
        name: "Casual Shoe",
        price: 900,
        availableCount: 6,
        image: "https://via.placeholder.com/300x200?text=Casual+Shoe",
        discount: 20,
        rating: 4.6,
      },
    ],
  },
  {
    categoryName: "Smartwatch",
    products: [
      {
        id: 5,
        name: "Sport Watch",
        price: 2500,
        availableCount: 4,
        image: "https://via.placeholder.com/300x200?text=Sport+Watch",
        discount: 25,
        rating: 4.9,
      },
      {
        id: 6,
        name: "Classic Watch",
        price: 3000,
        availableCount: 2,
        image: "https://via.placeholder.com/300x200?text=Classic+Watch",
        discount: 10,
        rating: 4.4,
      },
    ],
  },
];

const priceRanges = [
  { label: "Below 1000", min: 0, max: 1000 },
  { label: "1000 - 2000", min: 1000, max: 2000 },
  { label: "2000 - 3000", min: 2000, max: 3000 },
  { label: "3000 & Above", min: 3000, max: Infinity },
];

export default function ProductPage() {
  const [page, setPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [limit, setLimit] = useState(6);

  const current = data[page];
  const allCategories = data.map((c) => c.categoryName);

  const handleCategoryChange = (e) => {
    const chosen = e.target.value;
    setSelectedCategory(chosen);
    const foundIndex = data.findIndex((cat) => cat.categoryName === chosen);
    if (foundIndex !== -1) {
      setPage(foundIndex);
    } else {
      setPage(0);
    }
    setLimit(6);
  };

  const handlePriceRangeChange = (e) => {
    const r = priceRanges.find((x) => x.label === e.target.value);
    setSelectedPriceRange(r || null);
    setLimit(6);
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (!current) return;
    let items = [...current.products];

    if (selectedPriceRange) {
      const { min, max } = selectedPriceRange;
      items = items.filter((x) => x.price >= min && x.price <= max);
    }

    if (searchTerm.trim() !== "") {
      items = items.filter((x) =>
        x.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFiltered(items);
  }, [page, selectedPriceRange, searchTerm, current]);

  const displayed = filtered.slice(0, limit);
  const canViewMore = limit < filtered.length;

  return (
    <div className="w-full min-h-screen flex flex-col">
      <NavBar />
      {/* HERO SECTION */}
      <section className="relative min-h-[30vh] flex items-center">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/product_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay for Opacity */}
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-10"></div>

        {/* Content Wrapper with Margins */}
        <div className="relative w-full max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6">
            {/* Right: Text and Filters */}
            <div className="flex flex-col space-y-4 z-10 text-white">
              <h1 className="text-3xl font-bold">Explore our Products</h1>
              <p className="text-gray-200">
                Discover the latest deals on Airpods, Shoes, and Smartwatches.
                Filter by category, price, or search for your favorite items!
              </p>

              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Category
                  </label>
                  <select
                    className="border border-gray-300 bg-white text-gray-700 rounded-md p-2"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="">-- All/Current --</option>
                    {allCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Price Range
                  </label>
                  <select
                    className="border border-gray-300 bg-white text-gray-700 rounded-md p-2"
                    value={selectedPriceRange ? selectedPriceRange.label : ""}
                    onChange={handlePriceRangeChange}
                  >
                    <option value="">-- All --</option>
                    {priceRanges.map((r) => (
                      <option key={r.label} value={r.label}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Search
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 bg-white text-gray-700 rounded-md p-2"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setLimit(6);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="flex-1 p-6 bg-gradient-to-b from-gray-50 to-yellow-100">
        <h2 className="text-3xl font-bold mb-4 text-red-500  text-center uppercase">
          {current && current.categoryName}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
          {displayed.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-lg shadow-lg p-4 flex flex-col hover:shadow-2xl transition-shadow bg-gradient-to-r from-blue-50 to-blue-100"
            >
              {/* Image with padding */}
              <div className="p-2">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-48 object-cover mb-3 rounded-md shadow-md"
                />
              </div>

              {/* Name and Rating */}
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-lg font-bold text-blue-800 uppercase">
                  {p.name}
                </h3>
                <span className="text-green-500 bg-green-100 px-2 py-1 rounded-md font-semibold">
                  ★ {Math.floor(Math.random() * 5 + 1)}.0
                </span>
              </div>

              {/* Price */}
              <p className="text-red-500 font-semibold mb-1">
                Price: ₹{p.price}
              </p>

              {/* Quantity, Discount, and Button */}
              <div className="flex justify-between items-center">
                {/* Quantity */}
                <p className="text-green-500">
                  {p.availableCount < 5
                    ? `Only ${p.availableCount} left!`
                    : `${p.availableCount} in stock`}
                </p>

                {/* Discount */}
                <span className="text-red-600 bg-red-100 px-2 py-1 rounded-md text-xs font-bold">
                  {p.discount ? `${p.discount}% OFF` : "No Discount"}
                </span>
                <button
                  className="bg-blue-600 text-white text-sm py-1 px-3 rounded-md hover:bg-blue-700 transition"
                  onClick={() =>
                    navigate(`/products/${p.id}`, {

                    })
                  }
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        {canViewMore && (
          <div className="flex justify-center items-center mt-8">
            <button
              className="bg-blue-600 text-white text-lg py-2 px-6 rounded-md hover:bg-blue-700 transition"
              onClick={() => setLimit((prev) => prev + 6)}
            >
              View More
            </button>
          </div>
        )}

        {/* Pagination Buttons */}
        <div className="flex justify-center items-center mt-4 space-x-4">
          <button
            className="bg-gray-200 text-gray-700 px-5 py-2 rounded-md shadow hover:shadow-md hover:bg-gray-300 transition disabled:opacity-50"
            onClick={() => {
              if (page > 0) {
                setPage((prev) => prev - 1);
                setLimit(6);
              }
            }}
            disabled={page === 0}
          >
            Prev Category
          </button>
          <button
            className="bg-gray-600 text-white px-5 py-2 rounded-md shadow hover:shadow-lg hover:bg-gray-700 transition  disabled:opacity-50"
            onClick={() => {
              if (page < data.length - 1) {
                setPage((prev) => prev + 1);
                setLimit(6);
              }
            }}
            disabled={page === data.length - 1}
          >
            Next Category
          </button>
        </div>
      </section>

   
    </div>
  );
}
