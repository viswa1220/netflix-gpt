import React, { useState, useEffect } from 'react';
import { graphQLCommand } from "../../util";
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const AdminProductComponent = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // To hold the selected product for the popup
  const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility
  const navigate = useNavigate(); // Hook to navigate to different pages

  // Fetch all products from the GraphQL API
  useEffect(() => {
    const fetchProducts = async () => {
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
            productCategory { id name }
            sliderImages
            video
          }
        }
      `;

      try {
        const response = await graphQLCommand(query);
        setProducts(response.getAllProducts || []);
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };

    fetchProducts();
  }, []);

  // Handle modal open and close
  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Handle modal close
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Handle delete product
  const handleDelete = async (productId) => {
    // Replace with actual delete mutation or function
    console.log(`Deleting product with id: ${productId}`);
    // Perform delete operation and update UI
  };

  // Handle edit product
  const handleEdit = (productId) => {
    // Navigate to edit page or open modal to edit the product
    console.log(`Editing product with id: ${productId}`);
  };

  // Handle back to dashboard
  const handleBack = () => {
    navigate('/dashboard'); // Navigate back to the dashboard page
  };

  return (
    <div className="min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Product Management</h1>

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="bg-primaryYellow text-primaryBlack py-2 px-4 rounded-md mb-6 hover:bg-yellow-600 transition-all duration-200"
      >
        Back to Dashboard
      </button>

      {/* Product Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => handleCardClick(product)} // Open modal on card click
            className="bg-primaryBlack p-4 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 text-white cursor-pointer"
          >
            {/* Product Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-lg font-semibold">{product.name}</p>
                <p className="text-sm">{product.productCategory.name}</p>
              </div>
              <p className="text-xl font-bold">₹{product.price}</p>
            </div>

            {/* Product Image (Square) */}
            <img
              src={product.mainImage}
              alt={product.name}
              className="w-full h-64 object-cover mb-4 rounded-md"
            />
          </div>
        ))}
      </div>

      {/* Modal for Product Details */}
      {isModalOpen && selectedProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-primaryBlack p-6 rounded-lg w-full sm:w-2/3 lg:w-1/2"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
            style={{
              maxHeight: '80vh', // Fixed height of the modal
              overflowY: 'auto', // Allow vertical scrolling when content exceeds height
            }}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-primaryYellow">{selectedProduct.name}</h2>
              <button
                onClick={closeModal}
                className="text-white text-lg font-bold bg-red-600 p-2 rounded-full hover:bg-red-700"
              >
                X
              </button>
            </div>

            {/* Product Image */}
            <img
              src={selectedProduct.mainImage}
              alt={selectedProduct.name}
              className="w-full h-64 object-cover mb-4 rounded-md"
            />

            {/* Product Description */}
            <div className="mb-4">
              <p><strong>Description:</strong> {selectedProduct.description}</p>
              <p><strong>Brand:</strong> {selectedProduct.Brand}</p>
              <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
              <p><strong>Available Count:</strong> {selectedProduct.availableCount}</p>
              <p><strong>Offer:</strong> {selectedProduct.offer}% Off</p>
            </div>

            {/* Slider Images */}
            {selectedProduct.sliderImages && selectedProduct.sliderImages.length > 0 && (
              <div className="mb-4 overflow-x-auto">
                <h3 className="text-xl font-semibold text-primaryYellow mb-2">Additional Images</h3>
                <div className="flex space-x-4">
                  {selectedProduct.sliderImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Slider Image ${index + 1}`}
                      className="w-32 h-32 object-cover rounded-md"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Video Section */}
            {selectedProduct.video && (
              <div className="mb-4 overflow-auto">
                <h3 className="text-xl font-semibold text-primaryYellow mb-2">Product Video</h3>
                <div className="w-full h-auto mb-4">
                  <iframe
                    width="100%"
                    height="315"
                    src={selectedProduct.video}
                    title="Product Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* Edit and Delete Buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleEdit(selectedProduct.id)}
                className="bg-primaryYellow text-primaryBlack py-2 px-4 rounded-md hover:bg-yellow-600 transition-all duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(selectedProduct.id)}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductComponent;
