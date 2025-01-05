import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import TrendingProductsSection from "../TrendingProductsSection/TrendingProductsSection";

const CartComponent = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate(-1);
  };

  const totalOriginalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalDiscountedPrice = cartItems.reduce((total, item) => {
    const discountPercentage = item.offer
      ? parseInt(item.offer.replace("% OFF", ""), 10)
      : 0;
    const discountedPrice =
      item.price - (item.price * discountPercentage) / 100;
    return total + discountedPrice * item.quantity;
  }, 0);

  const totalSavings = totalOriginalPrice - totalDiscountedPrice;
  const discountPercentage =
    totalSavings > 0
      ? ((totalSavings / totalOriginalPrice) * 100).toFixed(2)
      : 0;

  const deliveryCharge = totalDiscountedPrice < 500 ? 40 : 0;

  const handlePlaceOrder = () => {
    const checkoutItem = {
      discountedPrice: totalDiscountedPrice,
      items: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        deliveryCharge: deliveryCharge,
        discountedPrice:
          item.price -
          (item.price *
            (item.offer ? parseInt(item.offer.replace("% OFF", ""), 10) : 0)) /
            100,
      })),
    };

    navigate("/checkout", { state: { checkoutItem } });
  };

  return (
    <div className="cart p-4">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        {cartItems.length === 0 ? (
          <div className="p-4 text-center w-full">
            <h1 className="text-2xl font-bold">Your Cart is Empty</h1>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleContinueShopping}
            >
              Back to Products
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="w-full lg:w-3/5">
              <h1 className="text-2xl font-bold mb-4 text-center text-red-600">
                Your Cart List
              </h1>
              <div
                className={`${
                  cartItems.length > 4
                    ? "overflow-y-auto max-h-[500px]"
                    : ""
                } space-y-4`}
              >
                {cartItems.map((item, index) => {
                  const discountPercentage = item.offer
                    ? parseInt(item.offer.replace("% OFF", ""), 10)
                    : 0;
                  const discountedPrice =
                    item.price - (item.price * discountPercentage) / 100;

                  return (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row items-start gap-4 border p-4 rounded-md shadow-sm bg-gradient-to-r from-purple-50 to-purple-100"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full md:w-40 md:h-40 object-cover rounded-md"
                        />
                      )}
                      <div className="flex-grow">
                        <h2 className="text-xl font-bold text-black-900 my-2">
                          {item.name}
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {item.color && (
                            <span className="bg-green-100 text-green-700 font-bold text-xs px-2 py-1 rounded-sm shadow-sm">
                              Color: {item.color}
                            </span>
                          )}
                          {item.size && (
                            <span className="bg-green-100 text-green-700 font-bold text-xs px-2 py-1 rounded-md shadow-sm">
                              Size: {item.size}
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-lg font-bold">
                          ₹{discountedPrice.toFixed(2)}{" "}
                          <span className="text-sm text-gray-500 line-through">
                            ₹{item.price.toFixed(2)}
                          </span>{" "}
                          {item.offer && (
                            <span className="text-sm text-green-500">
                              {item.offer}
                            </span>
                          )}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <button
                            onClick={() => updateQuantity(item, -1)}
                            className="w-8 h-8 bg-gray-200 text-center rounded-md font-semibold"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="text-lg font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item, 1)}
                            className="w-8 h-8 bg-gray-200 text-center rounded-md font-semibold"
                            disabled={item.quantity >= item.availableCount}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item)}
                        className="text-red-500 font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price Summary */}
            <div className="w-full lg:w-2/5">
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-md shadow-sm">
                <h2 className="text-xl font-bold mb-4">Price Details</h2>
                <div className="flex justify-between mb-2">
                  <span>
                    Original Price ({cartItems.length} item
                    {cartItems.length > 1 ? "s" : ""})
                  </span>
                  <span>₹{totalOriginalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Discount</span>
                  <span className="text-green-500">
                    -₹{totalSavings.toFixed(2)} ({discountPercentage}% Off)
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Delivery Charges</span>
                  <span
                    className={`text-${
                      deliveryCharge === 0 ? "green" : "red"
                    }-500`}
                  >
                    {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span>
                    ₹{(totalDiscountedPrice + deliveryCharge).toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-green-500 mt-2">
                  You will save ₹{totalSavings.toFixed(2)} on this order
                </p>
                <button
                  className="w-full bg-orange-500 text-white py-2 mt-4 rounded-md"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </button>
              </div>
              <div className="mt-6">
                <TrendingProductsSection />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartComponent;
