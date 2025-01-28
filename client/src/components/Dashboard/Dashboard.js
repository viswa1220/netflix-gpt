import React, { useEffect, useState } from "react";
import { graphQLCommand } from "../../util";
import { Link } from "react-router-dom";  // Importing Link for navigation
import OrderDetails from "../OrderDetails/OrderDetails";

const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [orderStatusCounts, setOrderStatusCounts] = useState({ pending: 0, completed: 0 });
  const [categoryRevenue, setCategoryRevenue] = useState({}); // To store revenue based on category

  // Function to calculate total revenue from completed orders, including offers
  const calculateTotalRevenue = (orders) => {
    let totalRev = 0;
    orders.forEach((order) => {
      // Apply offer discount if available for the entire order
      const discount = order.offer ? (order.totalAmount * (order.offer / 100)) : 0;
      const finalAmount = order.totalAmount - discount;
      totalRev += finalAmount; // Add the final amount after applying the discount
    });
    return totalRev;
  };

  // Function to calculate revenue per category from completed orders
  const calculateRevenueByCategory = (orders) => {
    let categoryRevenueMap = {};

    orders.forEach((order) => {
      order.cart.forEach((item) => {
        // Apply offer discount if available for the item
        const discount = item.offer ? (item.price * item.quantity * (item.offer / 100)) : 0;
        const finalRevenue = item.price * item.quantity - discount;

        // Add to the revenue of the respective category
        if (categoryRevenueMap[item.categoryName]) {
          categoryRevenueMap[item.categoryName] += finalRevenue;
        } else {
          categoryRevenueMap[item.categoryName] = finalRevenue;
        }
      });
    });

    return categoryRevenueMap;
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      const productQuery = `
        query {
          totalProducts
        }
      `;
      const revenueQuery = `
        query {
          totalRevenue
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
              offer
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
  
      try {
        const [
          productData,
          ,
          orderStatusData,
          ordersData
        ] = await Promise.all([
          graphQLCommand(productQuery),
          graphQLCommand(revenueQuery),
          graphQLCommand(orderStatusQuery),
          graphQLCommand(ordersQuery),
        ]);
  
        setTotalProducts(productData.totalProducts);
 
        // Filter completed orders
        const completedOrders = ordersData.getAllOrders.filter(order => order.status === "Completed");
  
        // Calculate total revenue from completed orders
        setTotalRevenue(calculateTotalRevenue(completedOrders)); 
        setOrderStatusCounts(orderStatusData.totalOrdersByStatus);
        setTotalOrders(
          orderStatusData.totalOrdersByStatus.pending + orderStatusData.totalOrdersByStatus.completed
        );
  
        // Calculate category-based revenue for completed orders and set the state
        const calculatedCategoryRevenue = calculateRevenueByCategory(completedOrders);
        setCategoryRevenue(calculatedCategoryRevenue);
  
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };
  
    fetchMetrics(); // Fetch all data when the component is mounted
  }, []);
  
  return (
    <div className="min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        <span className="bg-primaryBlack p-4 rounded-lg shadow-lg">Admin Dashboard</span>
      </h1>

      {/* Sidebar Navigation */}
      <div className="flex space-x-8 mb-8">
        <Link to="/orderDetail">
          <button className="p-3 bg-primaryBlack text-primaryYellow rounded-lg hover:shadow-xl">
            Order Details
          </button>
        </Link>
        <Link to="/manageProducts">
          <button className="p-3 bg-primaryBlack text-primaryYellow rounded-lg hover:shadow-xl">
            Manage Products
          </button>
        </Link>
        <Link to="/edit-product">
          <button className="p-3 bg-primaryBlack text-primaryYellow rounded-lg hover:shadow-xl">
            Edit Product
          </button>
        </Link>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <div className="p-6 text-primaryYellow bg-primaryBlack rounded-lg shadow-lg hover:shadow-xl">
          <h2 className="text-lg font-semibold">Total Products</h2>
          <p className="text-3xl font-bold">{totalProducts}</p>
        </div>
        <div className="p-6 text-primaryYellow bg-primaryBlack rounded-lg shadow-lg hover:shadow-xl">
          <h2 className="text-lg font-semibold">Total Orders</h2>
          <p className="text-3xl font-bold">{totalOrders}</p>
        </div>
        <div className="p-6 text-primaryYellow bg-primaryBlack rounded-lg shadow-lg hover:shadow-xl">
          <h2 className="text-lg font-semibold">Total Revenue</h2>
          <p className="text-3xl font-bold">₹{totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Category-based Revenue Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {Object.keys(categoryRevenue).length > 0 ? (
          Object.keys(categoryRevenue).map((category) => (
            <div key={category} className="p-6 text-primaryYellow bg-primaryBlack rounded-lg shadow-lg hover:shadow-xl">
              <h2 className="text-lg font-semibold">{category} Revenue</h2>
              <p className="text-3xl font-bold">₹{categoryRevenue[category].toFixed(2)}</p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No category-based revenue data available</div>
        )}
      </div>

      {/* Order Details Section */}
      <OrderDetails />
    </div>
  );
};

export default Dashboard;
