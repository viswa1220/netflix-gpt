import React, { useEffect, useState } from "react";
import { graphQLCommand } from "../../util";

const OrderDetails = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState("Pending");
  const [orderStatusCounts, setOrderStatusCounts] = useState({ pending: 0, completed: 0 });
  const [expandedOrder, setExpandedOrder] = useState(null); // To track expanded orders

  // Fetch all orders and revenue
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
              name
              price
              quantity
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

        setOrders(ordersResponse.getAllOrders || []);
        setLoading(false);
        filterOrders("Pending", ordersResponse.getAllOrders);
        setOrderStatusCounts(orderStatusData.totalOrdersByStatus);
      } catch (error) {
        console.error("Error fetching orders and revenue:", error.message);
        setLoading(false);
      }
    };

    fetchOrdersAndRevenue();
  }, []);

  // Filter orders based on selected status
  const filterOrders = (status, allOrders) => {
    const filtered = allOrders.filter((order) => order.status === status);
    setFilteredOrders(filtered);
    setOrderStatus(status);
  };

  // Handle search functionality
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Toggle expanded order
  const toggleAccordion = (orderId) => {
    setExpandedOrder((prevOrder) => (prevOrder === orderId ? null : orderId));
  };

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
        // Update the order status in the state
        const updatedOrders = orders.map((order) =>
          order.id === orderId ? { ...order, status: "Completed" } : order
        );
        setOrders(updatedOrders);

        // Update the filtered orders to show in the completed section
        filterOrders("Completed", updatedOrders);

        // Update the counts
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
    <div className="flex bg-white">
    {/* Sidebar for Order Status */}
    <div className="w-64 bg-primaryBlack text-white p-6 sticky top-0 left-0 h-screen">
      <h3 className="text-xl font-semibold text-primaryYellow mb-6">Order Status</h3>
      <div className="flex flex-col space-y-4">
        <button
          className={`p-3 rounded-md hover:bg-gray-700 transition-all duration-200 ${orderStatus === "Pending" ? "bg-primaryYellow text-primaryBlack" : ""}`}
          onClick={() => filterOrders("Pending", orders)}
        >
          Pending <span className="text-primaryYellow bg-primaryBlack ml-3 p-1 rounded-lg shadow-xl">({orderStatusCounts.pending})</span>
        </button>
        <button
          className={`p-3 rounded-md hover:bg-gray-700 transition-all duration-200 ${orderStatus === "Completed" ? "bg-primaryYellow text-primaryBlack" : ""}`}
          onClick={() => filterOrders("Completed", orders)}
        >
          Completed <span className="text-primaryYellow bg-primaryBlack ml-3 p-1 rounded-lg shadow-xl">({orderStatusCounts.completed})</span>
        </button>
      </div>
    </div>
  
    {/* Main content */}
    <div className="w-full p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-primaryYellow">Order Details</h2>
        <input
          type="text"
          placeholder="Search by customer name..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-96 p-3 rounded-md bg-primaryBlack text-primaryYellow border border-primaryYellow focus:outline-none"
        />
      </div>
  
      {/* Orders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-primaryBlack p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 text-white">
              {/* Order Summary */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-lg font-semibold">{order.userDetails.fullName}</p>
                  <p className="text-sm">{order.userDetails.email}</p>
                </div>
                <p className={`text-sm font-semibold ${order.status === "Pending" ? "text-yellow-400" : "text-green-400"}`}>
                  {order.status}
                </p>
              </div>
              <p className="text-lg font-semibold mb-2">₹{order.totalAmount.toFixed(2)}</p>
  
              {/* Buttons */}
              {order.status === "Pending" && (
                <button
                  onClick={() => completeOrder(order.id)}
                  className="w-full bg-primaryYellow text-primaryBlack py-2 rounded-md hover:bg-yellow-600 transition-all duration-200 mb-2"
                >
                  Complete Order
                </button>
              )}
              <button
                onClick={() => toggleAccordion(order.id)}
                className="w-full bg-primaryYellow text-primaryBlack py-2 rounded-md hover:bg-yellow-600 transition-all duration-200"
              >
                {expandedOrder === order.id ? "Hide Products" : "View Products"}
              </button>
  
              {/* Accordion Content */}
              {expandedOrder === order.id && (
                <div className="mt-4 space-y-2">
                  {order.cart.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-white text-primaryBlack rounded-md p-2 shadow">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div className="flex-1 ml-3">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 col-span-3">No orders found</div>
        )}
      </div>
    </div>
  </div>
  
  );
};

export default OrderDetails;
