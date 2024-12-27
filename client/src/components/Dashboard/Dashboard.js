import React, { useEffect } from "react";
import * as echarts from "echarts";

const Dashboard = () => {
  useEffect(() => {
    // Sales Trends Line Chart
    const salesChart = echarts.init(document.getElementById("sales-chart"));
    salesChart.setOption({
      title: {
        text: "Sales Trends",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Sales",
          type: "line",
          data: [300, 500, 700, 900, 1100, 1300],
        },
      ],
    });

    // Revenue Distribution Pie Chart
    const revenueChart = echarts.init(document.getElementById("revenue-chart"));
    revenueChart.setOption({
      title: {
        text: "Category-wise Revenue",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        bottom: "10%",
      },
      series: [
        {
          name: "Revenue",
          type: "pie",
          radius: "50%",
          data: [
            { value: 40, name: "Electronics" },
            { value: 30, name: "Clothing" },
            { value: 20, name: "Shoes" },
            { value: 10, name: "Accessories" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    });

    return () => {
      salesChart.dispose();
      revenueChart.dispose();
    };
  }, []);

  const metrics = [
    { label: "Total Revenue", value: "₹1,20,000" },
    { label: "Total Orders", value: "450" },
    { label: "Total Products", value: "320" },
    { label: "Pending Orders", value: "15" },
    { label: "Low Stock Alerts", value: "8" },
  ];

  const recentActivities = [
    { activity: "Added a new product: iPhone 14", time: "5 mins ago" },
    { activity: "Updated stock for 'Nike Shoes'", time: "30 mins ago" },
    { activity: "Order #12345 marked as shipped", time: "1 hour ago" },
  ];

  const navigationLinks = [
    { label: "Manage Products", href: "/manageproducts" },
    { label: "Orders", href: "/orders" },
    { label: "Booking History", href: "/bookinghistory" },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-center mb-6">Admin Dashboard</h1>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="p-6 bg-gradient-to-r from-blue-100 to-blue-50 text-black border-2 border-gray-300 rounded-lg shadow-md hover:shadow-xl"
          >
            <h2 className="text-lg font-semibold">{metric.label}</h2>
            <p className="text-3xl font-bold">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="p-6 bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-gray-300 rounded-lg shadow-md hover:shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-black">Sales Trends</h2>
          <div id="sales-chart" className="w-full h-64"></div>
        </div>
        <div className="p-6 bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-gray-300 rounded-lg shadow-md hover:shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-black">Category-wise Revenue</h2>
          <div id="revenue-chart" className="w-full h-64"></div>
        </div>
      </div>

      {/* Navigation and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation Section */}
        <div className="col-span-1 p-6 bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-gray-300 rounded-lg shadow-md hover:shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Navigation</h2>
          <ul className="space-y-4">
            {navigationLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="block text-blue-600 font-semibold hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Activities Section */}
        <div className="col-span-2 p-6 bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-gray-300 rounded-lg shadow-md hover:shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <ul className="space-y-4">
            {recentActivities.map((activity, index) => (
              <li key={index} className="text-black">
                <p>{activity.activity}</p>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
