import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick"; // Importing react-slick
import "slick-carousel/slick/slick.css"; // Slick styles
import "slick-carousel/slick/slick-theme.css";
import { graphQLCommand } from "../../util";

const RelatedProductsSection = ({ categoryName, currentProductId }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRelatedProducts = async () => {
    const RELATED_PRODUCTS_QUERY = `
      query GetProductsByCategoryName($name: String!) {
        productsByCategory(name: $name) {
          id
          name
          price
          mainImage
          availableCount
          offer
          productCategory {
            name
          }
        }
      }
    `;

    try {
      setLoading(true);
      const response = await graphQLCommand(RELATED_PRODUCTS_QUERY, { name: categoryName });
      if (response.productsByCategory) {
        // Exclude the current product
        const filteredProducts = response.productsByCategory.filter(
          (product) => product.id !== currentProductId
        );
        setRelatedProducts(filteredProducts);
      }
    } catch (err) {
      setError("Failed to fetch related products.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryName && currentProductId) {
      fetchRelatedProducts();
    }
  }, [categoryName, currentProductId]);

  if (loading) return <p className="text-gray-500">Loading related products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (relatedProducts.length === 0)
    return <p className="text-gray-500">No related products available.</p>;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 3000,
    autoplay: true,
    arrows:false,
    responsive: [
      {
        breakpoint: 768, // Mobile devices
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024, // Tablets
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="related-products-section">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Similar Products</h2>
      <Slider {...sliderSettings}>
        {relatedProducts.map((product) => (
          <div
            key={product.id}
            className="px-4"
          >
            <div className="">
              <img
                src={product.mainImage}
                alt={product.name}
                className="w-full h-60 object-cover m-3 rounded-md"
              />
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {product.name}
              </h3>
              <p className="text-red-500 font-semibold">Price: ₹{product.price}</p>
              <p className="text-green-500">
                {product.availableCount > 0
                  ? `${product.availableCount} in stock`
                  : "Out of stock"}
              </p>
              {product.offer && (
                <p className="text-sm text-yellow-500 bg-yellow-200 px-2 py-1 rounded-md inline-block mt-2">
                  {product.offer}% OFF
                </p>
              )}
              <button
                onClick={() =>
                  navigate(`/category/${product.productCategory.name}/${product.id}`)
                }
                className="block mt-4 bg-blue-500 text-white text-center py-2 px-4 rounded-md hover:bg-blue-600"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RelatedProductsSection;
