import React from "react";
import LoginComponent from "../Login/LoginComponent";
import BrowseComponent from "../BrowseComponent/BrowseComponent";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomeComponent from "../Home/HomeComponent";
import ProductComponent from "../ProductComponent/ProductComponent";
import ProductDetailComponent from "../ProductDetailComponent/ProductDetailComponent";
import Footer from "../Footer/Footer";
import CheckoutForm from "../CheckoutForm/CheckoutForm";
import CartComponent from "../CartComponent/CartComponent";
import { CartProvider } from "../../context/CartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Thankyou from "../ThankYou/Thankyou";
import Dashboard from "../Dashboard/Dashboard";
import CategoryAndProductManagement from "../CategoryAndProductManagement/CategoryAndProductManagement";
import ProductListing from "../ProductListing/ProductListing";
import OrderDetails from "../OrderDetails/OrderDetails";
import UserProfile from "../UserProfile/UserProfile";
import AdminBookingHistory from "../AdminBookingHistory/AdminBookingHistory";

const BodyComponent = () => {
  const appRouter = createBrowserRouter([
    { path: "/login", element: <LoginComponent /> },
    { path: "/browse", element: <BrowseComponent /> },
    { path: "/", element: <HomeComponent /> },
    { path: "/products", element: <ProductComponent /> },
    { path: "/products/:id", element: <ProductDetailComponent /> },
    { path: "/cart", element: <CartComponent /> },
    { path: "/checkout", element: <CheckoutForm /> },
    { path: "/thankyou", element: <Thankyou /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/manageproducts", element: <CategoryAndProductManagement /> },
    { path: "/list", element: <ProductListing /> },
    { path: "/manage-product/:id", element: <CategoryAndProductManagement /> },
    { path: "/orderDetail", element: <OrderDetails /> },
    { path: "/user", element: <UserProfile /> },
    { path: "/bookinghistory", element: <AdminBookingHistory /> },
  ]);

  return (
    <div className="flex flex-col min-h-screen  bg-gradient-to-b from-gray-50 to-yellow-100">
      <CartProvider>
        <div className="flex-grow">
          <RouterProvider router={appRouter} />
          <ToastContainer />
        </div>
        <Footer />
      </CartProvider>
    </div>
  );
};

export default BodyComponent;
