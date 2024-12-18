import React, { useState, useRef } from "react";
import HeaderComponent from "../Header/HeaderComponent";
import { checkValidData } from "../../util/validate";

const LoginComponent = () => {
  const [isSignInForm, setSignInForm] = useState(true);
  const email = useRef(null);
  const password = useRef(null);
  const [errorMsg, seterrorMsg] = useState();
  const toggleSignInForm = () => {
    setSignInForm(!isSignInForm);
  };
  const HandleButtonClick = () => {
    //validation of form data
    const message = checkValidData(
      email.current.value,
      password.current.value
    );
    seterrorMsg(message);
    console.log(email.current.value, password.current.value);
  };
  return (
    <div>
      <HeaderComponent></HeaderComponent>
      <div className="absolute transform w-full h-full object-cover inset-0">
        <img
          src="black_background_gadget_frames.png"
          alt="backgroud-image"
          className="w-full h-full object-cover "
        ></img>
      </div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="p-12 bg-black absolute w-4/12 my-36  mx-auto right-0 left-0 text-white rounded-lg bg-opacity-80 shadow-lg"
      >
        <h1 className="font-bold text-3xl py-4">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </h1>
        {!isSignInForm && (
          <input
            type="text"
            placeholder="Full Name"
            className="p-4 my-4  w-full bg-gray-700  rounded-lg"
          ></input>
        )}
        <input
          ref={email}
          type="text"
          placeholder="Email Address"
          className="p-4 my-4  w-full bg-gray-700  rounded-lg"
        ></input>
        <input
          ref={password}
          type="password"
          placeholder="Password"
          className="p-4 my-4  w-full bg-gray-700  rounded-lg"
        ></input>
        <p className="text-red-500 py-2 text-bold">{errorMsg}</p>
        <button
          className="p-2 my-4 bg-red-700 w-full rounded-lg"
          onClick={HandleButtonClick}
        >
          {isSignInForm ? "Sign In" : "Sign Up"}
        </button>
        <p className="py-2 cursor-pointer" onClick={toggleSignInForm}>
          {isSignInForm
            ? "New to shop? Sign Up Now"
            : "Already user ?, sign In Now"}
        </p>
      </form>
    </div>
  );
};

export default LoginComponent;
