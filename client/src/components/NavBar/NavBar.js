import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  // Dummy nav links
  const navLinks = [
    {name: "All Products", href: "/products"},
    { name: "Airpods", href: "/airpods" },
    { name: "Speakers", href: "/speakers" },
    { name: "Headphones", href: "/headphones" },
    { name: "Smartwatches", href: "/smartwatches" },
    { name: "Chargers & Cables", href: "/chargers" },
    { name: "Covers & Straps", href: "/covers" },
    { name: "Shoes", href: "/shoes" },
    { name: "cart", href: "/cart" }
  ];

  return (
    <nav className="bg-white shadow rounded-md ">
      <div className="h-26 px-4 flex items-center justify-between">
        {/* Left: Logo / Brand */}
        <Link to="/" className="text-xl font-bold text-gray-800">
         <img src="/logo.png" alt="logo for website"></img>
        </Link>

        {/* Middle: Nav links (hidden on small screens) */}
        <div className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-gray-600 hover:text-gray-900 transition"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Login & Sign Up */}
        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
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
    </nav>
  );
};

export default NavBar;
