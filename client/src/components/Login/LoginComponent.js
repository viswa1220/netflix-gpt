import React, { useState, useRef } from "react";
import {
  FiSmartphone,
  FiTablet,
  FiMonitor,
  FiHeadphones,
  FiCamera,
  FiWatch,
} from "react-icons/fi"; // Import React Icons
import { graphQLCommand } from "../../util";
import { useNavigate } from "react-router-dom";


const LoginComponent = () => {
  const [isSignInForm, setSignInForm] = useState(true);
  const email = useRef(null);
  const password = useRef(null);
  const confirmPassword = useRef(null);
  const fullName = useRef(null);
  const userId = useRef(null);
  const address = useRef(null);
  const [errorMsg, setErrorMsg] = useState("");
const navigate=useNavigate();
  const toggleSignInForm = () => {
    setSignInForm(!isSignInForm);
    setErrorMsg(""); // Clear error messages when toggling forms
  };

  const handleButtonClick = async () => {
    if (isSignInForm) {
      // Handle Sign In
      try {
        const query = `
          mutation ($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              message
              user {
                id
                fullName
                email
              }
            }
          }
        `;
        const variables = { email: email.current.value, password: password.current.value };
        const response = await graphQLCommand(query, variables);

        alert(response.login.message);
        navigate("/")
        console.log("User Logged In:", response.login.user);
        
      } catch (error) {
        setErrorMsg(error.message);
      }
    } else {
      // Handle Sign Up
      if (password.current.value !== confirmPassword.current.value) {
        setErrorMsg("Passwords do not match.");
        return;
      }

      try {
        const query = `
          mutation ($fullName: String!, $userId: String!, $email: String!, $password: String!, $address: String) {
            signup(fullName: $fullName, userId: $userId, email: $email, password: $password, address: $address) {
              message
              user {
                id
                fullName
                email
              }
            }
          }
        `;

        const variables = {
          fullName: fullName.current.value,
          userId: userId.current.value,
          email: email.current.value,
          password: password.current.value,
          address: address.current.value,
        };

        const response = await graphQLCommand(query, variables);
        alert(response.signup.message);
      } catch (error) {
        setErrorMsg(error.message);
      }
    }
  };

  return (
    <div
      className="relative min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-50 to-yellow-100"
    >
      {/* Background Icons */}
      {[
        { Icon: FiSmartphone, color: "#FF5733", top: "10%", left: "15%" },
        { Icon: FiTablet, color: "#33FF57", top: "25%", left: "75%" },
        { Icon: FiMonitor, color: "#3357FF", top: "40%", left: "30%" },
        { Icon: FiHeadphones, color: "#FF33A1", top: "55%", left: "60%" },
        { Icon: FiCamera, color: "#FFC300", top: "70%", left: "20%" },
        { Icon: FiWatch, color: "#DAF7A6", top: "85%", left: "50%" },
        { Icon: FiSmartphone, color: "#900C3F", top: "15%", left: "45%" },
        { Icon: FiTablet, color: "#581845", top: "35%", left: "10%" },
        { Icon: FiMonitor, color: "#28B463", top: "50%", left: "80%" },
        { Icon: FiHeadphones, color: "#C70039", top: "65%", left: "70%" },
      ].map(({ Icon, color, top, left }, index) => (
        <Icon
          key={index}
          className="absolute"
          style={{
            color,
            fontSize: "clamp(2rem, 2.5vw, 4rem)", // Responsive font size
            top,
            left,
            opacity: 0.8,
          }}
        />
      ))}

      {/* Form */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="p-8 md:p-12 bg-gradient-to-r from-blue-50 to-blue-100 border border-gray-300 rounded-lg shadow-md hover:shadow-xl w-11/12 sm:w-8/12 md:w-6/12 lg:w-4/12 my-16 mx-auto text-black relative z-10"
      >
        <h1 className="font-bold text-2xl md:text-3xl py-4 text-center">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </h1>

        {!isSignInForm && (
          <>
            <input
              ref={fullName}
              type="text"
              placeholder="Full Name"
              className="p-3 md:p-4 my-3 w-full bg-gray-700 text-white rounded-lg"
            />
            <input
              ref={userId}
              type="text"
              placeholder="User ID"
              className="p-3 md:p-4 my-3 w-full bg-gray-700 text-white rounded-lg"
            />
            <textarea
              ref={address}
              placeholder="Address"
              className="p-3 md:p-4 my-3 w-full bg-gray-700 text-white rounded-lg"
              rows="3"
            />
          </>
        )}
        <input
          ref={email}
          type="email"
          placeholder="Email Address"
          className="p-3 md:p-4 my-3 w-full bg-gray-700 text-white rounded-lg"
        />
        <input
          ref={password}
          type="password"
          placeholder="Password"
          className="p-3 md:p-4 my-3 w-full bg-gray-700 text-white rounded-lg"
        />
        {!isSignInForm && (
          <input
            ref={confirmPassword}
            type="password"
            placeholder="Confirm Password"
            className="p-3 md:p-4 my-3 w-full bg-gray-700 text-white rounded-lg"
          />
        )}
        <p className="text-red-500 text-sm py-2 font-bold">{errorMsg}</p>
        <button
          className="p-2 md:p-3 my-4 bg-red-700 text-white w-full rounded-lg hover:bg-red-800"
          onClick={handleButtonClick}
        >
          {isSignInForm ? "Sign In" : "Sign Up"}
        </button>
        <p
          className="py-2 text-center cursor-pointer text-blue-500 hover:underline"
          onClick={toggleSignInForm}
        >
          {isSignInForm ? "New to shop? Sign Up Now" : "Already a user? Sign In Now"}
        </p>
      </form>
    </div>
  );
};

export default LoginComponent;
