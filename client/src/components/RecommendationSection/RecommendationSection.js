import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

const dummyOrderHistory = [
  {
    productId: "6778184a2095fc0d169a98ee",
    name: "Airpods Pro",
    category: "Airpods",
    price: 2300,
    rating: 4.5,
    bookings: 120,
  },
  {
    productId: "67781ff2e158a162328cc09e",
    name: "Smart Watch 2",
    category: "Smart Watch",
    price: 3000,
    rating: 5,
    bookings: 200,
  },
];

// Utility: Calculate similarity
const normalize = (value, min, max) => {
  return (value - min) / (max - min);
};

const calculateMatchScore = (
  product,
  historyItem,
  minPrice,
  maxPrice,
  minRating,
  maxRating
) => {
  const normalizedProductFeatures = [
    normalize(product.price, minPrice, maxPrice),
    normalize(product.rating, minRating, maxRating),
  ];
  const normalizedHistoryFeatures = [
    normalize(historyItem.price, minPrice, maxPrice),
    normalize(historyItem.rating, minRating, maxRating),
  ];

  const tensorA = tf.tensor(normalizedProductFeatures);
  const tensorB = tf.tensor(normalizedHistoryFeatures);

  const similarity =
    1 - tf.losses.cosineDistance(tensorA, tensorB, 0).dataSync()[0];
  return Math.round(similarity * 100);
};

export const getPreferredProducts = (products, orderHistory) => {
  const prices = products.map((p) => p.price);
  const ratings = products.map((p) => p.rating);

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minRating = Math.min(...ratings);
  const maxRating = Math.max(...ratings);

  const recommendations = products.map((product) => {
    const maxScore = orderHistory.reduce((max, historyItem) => {
      const matchScore = calculateMatchScore(
        product,
        historyItem,
        minPrice,
        maxPrice,
        minRating,
        maxRating
      );
      return Math.max(max, matchScore);
    }, 0);

    return { ...product, matchScore: maxScore };
  });

  return recommendations
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10);
};

// Recommendation Component
const MostPreferredProducts = ({ products }) => {
  const [preferredProducts, setPreferredProducts] = useState([]);

  useEffect(() => {
    const recommendations = getPreferredProducts(products, dummyOrderHistory);
    setPreferredProducts(recommendations);
  }, [products]);

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">
        Most Preferred Products by Users
      </h2>
      <p className="text-gray-600 mb-6">
        Based on user preferences and bookings
      </p>
      {preferredProducts.length > 0 ? (
        <div className="flex gap-4  overflow-hidden">
          {preferredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 shadow-lg rounded-md min-w-[calc(25%-1rem)] flex-shrink-0"
              style={{ width: "calc(25% - 1rem)" }}
            >
              <img
                src={product.mainImage}
                alt={product.name}
                className="w-full h-40 object-cover mb-4 rounded-md"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-500">Price: ₹{product.price}</p>
              <p className="text-yellow-500">Rating: {product.rating}★</p>
              <div
                className="bg-green-500 text-white text-sm font-bold py-1 px-8 rounded-full inline-block m-8 my-2"
                title="Match based on user preferences"
              >
                {product.matchScore}% Match
              </div>
              <div
                className="bg-blue-100 text-blue-600 text-xs font-bold py-1 px-2 rounded-full inline-block"
                title="Total Bookings"
              >
                {product.bookings || Math.floor(Math.random() * 500) + 50}{" "}
                Bookings
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No preferred products available.</p>
      )}
    </div>
  );
};

export default MostPreferredProducts;
