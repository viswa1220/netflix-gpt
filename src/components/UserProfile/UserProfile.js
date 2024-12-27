import React, { useState } from "react";

const UserProfile = () => {
  const user = {
    userId: "USER123",
    name: "John Doe",
    email: "johndoe@example.com",
    address: "123 Main Street, Cityville, State, 12345",
  };

  const [bookings, setBookings] = useState([
    {
      bookingId: "BOOK123",
      bookingDate: "2024-12-20",
      status: "Confirmed",
      amount: 450.0,
    },
    {
      bookingId: "BOOK124",
      bookingDate: "2024-12-22",
      status: "Delivered",
      amount: 120.0,
    },
    {
      bookingId: "BOOK125",
      bookingDate: "2024-12-25",
      status: "Cancelled",
      amount: 320.0,
    },
  ]);

  const cancelBooking = (bookingId) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.bookingId === bookingId
          ? { ...booking, status: "Cancelled" }
          : booking
      )
    );
  };

  const ongoingOrders = bookings.filter(
    (booking) => booking.status === "Confirmed"
  );

  const bookingHistory = bookings.filter(
    (booking) => booking.status !== "Confirmed"
  );

  const getStatusClass = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-yellow-200 text-yellow-800";
      case "Delivered":
        return "bg-green-200 text-green-800";
      case "Cancelled":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* User Details */}
      <div
        className="p-6 bg-gradient-to-r from-blue-100 to-blue-50  rounded-lg 
          shadow-md  text-black"
      >
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
        <p>
          <strong>UserID:</strong> {user.userId}
        </p>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Address:</strong> {user.address}
        </p>
      </div>

      {/* Ongoing Orders */}
      <div
        className="p-6 bg-gradient-to-r from-blue-100 to-blue-50
          border border-gray-300 
          rounded-lg 
          shadow-md  text-black"
      >
        <h2 className="text-2xl font-bold mb-4">Ongoing Orders</h2>
        {ongoingOrders.length === 0 ? (
          <p className="text-gray-200">No ongoing orders.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead className="bg-blue-300 text-blue-900">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">
                    Booking ID
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Booking Date
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Amount</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ongoingOrders.map((order) => (
                  <tr key={order.bookingId} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">
                      {order.bookingId}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {order.bookingDate}
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-2 rounded ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      ₹{order.amount.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => cancelBooking(order.bookingId)}
                        className="bg-red-500 text-black px-4 py-2 rounded hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking History */}
      <div
        className="p-6 bg-gradient-to-r from-blue-100 to-blue-50
          border border-gray-300 
          rounded-lg 
          shadow-md  text-black"
      >
        <h2 className="text-2xl font-bold mb-4">Booking History</h2>
        {bookingHistory.length === 0 ? (
          <p className="text-gray-200">No booking history.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead className="bg-blue-300 text-blue-900">
                <tr>
                  <th className="border border-gray-300 px-4 py-2">
                    Booking ID
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Booking Date
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {bookingHistory.map((booking) => (
                  <tr key={booking.bookingId} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">
                      {booking.bookingId}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {booking.bookingDate}
                    </td>
                    <td
                      className={`border border-gray-300 px-4 py-2 rounded ${getStatusClass(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      ₹{booking.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
