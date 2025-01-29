import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { graphQLCommand } from "../../util";
import { Link } from "react-router-dom";

// Custom Next Arrow
const NextArrow = ({ onClick }) => {
  return (
    <div
      className="absolute right-0 z-10 flex items-center justify-center w-8 h-8 
                 text-white bg-gray-800 rounded-full cursor-pointer 
                 top-1/2 transform -translate-y-1/2 hover:bg-gray-700"
      onClick={onClick}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
};

// Custom Previous Arrow
const PrevArrow = ({ onClick }) => {
  return (
    <div
      className="absolute left-0 z-10 flex items-center justify-center w-8 h-8 
                 text-white bg-gray-800 rounded-full cursor-pointer 
                 top-1/2 transform -translate-y-1/2 hover:bg-gray-700"
      onClick={onClick}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </div>
  );
};

const TopSellingProducts = () => {
  const [topSellingProducts, setTopSellingProducts] = useState([]);

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      const ordersQuery = `
        query GetAllOrders {
          getAllOrders {
            id
            cart {
              productId
              name
              price
              quantity
              image
              categoryName
            }
          }
        }
      `;

      try {
        const response = await graphQLCommand(ordersQuery);
        const orders = response.getAllOrders || [];

        // Aggregate product sales
        const productSalesMap = {};
        orders.forEach((order) => {
          order.cart.forEach((item) => {
            if (productSalesMap[item.productId]) {
              productSalesMap[item.productId].quantity += item.quantity;
            } else {
              productSalesMap[item.productId] = {
                productId: item.productId,
                name: item.name,
                price: item.price,
                image: item.image,
                categoryName: item.categoryName,
                quantity: item.quantity,
              };
            }
          });
        });

        // Convert the sales data to an array and sort by quantity sold
        const sortedProducts = Object.values(productSalesMap).sort(
          (a, b) => b.quantity - a.quantity
        );

        // Take the top 5 products
        setTopSellingProducts(sortedProducts.slice(0, 5));
      } catch (error) {
        console.error("Error fetching top-selling products:", error);
      }
    };

    fetchTopSellingProducts();
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />, // Add custom next arrow
    prevArrow: <PrevArrow />, // Add custom previous arrow
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          nextArrow: <NextArrow />, // Ensure arrows work on tablets
          prevArrow: <PrevArrow />,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          nextArrow: <NextArrow />, // Ensure arrows work on mobile
          prevArrow: <PrevArrow />,
        },
      },
    ],
  };

  return (
    <section className="py-8">
      {/* Title */}
      <h2 className="text-center text-2xl font-bold mb-6 text-[#8B4513]">
        Top Selling Products
      </h2>
      <div className=" mx-8 px-4 relative">
        {topSellingProducts.length > 0 ? (
          <Slider {...settings}>
            {topSellingProducts.map((product) => (
              <div key={product.productId} className="p-2">
                {/* Card */}
                <div className="relative w-full h-[300px] mx-auto rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Product Image (Card Background) */}
                  <Link to={`/products/All/${product.productId}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  {/* Product Info (Overlay) */}
                  <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 p-4 text-white">
                    <h3 className="text-lg font-bold">{product.name}</h3>
                    <p className="text-sm">
                      Category: {product.categoryName || "Unknown"}
                    </p>
                    <p className="text-[#39FF14] text-xl font-bold">
                      ₹{product.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <p className="text-center">No top-selling products available right now.</p>
        )}
      </div>
    </section>
  );
};

export default TopSellingProducts;
