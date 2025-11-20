import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoginMutation } from "../../store/services/authApi";
import logo from "../../assets/Images/kharidobecho-logo.svg";

const Login = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  
  // const [formData, setFormData] = useState({ username: email, password: password });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }
  
    try {
      const payload = {
        username: formData.email,      // backend expects "username"
        password: formData.password,
      };
  
      const response = await login(payload).unwrap();
  
      console.log("Login Response:", response);
  
      // Save token
      if (response.accessToken) {
        localStorage.setItem("token", response.accessToken);
      } else if (response.token) {
        localStorage.setItem("token", response.token);
      } else if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }
  
      // ✅ Get roles from response
      const roles = response.roles || [];
  
      // (optional) Store roles if you want later checks
      localStorage.setItem("roles", JSON.stringify(roles));
  
      toast.success("Login successful");
  
      // ✅ Role-wise navigation
      if (roles.includes("ROLE_BUYER") || roles.includes("BUYER")) {
        navigate("/");                // buyer → home page
      } else {
        navigate("/dashboard");       // others → dashboard
      }
    } catch (err) {
      console.error("Login Error:", err);
      toast.error("Invalid credentials or server error");
    }
  };
  

  // ... rest of the component (return statement) remains the same
  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE - LOGO */}
      <div className="hidden md:flex w-1/2 bg-white items-center justify-center">
        <img src={logo} alt="Logo" className="w-150 h-100 object-contain" />
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="w-full md:w-1/2 flex flex-col items-center px-8 py-10">
        <h1 className="text-3xl font-semibold text-center">Login</h1>

        <p className="text-gray-500 text-center text-sm mt-3 mb-10 max-w-xs">
          Lorem ipsum dolor sit amet consectetur. Ipsum massa turpis morbi
          platea. Vitae habitant duis.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          {/* Email */}
          <label className="block text-gray-700 font-medium mb-1">
            Email address
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Password */}
          <div className="mt-5">
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right mt-2">
            <button
              type="button"
              className="text-[#033047] text-sm font-semibold cursor-pointer"
              onClick={() => {
                navigate("/forget-password");
              }}
            >
              Forgot Password?
            </button>
          </div>

          {/* Login button */}
          <button
            id="login-btn"
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0A2533] text-white py-4 rounded-xl mt-8 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-600 text-sm mt-6">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 font-semibold cursor-pointer"
            onClick={() => {
              navigate("/register");
            }}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
