import React, { useEffect, useState } from "react";
import { graphQLCommand } from "../../util";

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState("Pending");
  const [orderStatusCounts, setOrderStatusCounts] = useState({ pending: 0, completed: 0 });
  const [expandedOrder, setExpandedOrder] = useState(null); // which order is expanded

  // Fetch all orders and status counts
  useEffect(() => {
    const fetchOrdersAndRevenue = async () => {
      const ordersQuery = `
        query GetAllOrders {
          getAllOrders {
            id
            userDetails {
              fullName
              email
            }
            address
            cart {
              productId
              name
              price
              quantity
              size
              offer
              image
              categoryName
            }
            paymentDetails {
              method
              upiId
            }
            totalAmount
            status
          }
        }
      `;

      const orderStatusQuery = `
        query {
          totalOrdersByStatus {
            pending
            completed
          }
        }
      `;

      try {
        const [ordersResponse, orderStatusData] = await Promise.all([
          graphQLCommand(ordersQuery),
          graphQLCommand(orderStatusQuery),
        ]);

        const fetchedOrders = ordersResponse.getAllOrders || [];
        setOrders(fetchedOrders);

        // Start with Pending orders
        filterOrders("Pending", fetchedOrders);

        // Set status counts
        setOrderStatusCounts(orderStatusData.totalOrdersByStatus);
      } catch (error) {
        console.error("Error fetching orders:", error.message);
      }
    };

    fetchOrdersAndRevenue();
  }, []);

  // Filter orders by status
  const filterOrders = (status, allOrders) => {
    const filtered = allOrders.filter((order) => order.status === status);
    setFilteredOrders(filtered);
    setOrderStatus(status);
  };

  // Search by customer name
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filtered = orders.filter((order) =>
      order.userDetails.fullName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  // Toggle expanded order (accordion)
  const toggleAccordion = (orderId) => {
    setExpandedOrder((prevOrder) => (prevOrder === orderId ? null : orderId));
  };

  // Calculate total discount in an order
  const calculateDiscount = (cart) => {
    return cart.reduce((totalDiscount, item) => {
      const itemDiscount = (item.price * (item.offer / 100)) * item.quantity;
      return totalDiscount + itemDiscount;
    }, 0);
  };

  // Mark an order as completed
  const completeOrder = async (orderId) => {
    const completeOrderMutation = `
      mutation CompleteOrder($orderId: ID!) {
        completeOrder(orderId: $orderId) {
          success
          message
        }
      }
    `;

    try {
      const response = await graphQLCommand(completeOrderMutation, { orderId });
      if (response.completeOrder.success) {
        // Update status in local state
        const updatedOrders = orders.map((order) =>
          order.id === orderId ? { ...order, status: "Completed" } : order
        );
        setOrders(updatedOrders);

        // Re-filter to show completed orders
        filterOrders("Completed", updatedOrders);

        // Update counts
        setOrderStatusCounts((prevCounts) => ({
          pending: prevCounts.pending - 1,
          completed: prevCounts.completed + 1,
        }));

        alert("Order marked as completed");
      } else {
        alert("Failed to complete order");
      }
    } catch (error) {
      console.error("Error completing order:", error);
      alert("Error completing order");
    }
  };

  return (
    <div className="flex flex-col  bg-white">
      {/* Top Bar */}
      <div className="w-full bg-primaryBlack text-white p-4 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        {/* Order Status Buttons */}
        <div className="flex flex-row gap-4">
          <button
            className={`
              px-4 py-2 rounded-md
              hover:bg-gray-700 transition-all duration-200
              ${orderStatus === "Pending" ? "bg-primaryYellow text-primaryBlack" : ""}
            `}
            onClick={() => filterOrders("Pending", orders)}
          >
            Pending
            <span className="text-primaryYellow bg-primaryBlack ml-2 px-2 py-1 rounded-lg">
              {orderStatusCounts.pending}
            </span>
          </button>
          <button
            className={`
              px-4 py-2 rounded-md
              hover:bg-gray-700 transition-all duration-200
              ${orderStatus === "Completed" ? "bg-primaryYellow text-primaryBlack" : ""}
            `}
            onClick={() => filterOrders("Completed", orders)}
          >
            Completed
            <span className="text-primaryYellow bg-primaryBlack ml-2 px-2 py-1 rounded-lg">
              {orderStatusCounts.completed}
            </span>
          </button>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-primaryYellow md:ml-10">
          Order Details
        </h2>

        {/* Search Field */}
        <div className="flex-grow md:flex-grow-0 md:ml-auto">
          <input
            type="text"
            placeholder="Search by customer name..."
            value={searchQuery}
            onChange={handleSearch}
            className="
              w-full md:w-64 p-2 md:p-3 rounded-md
              bg-primaryBlack text-primaryYellow
              border border-primaryYellow
              focus:outline-none
            "
          />
        </div>
      </div>

      {/* Orders Container */}
      <div className="w-full px-4 md:px-8 py-8">
        {/* Orders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="
                  bg-primaryBlack p-6 rounded-lg shadow-xl
                  hover:shadow-2xl transition-all duration-300
                  text-white flex flex-col
                "
              >
                {/* Basic Info */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-lg font-semibold">
                      {order.userDetails.fullName}
                    </p>
                    <p className="text-sm">{order.userDetails.email}</p>
                  </div>
                  <p
                    className={`
                      text-sm font-semibold
                      ${order.status === "Pending" ? "text-yellow-400" : "text-green-400"}
                    `}
                  >
                    {order.status}
                  </p>
                </div>

                {/* Amount & Discount */}
                <p className="text-lg font-semibold mb-2">
                  ₹{order.totalAmount.toFixed(2)}
                </p>
                <p className="text-sm font-semibold text-gray-400 mb-2">
                  Discount: ₹{calculateDiscount(order.cart).toFixed(2)}
                </p>

                {/* Complete Button for Pending Orders */}
                {order.status === "Pending" && (
                  <button
                    onClick={() => completeOrder(order.id)}
                    className="
                      w-full bg-primaryYellow text-primaryBlack py-2 rounded-md
                      hover:bg-yellow-600 transition-all duration-200 mb-2
                    "
                  >
                    Complete Order
                  </button>
                )}

                {/* Expand/Collapse Products & Address */}
                <button
                  onClick={() => toggleAccordion(order.id)}
                  className="
                    w-full bg-primaryYellow text-primaryBlack py-2 rounded-md
                    hover:bg-yellow-600 transition-all duration-200
                  "
                >
                  {expandedOrder === order.id ? "Hide Details" : "View Details"}
                </button>

                {/* Accordion Content */}
                {expandedOrder === order.id && (
                  <div className="mt-4 space-y-4">
                    {/* Address Section */}
                    <div className="bg-white text-primaryBlack p-3 rounded-md shadow">
                      <p className="font-semibold mb-1">Delivery Address</p>
                      <p className="text-sm">{order.address}</p>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-white text-primaryBlack p-3 rounded-md shadow">
                      <p className="font-semibold mb-1">Payment Method</p>
                      <p className="text-sm">{order.paymentDetails.method}</p>
                      {order.paymentDetails.upiId && (
                        <p className="text-sm">UPI ID: {order.paymentDetails.upiId}</p>
                      )}
                    </div>

                    {/* Cart Items */}
                    <div className="space-y-2">
                      <p className="font-semibold text-white">Products:</p>
                      {order.cart.length > 0 ? (
                        order.cart.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-white text-primaryBlack rounded-md p-2 shadow"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-md object-cover"
                            />
                            <div className="flex-1 ml-3">
                              <p className="font-semibold">{item.name}</p>
                              <p className="text-sm">Qty: {item.quantity}</p>
                              <p className="text-sm">{item.categoryName}</p>
                            </div>
                            <p className="font-bold">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500">
                          No products found in cart
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 col-span-3">
              No orders found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
