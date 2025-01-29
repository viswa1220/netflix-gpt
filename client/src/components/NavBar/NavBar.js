import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { graphQLCommand } from "../../util";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // 1) Get userId from localStorage or however you store it
  const userId = localStorage.getItem("userId");

  // --------------------------------------------------
  // Fetch the categories (if needed)
  // --------------------------------------------------
  useEffect(() => {
    const fetchCategories = async () => {
      const query = `
        query {
          categories {
            id
            name
          }
        }
      `;
      try {
        const response = await graphQLCommand(query);
        const fetchedCategories = response.categories || [];
        // Add "All" to the front if you want
        const allCategories = [{ id: "all", name: "All" }, ...fetchedCategories];
        setCategories(allCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // --------------------------------------------------
  // Function to fetch the cart from GraphQL
  // --------------------------------------------------
  const fetchCart = async () => {
    if (!userId) {
      setCartCount(0);
      return;
    }

    const query = `
      query GetCart($userId: ID!) {
        getCart(userId: $userId) {
          id
          productId
          name
          price
          offer
          quantity
          size
          image
          categoryName
        }
      }
    `;

    try {
      const { getCart } = await graphQLCommand(query, { userId });
      // Example: sum of quantities for a total item count
      const totalQuantity = getCart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalQuantity);

      // Or if you only want the number of distinct cart items:
      // setCartCount(getCart.length);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartCount(0);
    }
  };

  // --------------------------------------------------
  // 2) Listen for "cartUpdated" event, then re-fetch
  // --------------------------------------------------
  useEffect(() => {
    // Whenever "cartUpdated" is dispatched, re-fetch the cart
    const handleCartUpdated = () => {
      fetchCart();
    };

    // Add event listener
    window.addEventListener("cartUpdated", handleCartUpdated);

    // Fetch the cart once on mount too
    fetchCart();

    // Cleanup
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, []);

  return (
    <nav className="bg-[#252F3B] shadow">
      <div className="h-20 px-4 flex items-center justify-between">
        {/* Left: Logo / Brand */}
        <Link to="/" className="text-xl font-bold text-[#FFD65A]">
          <img src="/logo.png" alt="logo" className="h-10 w-auto" />
        </Link>

        {/* Mobile: Hamburger + Cart Icon */}
        <div className="flex items-center md:hidden">
          {/* Cart Icon with count badge */}
          <Link to="/cart" className="relative mr-4 text-[#FFD65A]">
            <FaShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Hamburger Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#FFD65A]"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Desktop: Categories + Cart */}
        <div className="hidden md:flex space-x-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={
                cat.name === "All"
                  ? "/products/All"
                  : `/products/${encodeURIComponent(cat.name)}`
              }
              className="text-[#FFD65A] font-normal text-lg hover:text-white transition"
            >
              {cat.name}
            </Link>
          ))}
          {/* Cart icon on desktop with badge */}
          <Link to="/cart" className="relative text-[#FFD65A] font-normal text-lg">
            <FaShoppingCart className="inline mb-1 mr-1" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Desktop: Login & Sign Up */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login" className="text-gray-300 hover:text-white font-medium">
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-blue-600 text-white font-medium py-1.5 px-4 rounded hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Mobile Menu (dropdown) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#252F3B] text-[#FFD65A] px-4 pb-4 space-y-4">
          {/* Categories */}
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={
                cat.name === "All"
                  ? "/products/All"
                  : `/products/${encodeURIComponent(cat.name)}`
              }
              className="block py-2 border-b border-gray-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              {cat.name}
            </Link>
          ))}

          {/* Login & Sign Up */}
          <div className="border-t border-gray-600 pt-4 space-y-2">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              Login
            </Link>
            <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
