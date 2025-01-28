import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { graphQLCommand } from "../../util";

const CartComponent = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch cart items
  const fetchCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      // Guest cart
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      setCartItems(guestCart);
      setLoading(false);
      return;
    }

    const query = `
      query GetCart($userId: ID!) {
        getCart(userId: $userId) {
          id
          productId
          name
          price
          offer
          quantity
          size
          image
          categoryName
        }
      }
    `;

    try {
      const response = await graphQLCommand(query, { userId });
      setCartItems(response.getCart || []);
    } catch (error) {
      console.error("Failed to fetch cart items:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (item, delta) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      // Guest cart handling
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const updatedCart = guestCart.map((i) =>
        i.productId === item.productId
          ? { ...i, quantity: Math.max(1, i.quantity + delta) }
          : i
      );
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      setCartItems(updatedCart);
    } else {
      // Authenticated user: update backend
      const mutation = `
        mutation UpdateCartItem($userId: ID!, $itemId: ID!, $quantity: Int!) {
          updateCartItem(userId: $userId, itemId: $itemId, quantity: $quantity) {
            id
            quantity
          }
        }
      `;
      try {
        const newQuantity = Math.max(1, item.quantity + delta);
        const response = await graphQLCommand(mutation, {
          userId,
          itemId: item.id,
          quantity: newQuantity,
        });

        // Update local cart state
        setCartItems((prevItems) =>
          prevItems.map((i) =>
            i.id === response.updateCartItem.id
              ? { ...i, quantity: response.updateCartItem.quantity }
              : i
          )
        );
      } catch (error) {
        console.error("Failed to update cart item quantity:", error.message);
      }
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      // Guest cart handling
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const updatedCart = guestCart.filter((item) => item.productId !== itemId);
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      setCartItems(updatedCart);
    } else {
      // Authenticated user: update backend
      const mutation = `
        mutation RemoveFromCart($userId: ID!, $itemId: ID!) {
          removeFromCart(userId: $userId, itemId: $itemId)
        }
      `;
      try {
        await graphQLCommand(mutation, { userId, itemId });
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      } catch (error) {
        console.error("Failed to remove cart item:", error.message);
      }
    }
  };

  // Place order
  const handlePlaceOrder = () => {
    const totalDiscountedPrice = cartItems.reduce((total, item) => {
      const discountPercentage = item.offer || 0;
      const discountedPrice = item.price - (item.price * discountPercentage) / 100;
      return total + discountedPrice * item.quantity;
    }, 0);

    const deliveryCharge = totalDiscountedPrice < 500 ? 40 : 0;

    const checkoutItem = {
      discountedPrice: totalDiscountedPrice + deliveryCharge,
      items: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        deliveryCharge,
        discountedPrice:
          item.price - (item.price * (item.offer || 0)) / 100,
      })),
    };

    navigate("/checkout", { state: { checkoutItem } });
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
        <button
          className="bg-primaryYellow text-primaryBlack px-4 py-2 rounded-md mt-4"
          onClick={() => navigate("/products/All")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // Price calculations
  const totalOriginalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalDiscountedPrice = cartItems.reduce((total, item) => {
    const discountPercentage = item.offer || 0;
    const discountedPrice = item.price - (item.price * discountPercentage) / 100;
    return total + discountedPrice * item.quantity;
  }, 0);
  const totalSavings = totalOriginalPrice - totalDiscountedPrice;
  const deliveryCharge = totalDiscountedPrice < 500 ? 40 : 0;

  return (
    <div className="cart p-4 bg-white">
      {/* Top line: Cart title + Continue Shopping button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-primaryBlack">Your Cart</h1>
        <button
          className="bg-primaryYellow text-black py-2 px-6 rounded-md"
          onClick={() => navigate("/products/All")}
        >
          Continue Shopping
        </button>
      </div>

      {/* Cart items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="relative w-full h-60 rounded-lg overflow-hidden shadow-md group bg-gray-200 cursor-pointer"
            onClick={() =>
              navigate(`/products/${item.categoryName}/${item.productId}`)
            }
          >
            {/* Background Image */}
            <img
              src={item.image}
              alt={item.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-between p-4 opacity-100">
              {/* Top Section */}
              <div className="flex justify-between">
                <h3
                  className="text-white text-lg font-bold truncate"
                  title={item.name}
                >
                  {item.name}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromCart(item.id);
                  }}
                  className="bg-gray-200 text-red-500 hover:text-red-700 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                >
                  ✕
                </button>
              </div>

              {/* Middle Section: Price/Offer */}
              <div>
                <p className="text-yellow-400 text-md font-semibold">
                  ₹{item.price}
                </p>
                {item.offer && (
                  <span className="text-red-400 text-xs font-medium">
                    {item.offer}% OFF
                  </span>
                )}
              </div>

              {/* Bottom Section: Quantity Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(item, -1);
                    }}
                    disabled={item.quantity === 1}
                    className="bg-yellow-400 text-black px-2 py-1 rounded text-sm"
                  >
                    -
                  </button>
                  <span className="text-white">{item.quantity}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(item, 1);
                    }}
                    className="bg-yellow-400 text-black px-2 py-1 rounded text-sm"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-white font-semibold">
                  Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Price Details */}
      <div className="mt-8 p-6 rounded-md shadow-md bg-primaryBlack text-white">
        <h2 className="text-2xl font-bold mb-4 text-primaryYellow">
          Price Details
        </h2>
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
            -₹{totalSavings.toFixed(2)} (
            {((totalSavings / totalOriginalPrice) * 100).toFixed(2)}% Off)
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Delivery Charges</span>
          <span
            className={`text-${deliveryCharge === 0 ? "green" : "red"}-500`}
          >
            {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}
          </span>
        </div>
        <hr className="my-2 border-gray-500" />
        <div className="flex justify-between text-lg font-bold">
          <span>Total Amount</span>
          <span>₹{(totalDiscountedPrice + deliveryCharge).toFixed(2)}</span>
        </div>
        <p className="text-sm text-green-500 mt-2">
          You will save ₹{totalSavings.toFixed(2)} on this order
        </p>
        <button
          className="bg-primaryYellow text-black py-2 px-6 rounded-md mx-auto block mt-4"
          onClick={handlePlaceOrder}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CartComponent;
