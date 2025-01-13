import React from "react";
import LoginComponent from "../Login/LoginComponent";
import BrowseComponent from "../BrowseComponent/BrowseComponent";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomeComponent from "../Home/HomeComponent";
import ProductPage from "../ProductComponent/ProductPage";
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
import AdminProductComponent from "../AdminProductComponent/AdminProductComponent";

const BodyComponent = () => {
  const appRouter = createBrowserRouter([
    { path: "/login", element: <LoginComponent /> },
    { path: "/browse", element: <BrowseComponent /> },
    { path: "/", element: <HomeComponent /> },
    { path: "/products/:categoryName", element: <ProductPage /> },
   
    
    {
      path: "/products/:categoryName/:id",
      element: <ProductDetailComponent />,
    },
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
    { path: "/AdminProduct", element: <AdminProductComponent /> },
  ]);

  return (
    <div className="flex flex-col min-h-screen font-rubik">
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
