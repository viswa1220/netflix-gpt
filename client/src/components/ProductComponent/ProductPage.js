import React, { useEffect, useState, useCallback } from "react";
import { graphQLCommand } from "../../util";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../NavBar/NavBar";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [brands, setBrands] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);

  // Read categoryName from the URL: "/products/:categoryName"
  const { categoryName } = useParams();
  const navigate = useNavigate();

  /** 1. Fetch ALL products (GraphQL) */
  const fetchAllProducts = useCallback(async () => {
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
      setLoading(true);
      const response = await graphQLCommand(query);
      const allProds = response.getAllProducts || [];
      setProducts(allProds);
      setFilteredProducts(allProds);
      console.log(allProds);

      // Build unique categories
      const categoryList = [
        ...new Set(allProds.map((p) => p.productCategory.name)),
      ];
      setCategories(categoryList);
    } catch (error) {
      console.error("Error fetching all products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  /** 2. Fetch products by a specific category (GraphQL) */
  const fetchProductsByCategory = useCallback(
    async (catName) => {
      if (!catName || catName === "All") {
        // If category is missing or "All", just fetch everything
        fetchAllProducts();
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
        const variables = { name: catName };
        const data = await graphQLCommand(query, variables);
        const catProds = data.productsByCategory || [];
        setProducts(catProds);
        setFilteredProducts(catProds);
      } catch (error) {
        console.error("Error fetching products by category:", error);
      } finally {
        setLoading(false);
      }
    },
    [fetchAllProducts]
  );

  /** 3. On mount or when categoryName changes */
  useEffect(() => {
    fetchProductsByCategory(categoryName);
  }, [categoryName, fetchProductsByCategory]);

  /** 4. Filter logic (on brand, category, search, price, etc.) */
  const filterProducts = ({
    brand = brands,
    category = selectedCategory,
    search = searchText,
    price = priceRange,
  }) => {
    let filtered = [...products];

    if (brand) {
      filtered = filtered.filter((p) => p.Brand === brand);
    }
    if (category) {
      filtered = filtered.filter((p) => p.productCategory.name === category);
    }
    if (search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    filtered = filtered.filter(
      (p) => p.price >= price[0] && p.price <= price[1]
    );
    setFilteredProducts(filtered);
  };

  /** Handlers */
  const onFilterChange = (selectedBrand) => {
    setBrands(selectedBrand);
    filterProducts({ brand: selectedBrand });
  };

  const onCategoryChange = (selectedCat) => {
    setSelectedCategory(selectedCat);
    filterProducts({ category: selectedCat });
  };

  const onSearch = (e) => {
    setSearchText(e.target.value);
    filterProducts({ search: e.target.value });
  };

  /** 5. Loading or empty state */
  if (loading) {
    return <div>Loading...</div>;
  }

  /** 6. Render the UI */
  return (
    <div className="bg-white min-h-screen">
      <NavBar />

      {/* Banner Section (optional video) */}
      <section className="relative min-h-[30vh] flex items-center">
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="/product_video.mp4" type="video/mp4" />
        </video>
        <div className="relative z-10 flex flex-col space-y-4 text-center w-full p-6">
          <h1 className="text-3xl font-bold text-black">
            Explore our Products
          </h1>

          <div className="flex flex-wrap justify-center gap-4">
            {/* Category Dropdown */}
            {categoryName === "All" && (
              <select
                id="categories"
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="border p-2 rounded-md bg-white z-20"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}

            {/* Brand Dropdown */}
            <select
              id="brands"
              value={brands}
              onChange={(e) => onFilterChange(e.target.value)}
              className="border p-2 rounded-md bg-white z-20"
            >
              <option value="">All Brands</option>
              {[...new Set(products.map((p) => p.Brand))].map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            {/* Search Input */}
            <input
              type="text"
              value={searchText}
              onChange={onSearch}
              placeholder="Search Products"
              className="border p-2 rounded-md bg-white z-20"
            />
          </div>
        </div>
      </section>

      {/* Grid of filtered products */}
      <div
        className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4 
          xl:grid-cols-5 
          gap-6 
          p-6
        "
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
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
                // Navigate to detail, with category fallback = "All"
                navigate(`/products/${categoryName || "All"}/${product.id}`)
              }
            >
              {/* Product Image */}
              <img
                src={product.mainImage}
                alt={product.name}
                className="
                  w-full 
                  h-full 
                  object-cover 
                  transition-transform 
                  duration-300 
                  group-hover:scale-110
                "
              />

              {/* Light gradient at the top for text contrast */}
              <div
                className="
                  absolute 
                  top-0 
                  w-full 
                  h-1/2 
                  bg-gradient-to-b
                  from-black/40
                  to-transparent
                  pointer-events-none
                "
              />

              {/* Info overlay (top-left) */}
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

              {/* Rating at the bottom-left */}
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
                <span>{product.rating ? product.rating.toFixed(1) : "0"}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-black col-span-5">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
