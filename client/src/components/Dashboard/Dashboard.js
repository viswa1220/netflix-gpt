import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { graphQLCommand } from "../../util";
import OrderDetails from "../OrderDetails/OrderDetails";
// Import the ECharts React wrapper
import ReactECharts from "echarts-for-react";

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

  // -----------------------
  // ECharts Bar Chart Setup
  // -----------------------
  // Convert categoryRevenue object to arrays
  const categories = Object.keys(categoryRevenue);
  const revenueData = categories.map((cat) => categoryRevenue[cat]);

  // ECharts option config
  const chartOption = {
    backgroundColor: "#F0F0F0", // Light grey background
    title: {
      text: "Category Revenue",
      left: "center",
      textStyle: {
        color: "#000", // Black font color
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: 'shadow',
      },
      textStyle: {
        color: "#000", // Black font color for tooltips
      },
    },
    grid: {
      left: "5%",
      right: "5%",
      bottom: "15%", // More space for x-axis labels
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: categories,
      axisLabel: {
        color: "#000", // Black font color for X-axis labels
        rotate: 30, // Rotate labels for better readability
        interval: 0, // Show all labels
        formatter: (value) => {
          return value.length > 10 ? value.substring(0, 10) + "..." : value;
        },
      },
      axisLine: {
        lineStyle: {
          color: "#000", // Black X-axis line
        },
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#000", // Black font color for Y-axis labels
      },
      axisLine: {
        show: true, // Display Y-axis line
        lineStyle: {
          color: "#000", // Black Y-axis line
        },
      },
      splitLine: {
        show: false, // No horizontal gridlines
      },
    },
    series: [
      {
        name: "Revenue",
        data: revenueData,
        type: "bar",
        itemStyle: {
          color: "#252F3B", // PrimaryBlack for bars
        },
        barWidth: '40%', // Slimmer bars
      },
    ],
  };
  
  

  return (
    <div className="min-h-screen  text-white p-4 sm:p-6">
      {/* Header / Title */}
      <h1 className="text-3xl font-bold text-center mb-6">
        <span className="bg-primaryBlack p-4 rounded-lg shadow-lg">Admin Dashboard</span>
      </h1>

      {/* Navigation Bar */}
      <div className="flex flex-wrap justify-center space-x-4 mb-6">
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
        <Link to="/AdminProduct">
          <button className="p-3 bg-primaryBlack text-primaryYellow rounded-lg hover:shadow-xl">
            Edit Product
          </button>
        </Link>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {Object.keys(categoryRevenue).length > 0 ? (
          Object.keys(categoryRevenue).map((category) => (
            <div key={category} className="p-6 text-primaryYellow bg-primaryBlack rounded-lg shadow-lg hover:shadow-xl">
              <h2 className="text-lg font-semibold">{category} Revenue</h2>
              <p className="text-3xl font-bold">₹{categoryRevenue[category].toFixed(2)}</p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 col-span-3">No category-based revenue data available</div>
        )}
      </div>
        {/* ECharts Bar Chart BELOW Order Details */}
        {categories.length > 0 && (
        <div className="mt-6 mb-6 w-full h-64 sm:h-72 md:h-80 lg:h-96">
          <ReactECharts
            option={chartOption}
            style={{ width: "100%", height: "100%" }}
            className="rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Order Details Section */}
      <OrderDetails />

    

     
    </div>
  );
};

export default Dashboard;
