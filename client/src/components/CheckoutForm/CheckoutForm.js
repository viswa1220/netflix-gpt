import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { graphQLCommand } from "../../util";

const CheckoutForm = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [cartItems, setCartItems] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [formData, setFormData] = useState({
    address: "",
    paymentMethod: "UPI",
    upiId: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCartAndUserDetails = async () => {
      if (!userId) {
        navigate("/login");
        return;
      }

      // Fetch Cart Items
      const cartQuery = `
        query GetCart($userId: ID!) {
          getCart(userId: $userId) {
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

      // Fetch User Details
      const userQuery = `
        query GetUserByUserId($userId: String!) {
          userByUserId(userId: $userId) {
            id
            fullName
            email
          }
        }
      `;

      try {
        const [cartResponse, userResponse] = await Promise.all([ 
          graphQLCommand(cartQuery, { userId }),
          graphQLCommand(userQuery, { userId }),
        ]);

        setCartItems(cartResponse.getCart || []);
        setUserDetails(userResponse.userByUserId);
      } catch (error) {
        console.error("Failed to fetch data:", error.message);
      }
    };

    fetchCartAndUserDetails();
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!cartItems.length) {
      setStatus({ type: "error", message: "Your cart is empty. Add items before placing an order." });
      return;
    }

    const errorMessage = validateForm();
    if (errorMessage) {
      setStatus({ type: "error", message: errorMessage });
      return;
    }

    setLoading(true);

    const createOrderMutation = `
      mutation CreateOrder($input: OrderInput!) {
        createOrder(input: $input) {
          id
          totalAmount
          userDetails {
            fullName
            email
          }
          cart {
            productId
            name
            price
            quantity
            size
            image
            categoryName
          }
        }
      }
    `;

    const totalAmount = Math.max(
      cartItems.reduce(
        (total, item) =>
          total + item.quantity * (item.price - (item.price * (item.offer || 0)) / 100),
        0
      ),
      0
    );

    const variables = {
      input: {
        userDetails: {
          userId,
          fullName: userDetails.fullName,
          email: userDetails.email,
        },
        address: formData.address.trim(),
        cart: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          offer: item.offer || 0,
          quantity: item.quantity,
          size: item.size || null,
          image: item.image || null,
          categoryName: item.categoryName || "Uncategorized",
        })),
        paymentDetails: {
          method: formData.paymentMethod,
          upiId: formData.paymentMethod === "UPI" ? formData.upiId.trim() : null,
          cardDetails:
            formData.paymentMethod === "Card"
              ? {
                  number: formData.cardNumber.trim(),
                  expiry: formData.cardExpiry.trim(),
                  cvc: formData.cardCvc.trim(),
                }
              : null,
        },
        totalAmount,
      },
    };

    try {
      const response = await graphQLCommand(createOrderMutation, variables);

      if (!response.createOrder) {
        throw new Error("Failed to create order.");
      }

      // Cart items deletion mutation after the order is successfully created
      const deleteCartMutation = `
        mutation DeleteCart($userId: String!) {
          deleteCart(userId: $userId) {
            success
            message
          }
        }
      `;

      // Call mutation to delete cart items
      await graphQLCommand(deleteCartMutation, { userId });

      // Clear cart items from the state
      setCartItems([]);
      
      setStatus({ type: "success", message: "Order placed successfully!" });
      navigate("/thankyou", {
        state: { orderId: response.createOrder.id, totalAmount },
      });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.address.trim()) {
      return "Please enter a delivery address.";
    }

    if (formData.paymentMethod === "UPI" && !formData.upiId.trim()) {
      return "Please enter a valid UPI ID.";
    }

    if (formData.paymentMethod === "Card") {
      if (!/^[0-9]{16}$/.test(formData.cardNumber.trim())) {
        return "Please enter a valid 16-digit card number.";
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.cardExpiry.trim())) {
        return "Please enter a valid card expiry date (MM/YY).";
      }
      if (!/^[0-9]{3}$/.test(formData.cardCvc.trim())) {
        return "Please enter a valid 3-digit CVC.";
      }
    }

    return null;
  };

  if (loading) return <div>Loading...</div>;

  if (!cartItems.length) {
    return (
      <div>
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate("/products")}>Shop Now</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-primaryBlack text-primaryYellow rounded-md shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Checkout</h2>

      {status && (
        <div
          className={`p-3 rounded-md mb-4 ${status.type === "success" ? "bg-green-500" : "bg-red-500"}`}
        >
          {status.message}
        </div>
      )}

      {/* User Details Section */}
      <div className="bg-gray-800 p-3 rounded-md mb-2 flex justify-between items-center">
        <h3 className="text-lg font-semibold">User Details</h3>
      </div>
      <div className="mb-6">
        {userDetails ? (
          <>
            <p>Name: {userDetails.fullName}</p>
            <p>Email: {userDetails.email}</p>
            <p>User Id: {userId}</p>
          </>
        ) : (
          <p>Loading user details...</p>
        )}
      </div>

      {/* Cart Items Section */}
      <div className="bg-gray-800 p-3 rounded-md mb-2 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Cart Items</h3>
      </div>
      <div className="mb-6">
        <ul>
          {cartItems.map((item) => (
            <li key={item.productId} className="flex justify-between border-b pb-2 mb-2">
              <span>{item.name} x{item.quantity}</span>
              <span>
                ₹
                {(
                  item.quantity *
                  (item.price - (item.price * (item.offer || 0)) / 100)
                ).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Address Section */}
      <div className="bg-gray-800 p-3 rounded-md mb-2 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Delivery Address</h3>
      </div>
      <textarea
        name="address"
        value={formData.address}
        onChange={handleChange}
        className="w-full p-3 bg-gray-100 rounded-md border"
        placeholder="Enter Delivery Address"
      />

      {/* Payment Options Section */}
      <div className="bg-gray-800 p-3 rounded-md mb-2 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Payment Options</h3>
      </div>
      <div className="mt-4">
        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          className="w-full p-3 bg-gray-100 rounded-md border"
        >
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
        </select>

        {formData.paymentMethod === "UPI" && (
          <input
            type="text"
            name="upiId"
            value={formData.upiId}
            onChange={handleChange}
            className="w-full p-3 bg-gray-100 rounded-md border mt-2"
            placeholder="Enter UPI ID"
          />
        )}

        {formData.paymentMethod === "Card" && (
          <div className="mt-2">
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              className="w-full p-3 bg-gray-100 rounded-md border mb-2"
              placeholder="Card Number"
            />
            <div className="flex gap-4">
              <input
                type="text"
                name="cardExpiry"
                value={formData.cardExpiry}
                onChange={handleChange}
                className="w-1/2 p-3 bg-gray-100 rounded-md border"
                placeholder="MM/YY"
              />
              <input
                type="text"
                name="cardCvc"
                value={formData.cardCvc}
                onChange={handleChange}
                className="w-1/2 p-3 bg-gray-100 rounded-md border"
                placeholder="CVC"
              />
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-primaryYellow text-primaryBlack text-lg py-3 rounded-md mt-6"
      >
        Place Order
      </button>
    </div>
  );
};

export default CheckoutForm;
