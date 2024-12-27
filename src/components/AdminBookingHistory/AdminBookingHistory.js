import React, { useState } from "react";

const AdminBookingHistory = () => {
  const [bookings] = useState([
    {
      bookingId: "BOOK123",
      userName: "John Doe",
      bookingDate: "2024-12-20",
      status: "Delivered",
      amount: 450.0,
    },
    {
      bookingId: "BOOK124",
      userName: "Jane Smith",
      bookingDate: "2024-12-22",
      status: "Cancelled",
      amount: 120.0,
    },
  ]);

  const completedBookings = bookings.filter(
    (booking) => booking.status === "Delivered"
  );

  return (
    <div className="p-6 bg-gray-100 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Admin Booking History
      </h1>
      {completedBookings.length === 0 ? (
        <p className="text-gray-600">No completed bookings.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Booking ID</th>
                <th className="border border-gray-300 px-4 py-2">User Name</th>
                <th className="border border-gray-300 px-4 py-2">Booking Date</th>
                <th className="border border-gray-300 px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {completedBookings.map((booking) => (
                <tr key={booking.bookingId} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    {booking.bookingId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {booking.userName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {booking.bookingDate}
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
  );
};

export default AdminBookingHistory;
