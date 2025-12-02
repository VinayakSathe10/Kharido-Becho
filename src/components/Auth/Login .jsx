// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useDispatch } from "react-redux";

// import { setAuthState } from "../../store/authSlice";
// import logo from "../../assets/Images/kharidobecho-logo.svg";
// import {
//   loginUser,
//   fetchBuyerInfo,
//   fetchSellerInfo,
// } from "../../store/services/authServices";

// const Login = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [loginLoading, setLoginLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.email || !formData.password) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     try {
//       setLoginLoading(true);
//       const payload = {
//         username: formData.email,
//         password: formData.password,
//       };

//       const response = await loginUser(payload);
//       console.log("Login Response:", response);

//       const token =
//         response.accessToken || response.token || response.data?.token || null;

//       if (token) {
//         localStorage.setItem("token", token);
//       }

//       // ✅ FIX: Read roles from backend (authorities)
//       const roles =
//         response.authorities || response.roles || response.data?.roles || [];

//       console.log("User Roles:", roles);

//       localStorage.setItem("roles", JSON.stringify(roles));

//       // ROLE CHECK FIX ✔
//       const isBuyer = roles.includes("BUYER");
//       const isSeller = roles.includes("SELLER");

//       const baseUserId = response.userId;
//       if (baseUserId) {
//         localStorage.setItem("userId", baseUserId);
//       }

//       // ========================
//       // BUYER LOGIN FLOW
//       // ========================
//       if (isBuyer) {
//         console.log("Hitting Buyer API...");
//         const buyerData = await fetchBuyerInfo(baseUserId);

//         if (!buyerData) {
//           toast.error("Buyer info fetch failed");
//           return;
//         }

//         const buyerUserId = buyerData.userId;
//         localStorage.setItem("buyerUserId", buyerUserId);

//         dispatch(
//           setAuthState({
//             token,
//             sellerId: null,
//             sellerProfile: {
//               roles,
//               expiresIn: response.expiresIn,
//               tokenType: response.tokenType,
//               userId: baseUserId,
//             },
//           })
//         );

//         toast.success("Login successful");
//         navigate("/");
//         return;
//       }

//       // ========================
//       // SELLER LOGIN FLOW
//       // ========================
//       if (isSeller) {
//         console.log("Hitting Seller API...");
//         const sellerData = await fetchSellerInfo(baseUserId);

//         if (!sellerData) {
//           toast.error("Seller info fetch failed");
//           return;
//         }

//         const sellerId = sellerData.sellerId;
//         localStorage.setItem("sellerId", sellerId);

//         dispatch(
//           setAuthState({
//             token,
//             sellerId,
//             sellerProfile: {
//               roles,
//               expiresIn: response.expiresIn,
//               tokenType: response.tokenType,
//               userId: baseUserId,
//             },
//           })
//         );

//         toast.success("Login successful");
//         navigate("/dashboard");
//         return;
//       }

//       // NO ROLE FOUND
//       toast.error("Unauthorized: No valid role assigned");
//     } catch (err) {
//       console.error("Login Error:", err);
//       const message =
//         err?.response?.data?.message ||
//         err?.data?.message ||
//         err?.message ||
//         "Invalid credentials or server error";
//       toast.error(message);
//     } finally {
//       setLoginLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex">
//       {/* LEFT LOGO SIDE */}
//       <div className="hidden md:flex w-1/2 bg-white items-center justify-center">
//         <img src={logo} alt="Logo" className="w-150 h-100 object-contain" />
//       </div>

//       {/* RIGHT FORM SIDE */}
//       <div className="w-full md:w-1/2 flex flex-col items-center px-8 py-10">
//         <h1 className="text-3xl font-semibold text-center">Login</h1>

//         <p className="text-gray-500 text-center text-sm mt-3 mb-10 max-w-xs">
//           Lorem ipsum dolor sit amet consectetur. Ipsum massa turpis morbi
//           platea. Vitae habitant duis.
//         </p>

//         <form onSubmit={handleSubmit} className="w-full max-w-sm">
//           <label className="block text-gray-700 font-medium mb-1">
//             Email address
//           </label>
//           <input
//             type="email"
//             name="email"
//             placeholder="Enter email address"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           <div className="mt-5">
//             <label className="block text-gray-700 font-medium mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               placeholder="Enter password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div className="text-right mt-2">
//             <button
//               type="button"
//               className="text-[#033047] text-sm font-semibold cursor-pointer"
//               onClick={() => navigate("/forget-password")}
//             >
//               Forgot Password?
//             </button>
//           </div>

//           <button
//             id="login-btn"
//             type="submit"
//             disabled={loginLoading}
//             className="w-full bg-[#0A2533] text-white py-4 rounded-xl mt-8 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loginLoading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="text-gray-600 text-sm mt-6">
//           Don’t have an account?{" "}
//           <span
//             className="text-blue-600 font-semibold cursor-pointer"
//             onClick={() => navigate("/register")}
//           >
//             Sign up
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineEmail, MdOutlineLock, MdVisibility, MdVisibilityOff, MdArrowForward, MdStorefront } from "react-icons/md";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import logo from "../../assets/Images/kharidobecho-logo.svg";
import { setAuthState } from "../../store/authSlice";
import { loginUser, fetchBuyerInfo, fetchSellerInfo } from "../../store/services/authServices";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { refreshAuthState, setAuthenticating, clearAuthenticating } = useAuth();

  const [loading, setLoading] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Press Enter → Go to next input or login
  const handleEnter = (e, next) => {
    if (e.key === "Enter") {
      next();
    }
  };

  // MAIN LOGIN LOGIC MERGED ✔
  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      if (loading) return;

      setLoading(true);
      setAuthenticating(true);

      const payload = {
        username: formData.email,
        password: formData.password,
      };

      const response = await loginUser(payload);
      console.log("Login Response:", response);

      // TOKEN
      const token =
        response.accessToken || response.token || response.data?.token || null;

      if (token) {
        localStorage.setItem("token", token);
      }

      // ROLES
      const roles =
        response.authorities || response.roles || response.data?.roles || [];

      console.log("User Roles:", roles);
      localStorage.setItem("roles", JSON.stringify(roles));

      const baseUserId = response.userId;
      if (baseUserId) {
        localStorage.setItem("userId", baseUserId);
      }

      const isBuyer = roles.includes("BUYER");
      const isSeller = roles.includes("SELLER");

      // ======================
      // BUYER LOGIN FLOW
      // ======================
      if (isBuyer) {
        const buyerData = await fetchBuyerInfo(baseUserId);
        if (!buyerData) return toast.error("Failed to fetch buyer info");

        const buyerUserId = buyerData.userId;
        localStorage.setItem("buyerUserId", buyerUserId);

        dispatch(
          setAuthState({
            token,
            sellerId: null,
            sellerProfile: {
              roles,
              expiresIn: response.expiresIn,
              tokenType: response.tokenType,
              userId: baseUserId,
            },
          })
        );

        toast.success("Login successful");
        refreshAuthState();
        window.dispatchEvent(new Event("auth-state-changed"));
        navigate("/");
        return;
      }

      // ======================
      // SELLER LOGIN FLOW
      // ======================
      if (isSeller) {
        const sellerData = await fetchSellerInfo(baseUserId);
        if (!sellerData) return toast.error("Failed to fetch seller info");

        const sellerId = sellerData.sellerId;
        localStorage.setItem("sellerId", sellerId);

        dispatch(
          setAuthState({
            token,
            sellerId,
            sellerProfile: {
              roles,
              expiresIn: response.expiresIn,
              tokenType: response.tokenType,
              userId: baseUserId,
            },
          })
        );

        toast.success("Login successful");
        refreshAuthState();
        window.dispatchEvent(new Event("auth-state-changed"));
        navigate("/dashboard");
        return;
      }

      toast.error("Unauthorized: No valid role assigned");
    } catch (err) {
      console.error("Login Error:", err);
      toast.error(
        err?.response?.data?.message ||
        err?.data?.message ||
        err?.message ||
        "Invalid credentials"
      );
    } finally {
      setLoading(false);
      clearAuthenticating();
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* LEFT SIDE LOGO */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-white">
        <img src={logo} alt="Logo" className="w-150 h-100 object-contain" />
      </div>

      {/* RIGHT SIDE LOGIN UI (THEMED LIKE REFER COMPONENT) */}
      <div className="w-full md:w-1/2 flex flex-col items-center px-8 py-10">
        <div className="w-full max-w-md">

          {/* BRAND HEADER */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center">
              <div className="w-18 h-18 rounded-full bg-brand-badge-background flex items-center justify-center mb-6 shadow-sm">
                <MdStorefront className="text-primary text-3xl" />
              </div>

              <h1 className="text-3xl font-extrabold text-text-primary">
                Kharido<span className="text-secondary">Becho</span>
              </h1>
              <p className="text-base text-text-tertiary mt-2">
                Buy & Sell Marketplace
              </p>
            </div>
          </div>

          {/* WELCOME TEXT */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-extrabold text-text-primary">Welcome Back 👋</h2>
            <p className="text-base text-text-tertiary">Login to continue your journey</p>
          </div>

          {/* LOGIN CARD */}
          <div className="bg-surface rounded-xl p-6 shadow-card">

            {/* EMAIL */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-secondary mb-2">
                Email address
              </label>
              <div
                onClick={() => emailRef.current?.focus()}
                className={`flex items-center bg-search-background rounded-full px-4 py-3 border-2 transition-all cursor-text
                ${emailFocused ? "bg-surface border-primary shadow-xs" : "border-transparent"}
              `}
              >
                <MdOutlineEmail
                  className={`text-xl mr-3 ${emailFocused ? "text-primary" : "text-text-tertiary"}`}
                />
                <input
                  ref={emailRef}
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  onKeyDown={(e) => handleEnter(e, () => passwordRef.current.focus())}
                  className="flex-1 bg-transparent text-lg font-medium outline-none"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-secondary mb-2">
                Password
              </label>

              <div
                onClick={() => passwordRef.current?.focus()}
                className={`flex items-center bg-search-background rounded-full px-4 py-3 border-2 transition-all cursor-text
                ${passwordFocused ? "bg-surface border-primary shadow-xs" : "border-transparent"}
              `}
              >
                <MdOutlineLock
                  className={`text-xl mr-3 ${passwordFocused ? "text-primary" : "text-text-tertiary"}`}
                />

                <input
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  onKeyDown={(e) => handleEnter(e, handleLogin)}
                  className="flex-1 bg-transparent text-lg font-medium outline-none"
                />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPassword(!showPassword);
                  }}
                  className="ml-2 p-1 text-text-tertiary hover:text-text-secondary"
                >
                  {showPassword ? (
                    <MdVisibilityOff className="text-xl" />
                  ) : (
                    <MdVisibility className="text-xl" />
                  )}
                </button>
              </div>
            </div>

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end mb-6">
              <button
                className="text-sm font-semibold text-link hover:text-link-hover"
                type="button"
                onClick={() => navigate("/forget-password")}
              >
                Forgot password?
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
              disabled={loading}
              onClick={handleLogin}
              className={`w-full bg-secondary rounded-full py-4 px-5 flex items-center justify-center transition-opacity shadow-brand-button
              ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}
            `}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-text-inverse border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-lg font-bold text-text-inverse mr-2">Login</span>
                  <MdArrowForward className="text-text-inverse text-xl" />
                </>
              )}
            </button>
          </div>

          {/* SIGN UP LINK */}
          <div className="flex justify-center items-center mt-8">
            <span className="text-base text-text-secondary">Don’t have an account?</span>
            <button
              className="text-base font-semibold text-link hover:text-link-hover ml-1"
              onClick={() => navigate("/register")}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>

      {/* LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 bg-overlay-light flex items-center justify-center z-50">
          <div className="bg-surface rounded-xl p-8 shadow-xl min-w-[200px] text-center">
            <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-base text-text-primary font-semibold">Signing you in...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
