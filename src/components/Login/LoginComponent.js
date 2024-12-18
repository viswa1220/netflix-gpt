import React, { useState } from "react";
import HeaderComponent from "../Header/HeaderComponent";

const LoginComponent = () => {
  const [isSignInForm, setSignInForm] = useState(true);
  const toggleSignInForm = () => {
    setSignInForm(!isSignInForm);
  };
  return (
    <div>
      <HeaderComponent></HeaderComponent>
      <div className="absolute transform w-full h-full object-cover inset-0">
        <img
          src="black_background_gadget_frames.png"
          alt="backgroud-image"
          className="w-full h-full object-cover opacity-80"
        ></img>
      </div>
      <form className="p-12 bg-black absolute w-4/12 my-36  mx-auto right-0 left-0 text-white rounded-lg bg-opacity-80 shadow-lg">
        <h1 className="font-bold text-3xl py-4">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </h1>
        { !isSignInForm && <input
          type="text"
          placeholder="Full Name"
          className="p-4 my-4  w-full bg-gray-700  rounded-lg"
        ></input>}
         <input
          type="text"
          placeholder="Email Address"
          className="p-4 my-4  w-full bg-gray-700  rounded-lg"
        ></input>
        <input
          type="password"
          placeholder="Password"
          className="p-4 my-4  w-full bg-gray-700  rounded-lg"
        ></input>
      
        <button className="p-2 my-6 bg-red-700 w-full rounded-lg">
        {isSignInForm ? "Sign In" : "Sign Up"}
        </button>
        <p className="py-4 cursor-pointer" onClick={toggleSignInForm}>
        {isSignInForm ? "New to shop? Sign Up Now" : "Already user ?, sign In Now"}
          
        </p>
      </form>
    </div>
  );
};

export default LoginComponent;
