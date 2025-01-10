import React, { useEffect, useState, useCallback } from "react";
import { graphQLCommand } from "../../util";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";

const ProductPage = () => {
  const [Products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]); // Adjust as per product price ranges
  const { categoryName } = useParams();
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    const query = `
      query {
        getAllProducts {
          id
          name
          price
          availableCount
          description
          mainImage
          Brand
          offer
          rating
          productCategory { id name }
          reviews { id rating }
        }
      }
    `;
    try {
      const response = await graphQLCommand(query);
      setProducts(response.getAllProducts);
      setFilteredProducts(response.getAllProducts); // Initialize with all products
      const categories = [
        ...new Set(response.getAllProducts.map((p) => p.productCategory.name)),
      ];
      setCategories(categories);
    } catch (error) {
      console.error("Error fetching all products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBasedonCategory = useCallback(async () => {
    if (!categoryName || categoryName === "All") {
      fetchProducts();
      return;
    }

    const query = `
      query($name: String!) {
        productsByCategory(name: $name) {
          id
          name
          price
          availableCount
          description
          mainImage
          Brand
          offer
          rating
          productCategory { id name }
          reviews { id rating }
        }
      }
    `;

    try {
      setLoading(true);
      const variables = { name: categoryName };
      const data = await graphQLCommand(query, variables);
      setProducts(data.productsByCategory || []);
      setFilteredProducts(data.productsByCategory || []); // Initialize filtered products
    } catch (error) {
      console.error("Error fetching products by category:", error);
    } finally {
      setLoading(false);
    }
  }, [categoryName, fetchProducts]);

  // Handle Brand Filtering
  const onFilterChange = (selectedBrand) => {
    setBrands(selectedBrand);
    filterProducts({ brand: selectedBrand, search: searchText, price: priceRange });
  };

  // Handle Category Filtering
  const onCategoryChange = (selectedCat) => {
    setSelectedCategory(selectedCat);
    filterProducts({ category: selectedCat, brand: brands, search: searchText, price: priceRange });
  };

  // Handle Search Input
  const onSearch = (e) => {
    setSearchText(e.target.value);
    filterProducts({ search: e.target.value, brand: brands, category: selectedCategory, price: priceRange });
  };

  // Handle Price Filter
  const onPriceChange = (e) => {
    const [min, max] = e.target.value.split(",").map(Number);
    setPriceRange([min, max]);
    filterProducts({ price: [min, max], brand: brands, category: selectedCategory, search: searchText });
  };

  // Filter Logic
  const filterProducts = ({ brand = brands, category = selectedCategory, search = searchText, price = priceRange }) => {
    let filtered = [...Products];

    if (brand) {
      filtered = filtered.filter((product) => product.Brand === brand);
    }

    if (category) {
      filtered = filtered.filter((product) => product.productCategory.name === category);
    }

    if (search) {
      filtered = filtered.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()));
    }

    filtered = filtered.filter((product) => product.price >= price[0] && product.price <= price[1]);

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    fetchBasedonCategory();
  }, [categoryName, fetchBasedonCategory]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <section className="flex-1 p-6 bg-gradient-to-b from-gray-50 to-yellow-100">
        <NavBar />
        <section className="relative min-h-[30vh] flex items-center ">
          <video
            autoPlay
            loop
            muted
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          >
            <source src="/product_video.mp4" type="video/mp4" />
          </video>
          <div className="relative z-10 flex flex-col space-y-4 text-center w-full">
            <h1 className="text-3xl font-bold text-white">
              Explore our Products
            </h1>
            <div className="flex justify-center space-x-4">
              <select
                id="categories"
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="border p-2 rounded-md w-full sm:w-auto bg-white z-20"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                id="brands"
                value={brands}
                onChange={(e) => onFilterChange(e.target.value)}
                className="border p-2 rounded-md w-full sm:w-auto bg-white z-20"
              >
                <option value="">All Brands</option>
                {[...new Set(Products.map((product) => product.Brand))].map(
                  (brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  )
                )}
              </select>


              <input
                type="text"
                value={searchText}
                onChange={onSearch}
                placeholder="Search Products"
                className="border p-2 rounded-md w-full sm:w-auto bg-white z-20"
              />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-6 sm:grid-cols-2 md:grid-cols-3  gap-6 pt-3">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-lg shadow-lg p-4 flex flex-col hover:shadow-2xl transition-shadow bg-gradient-to-r from-gray-50 to-blue-100 "
              >
                <div className="p-2 h-[30%] w-[30%]">
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="aspect-square object-cover mb-3 rounded-md shadow-md"
                  />
                </div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-2xl font-bold text-gray-800 uppercase">
                    {product.name}
                    <span className="text-gray-700 bg-purple-200 ms-1 px-2 py-1 rounded-md text-[10px] mt-0 italic border border-gray-500">
                      {product.Brand || null}
                    </span>
                  </h3>
                  <span className="text-green-500 bg-green-100 px-2 py-1 rounded-md font-semibold">
                    ★ {product.rating || "No Ratings"}
                  </span>
                </div>
                <p className="text-red-500 font-semibold mb-1">
                  Price: ₹{product.price}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-green-500">
                    {product.availableCount < 5
                      ? `Only ${product.availableCount} left!`
                      : `${product.availableCount} in stock`}
                  </p>
                  <span className="text-red-600 bg-red-100 px-2 py-1 rounded-md text-xs font-bold">
                    {product.offer || "No Offer"}% OFF
                  </span>
                  <button
                    className="bg-blue-600 text-white text-sm py-1 px-3 rounded-md hover:bg-blue-700 transition"
                    onClick={() =>
                      navigate(`/category/${categoryName}/${product.id}`)
                    }
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No products found.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
