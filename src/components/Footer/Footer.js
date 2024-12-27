import React from 'react';
import { FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-yellow-400">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto mt-2 px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
        
        {/* Brand / Description */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Scroll And Shop</h3>
          <p className="text-gray-800 mt-2 leading-relaxed">
            Your one-stop shop for premium gadgets and shoes.
            Explore the best deals tailored to your needs.
          </p>
        </div>
        
        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-semibold text-gray-800">Quick Links</h4>
          <ul className="mt-2 space-y-1">
            <li>
              <a href="#about" className="text-gray-700 hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="#contact" className="text-gray-700 hover:underline">
                Contact Us
              </a>
            </li>
            {/* Instagram with icon */}
            <li>
              <a
                href="https://instagram.com/scroll_and_shopp"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-700 hover:underline"
              >
                <FaInstagram className="text-2xl" />
                <span>Instagram</span>
              </a>
            </li>
          </ul>
        </div>
        
        {/* Follow Us */}
        <div>
          <h4 className="text-xl font-semibold text-gray-800">Follow Us</h4>
          <p className="text-gray-700 mt-2">
            Stay updated with our latest collections and offers!
          </p>
          <p className="text-gray-700 mt-2">
            <strong>@ScrollAndShop</strong> on Instagram
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-300">
        <p className="text-center text-gray-800 py-4 text-sm">
          &copy; 2024 Scroll And Shop. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
