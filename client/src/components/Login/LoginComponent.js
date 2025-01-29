import React, { useState, useRef } from "react";
import {
  FiSmartphone,
  FiTablet,
  FiMonitor,
  FiHeadphones,
  FiCamera,
  FiWatch,
} from "react-icons/fi";
import { graphQLCommand } from "../../util";
import { useNavigate } from "react-router-dom";

// Example Footer pinned at bottom if content is short


const LoginPage = () => {
  const [isSignInForm, setSignInForm] = useState(true);

  const email = useRef(null);
  const password = useRef(null);
  const confirmPassword = useRef(null);
  const fullName = useRef(null);
  const userId = useRef(null);
  const address = useRef(null);

  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const toggleSignInForm = () => {
    setSignInForm(!isSignInForm);
    setErrorMsg(""); // Clear error messages
  };

  const handleButtonClick = async () => {
    if (isSignInForm) {
      // ---- Sign In ----
      try {
        const query = `
          mutation ($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              message
              user {
                id
                fullName
                email
                userId
              }
            }
          }
        `;
        const variables = {
          email: email.current.value,
          password: password.current.value,
        };
        const response = await graphQLCommand(query, variables);

        if (response.login.user) {
          localStorage.setItem("userId", response.login.user.userId);
          localStorage.setItem("userEmail", response.login.user.email);
          alert(response.login.message);
          navigate("/"); // Redirect wherever you like
        }
      } catch (error) {
        setErrorMsg(error.message);
      }
    } else {
      // ---- Sign Up ----
      if (password.current.value !== confirmPassword.current.value) {
        setErrorMsg("Passwords do not match.");
        return;
      }
      try {
        const query = `
          mutation (
            $fullName: String!,
            $userId: String!,
            $email: String!,
            $password: String!,
            $address: String
          ) {
            signup(
              fullName: $fullName,
              userId: $userId,
              email: $email,
              password: $password,
              address: $address
            ) {
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
        if (response.signup.user) {
          alert(response.signup.message);
          toggleSignInForm(); // Switch to Sign In form after sign-up
        }
      } catch (error) {
        setErrorMsg(error.message);
      }
    }
  };

  return (
    <div
      className="
        flex 
        flex-col 
        min-h-screen 
        bg-[#252F3B]   /* primaryBlack */
        text-[#FFD65A] /* primaryYellow */
      "
    >
      {/* BACKGROUND ICONS */}
      {[
        { Icon: FiSmartphone, color: "#FFD65A", top: "10%", left: "20%" },
        { Icon: FiTablet, color: "#FFD65A", top: "25%", left: "70%" },
        { Icon: FiMonitor, color: "#FFD65A", top: "40%", left: "30%" },
        { Icon: FiHeadphones, color: "#FFD65A", top: "55%", left: "60%" },
        { Icon: FiCamera, color: "#FFD65A", top: "70%", left: "25%" },
        { Icon: FiWatch, color: "#FFD65A", top: "85%", left: "50%" },
      ].map(({ Icon, color, top, left }, index) => (
        <Icon
          key={index}
          className="absolute opacity-10 z-0"
          style={{
            color,
            fontSize: "clamp(2rem, 3vw, 4rem)",
            top,
            left,
          }}
        />
      ))}

      {/* FORM SECTION */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="
          relative
          z-10
          w-full
          max-w-md
          mx-auto
          mt-20
          mb-8
          bg-[#252F3B]   /* merges with background but let's keep a border? */
          border
          border-[#FFD65A]
          rounded-lg
          shadow-xl
          p-6
        "
      >
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </h1>

        {/* SIGN UP FIELDS */}
        {!isSignInForm && (
          <>
            <input
              ref={fullName}
              type="text"
              placeholder="Full Name"
              className="
                w-full 
                p-3 
                mb-3 
                bg-[#343f4e]
                text-[#FFD65A] 
                placeholder-[#aaa]
                rounded
                focus:outline-none
              "
            />
            <input
              ref={userId}
              type="text"
              placeholder="User ID"
              className="
                w-full 
                p-3 
                mb-3 
                bg-[#343f4e]
                text-[#FFD65A] 
                placeholder-[#aaa]
                rounded
                focus:outline-none
              "
            />
            <textarea
              ref={address}
              placeholder="Address (Optional)"
              rows={2}
              className="
                w-full 
                p-3 
                mb-3 
                bg-[#343f4e]
                text-[#FFD65A] 
                placeholder-[#aaa]
                rounded
                focus:outline-none
              "
            />
          </>
        )}

        {/* COMMON FIELDS */}
        <input
          ref={email}
          type="email"
          placeholder="Email Address"
          className="
            w-full 
            p-3 
            mb-3 
            bg-[#343f4e]
            text-[#FFD65A]
            placeholder-[#aaa]
            rounded
            focus:outline-none
          "
        />
        <input
          ref={password}
          type="password"
          placeholder="Password"
          className="
            w-full 
            p-3 
            mb-3 
            bg-[#343f4e]
            text-[#FFD65A]
            placeholder-[#aaa]
            rounded
            focus:outline-none
          "
        />
        {!isSignInForm && (
          <input
            ref={confirmPassword}
            type="password"
            placeholder="Confirm Password"
            className="
              w-full 
              p-3 
              mb-3 
              bg-[#343f4e]
              text-[#FFD65A]
              placeholder-[#aaa]
              rounded
              focus:outline-none
            "
          />
        )}

        {/* ERROR MESSAGE */}
        {errorMsg && (
          <p className="text-red-500 text-center font-semibold mb-2">{errorMsg}</p>
        )}

        {/* BUTTON */}
        <button
          onClick={handleButtonClick}
          className="
            w-full 
            p-3 
            mt-2 
            bg-[#FFD65A]
            text-[#252F3B]
            font-bold
            rounded
            hover:bg-opacity-90
            focus:outline-none
            transition
          "
        >
          {isSignInForm ? "Sign In" : "Sign Up"}
        </button>

        {/* TOGGLE SIGN IN / UP LINK */}
        <p
          onClick={toggleSignInForm}
          className="
            mt-4 
            text-center 
            cursor-pointer 
            text-[#FFD65A] 
            font-semibold
            hover:underline
          "
        >
          {isSignInForm
            ? "New to Scroll And Shop? Sign Up Now"
            : "Already have an account? Sign In"}
        </p>
      </form>

     
    </div>
  );
};

export default LoginPage;
