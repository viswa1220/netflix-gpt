import React, { useState } from "react";

const OrderDetails = () => {
  const [orders, setOrders] = useState([
    {
      orderId: "ORD12345",
      customerName: "John Doe",
      orderDate: "2024-12-26",
      status: "Processing",
      totalAmount: 450.0,
      items: [
        { name: "Smartphone", quantity: 1, price: 300.0 },
        { name: "Headphones", quantity: 2, price: 75.0 },
      ],
    },
    {
      orderId: "ORD12346",
      customerName: "Jane Smith",
      orderDate: "2024-12-27",
      status: "Processing",
      totalAmount: 120.0,
      items: [
        { name: "Running Shoes", quantity: 1, price: 120.0 },
      ],
    },
  ]);

  const [activeOrder, setActiveOrder] = useState(null);

  const toggleAccordion = (orderId) => {
    setActiveOrder((prevOrder) => (prevOrder === orderId ? null : orderId));
  };

  const markOrderComplete = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId ? { ...order, status: "Completed" } : order
      )
    );
    setActiveOrder(null); // Optionally collapse the accordion after marking complete
  };

  return (
    <div className="p-6 bg-gray-100 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Order Details</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Order ID</th>
              <th className="border border-gray-300 px-4 py-2">Customer Name</th>
              <th className="border border-gray-300 px-4 py-2">Order Date</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Total Amount</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <>
                <tr key={order.orderId} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{order.orderId}</td>
                  <td className="border border-gray-300 px-4 py-2">{order.customerName}</td>
                  <td className="border border-gray-300 px-4 py-2">{order.orderDate}</td>
                  <td
                    className={`border border-gray-300 px-4 py-2 rounded ${
                      order.status === "Processing"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {order.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">₹{order.totalAmount.toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => toggleAccordion(order.orderId)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      {activeOrder === order.orderId ? "Hide Items" : "View Items"}
                    </button>
                  </td>
                </tr>

                {/* Accordion Row */}
                {activeOrder === order.orderId && (
                  <tr key={`${order.orderId}-details`} className="bg-gray-50">
                    <td colSpan="6" className="p-4">
                      <h3 className="text-md font-bold mb-2">Order Items:</h3>
                      <ul className="space-y-2">
                        {order.items.map((item, index) => (
                          <li
                            key={index}
                            className="flex justify-between border-b pb-2"
                          >
                            <span>{item.name}</span>
                            <span>Qty: {item.quantity}</span>
                            <span>₹{item.price.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 text-right">
                        {order.status === "Processing" && (
                          <button
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            onClick={() => markOrderComplete(order.orderId)}
                          >
                            Mark as Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetails;
