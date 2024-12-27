import React from "react";
import { useNavigate } from "react-router-dom";

const ProductListing = () => {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      name: "Smartphone",
      category: "Electronics",
      price: 699,
      availableCount: 25,
      offer: "10%",
      saleStatus: true,
      trendingStatus: false,
    },
    {
      id: 2,
      name: "Running Shoes",
      category: "Clothing",
      price: 120,
      availableCount: 50,
      offer: "5%",
      saleStatus: false,
      trendingStatus: true,
    },
  ];

  const handleEdit = (id) => {
    navigate(`/manage-product/${id}`);
  };

  return (
    <div className="p-6 bg-gray-100 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Product Listing</h2>
      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Stock</th>
              <th className="border border-gray-300 px-4 py-2">Offer</th>
              <th className="border border-gray-300 px-4 py-2">Sale</th>
              <th className="border border-gray-300 px-4 py-2">Trending</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{product.id}</td>
                <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                <td className="border border-gray-300 px-4 py-2">{product.category}</td>
                <td className="border border-gray-300 px-4 py-2">${product.price}</td>
                <td className="border border-gray-300 px-4 py-2">{product.availableCount}</td>
                <td className="border border-gray-300 px-4 py-2">{product.offer}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {product.saleStatus ? "Yes" : "No"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {product.trendingStatus ? "Yes" : "No"}
                </td>
                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(product.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => console.log("Delete product:", product.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductListing;
