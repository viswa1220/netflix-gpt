import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Thankyou = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve data passed from the Checkout Form
  const { formData, finalTotal } = location.state || {};

  return (
    <div className="flex-grow flex justify-center items-center">
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-md shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Thank You!</h1>
        <p className="text-lg text-gray-700 mb-6">
          Your order has been successfully placed.
        </p>
        
        {/* Display delivery address */}
        {formData && (
          <div className="text-left border rounded-md p-4 bg-blue-50 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Delivery Address
            </h2>
            <p className="text-gray-600"><strong>Name:</strong> {formData.name}</p>
            <p className="text-gray-600"><strong>Email:</strong> {formData.email}</p>
            <p className="text-gray-600"><strong>Phone:</strong> {formData.phone}</p>
            <p className="text-gray-600"><strong>Address:</strong> {formData.address}</p>
            <p className="text-gray-600"><strong>City:</strong> {formData.city}</p>
            <p className="text-gray-600"><strong>Postal Code:</strong> {formData.postalCode}</p>
            <p className="text-gray-600"><strong>Country:</strong> {formData.country}</p>
          </div>
        )}

        {/* Order Total */}
        {finalTotal && (
          <p className="text-lg font-bold text-gray-800 mb-6">
            Total Amount Paid: ₹{finalTotal.toFixed(2)}
          </p>
        )}

        {/* Back to Products Button */}
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          onClick={() => navigate("/products")}
        >
          Back to Products
        </button>
      </div>
    </div>
  );
};

export default Thankyou;
