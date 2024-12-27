import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const CheckoutForm = () => {
  const location = useLocation();
  const { checkoutItem } = location.state || {}; // Retrieve passed data
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    upiId: "",
  });

  const [activeAccordion, setActiveAccordion] = useState(1);

  const cartItems = checkoutItem?.items || [];
  const totalDiscountedPrice = checkoutItem?.discountedPrice || 0;
  const deliveryCharge = totalDiscountedPrice < 500 ? 40 : 0;
  const finalTotal = totalDiscountedPrice + deliveryCharge;

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/thankyou", {
      state: { formData, finalTotal },
    });
    console.log("Order placed:", { formData, cartItems, finalTotal });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6  rounded-md shadow-lg bg-gradient-to-b from-gray-50 to-blue-100">
      <h2 className="text-2xl font-semibold text-center mb-6">Checkout</h2>

      {/* Accordion - Delivery Address */}
      <div className="border-b border-gray-200">
        <div
          className="cursor-pointer p-4 flex justify-between items-center"
          onClick={() => toggleAccordion(1)}
        >
          <h3 className="text-lg font-semibold">Delivery Address</h3>
          <span>{activeAccordion === 1 ? "−" : "+"}</span>
        </div>
        {activeAccordion === 1 && (
          <div className="p-4 space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Name"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Email"
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Phone Number"
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Address"
            />
            <div className="flex gap-4">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
                placeholder="City"
              />
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Postal Code"
              />
            </div>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Country"
            />
          </div>
        )}
      </div>

      {/* Accordion - Order Summary */}
      <div className="border-b border-gray-200">
        <div
          className="cursor-pointer p-4 flex justify-between items-center"
          onClick={() => toggleAccordion(2)}
        >
          <h3 className="text-lg font-semibold">Order Summary</h3>
          <span>{activeAccordion === 2 ? "−" : "+"}</span>
        </div>
        {activeAccordion === 2 && (
          <div className="p-4 space-y-2">
            <ul>
              {cartItems.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between border-b pb-2 mb-2"
                >
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>₹{item.discountedPrice.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{totalDiscountedPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge:</span>
              <span>₹{deliveryCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold mt-2">
              <span>Total Amount:</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Accordion - Payment Options */}
      <div>
        <div
          className="cursor-pointer p-4 flex justify-between items-center"
          onClick={() => toggleAccordion(3)}
        >
          <h3 className="text-lg font-semibold">Payment Options</h3>
          <span>{activeAccordion === 3 ? "−" : "+"}</span>
        </div>
        {activeAccordion === 3 && (
          <div className="p-4 space-y-6">
            {/* Payment Method Selection */}
            <div>
              <h4 className="text-md font-semibold mb-2">
                Select Payment Method
              </h4>
              <div className="flex gap-4">
                <button
                  className={`w-full py-2 px-4 rounded-md border ${
                    formData.paymentMethod === "UPI"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: "UPI" })
                  }
                >
                  UPI
                </button>
                <button
                  className={`w-full py-2 px-4 rounded-md border ${
                    formData.paymentMethod === "Card"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: "Card" })
                  }
                >
                  Card Payment
                </button>
                <button
                  className={`w-full py-2 px-4 rounded-md border ${
                    formData.paymentMethod === "GooglePay"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: "GooglePay" })
                  }
                >
                  Google Pay
                </button>
              </div>
            </div>

            {/* UPI Section */}
            {formData.paymentMethod === "UPI" && (
              <div>
                <h4 className="text-md font-semibold mb-2">UPI Payment</h4>
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter UPI ID"
                />
              </div>
            )}

            {/* Card Payment Section */}
            {formData.paymentMethod === "Card" && (
              <div>
                <h4 className="text-md font-semibold mb-2">Card Payment</h4>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  placeholder="Card Number"
                />
                <div className="flex gap-4 mt-2">
                  <input
                    type="text"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleChange}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="MM/YY"
                  />
                  <input
                    type="text"
                    name="cardCvc"
                    value={formData.cardCvc}
                    onChange={handleChange}
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="CVC"
                  />
                </div>
              </div>
            )}

            {/* Google Pay Section */}
            {formData.paymentMethod === "GooglePay" && (
              <div>
                <h4 className="text-md font-semibold mb-2">Google Pay</h4>
                <p className="text-sm text-gray-600">
                  Google Pay will redirect you to complete the transaction
                  securely.
                </p>
                <button
                  className="w-full bg-blue-500 text-white py-2 mt-2 rounded-md"
                  onClick={() => alert("Proceeding to Google Pay...")}
                >
                  Pay with Google Pay
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-green-500 text-white text-lg py-3 rounded-md mt-6 hover:bg-green-600"
      >
        Place Order
      </button>
    </div>
  );
};

export default CheckoutForm;
