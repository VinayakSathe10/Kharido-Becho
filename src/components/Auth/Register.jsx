// import React, { useState } from "react";
// import logo from "../../assets/Images/kharidobecho-logo.svg";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useRegisterMutation } from "../../store/services/authApi";

// const Registration = () => {
//   const navigate = useNavigate();
//   const [register, { isLoading }] = useRegisterMutation();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     address: "",
//     firstName: "",
//     lastName: "",
//     mobileNumber: "",
//     role: "USER", // fixed role required by backend
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // required validation
//     if (
//       !formData.email ||
//       !formData.password ||
//       !formData.firstName ||
//       !formData.lastName ||
//       !formData.mobileNumber ||
//       !formData.address
//     ) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     try {
//       const response = await register(formData).unwrap();

//       console.log("Registration Response:", response);
//       toast.success("Account created successfully!");
//       navigate("/login");
//     } catch (err) {
//       console.error("Registration Error:", err);
      
//       // Handle RTK Query errors
//       if (err.data) {
//         const errorMessage = err.data?.message || err.data?.error || "Registration failed";
//         toast.error(errorMessage);
//       } else if (err.status) {
//         if (err.status === 'FETCH_ERROR') {
//           toast.error("No response from server. Check your network or server status.");
//         } else {
//           toast.error(`Registration failed with status ${err.status}`);
//         }
//       } else {
//         toast.error("An unexpected error occurred during registration.");
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex">
//       {/* LEFT LOGO */}
//       <div className="hidden md:flex w-1/2 bg-white items-center justify-center">
//         <img src={logo} alt="Logo" className="w-150 h-100 object-contain" />
//       </div>

//       {/* RIGHT FORM */}
//       <div className="w-full md:w-1/2 flex flex-col items-center px-8 py-10">
//         <h1 className="text-3xl font-semibold text-center">Create Account</h1>

//         <p className="text-gray-500 text-center text-sm mt-3 mb-10 max-w-xs">
//           Start your journey with KharidoBecho. Join the marketplace today!
//         </p>

//         <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
//           {/* First Name */}
//           <div>
//             <label className="block text-gray-700 font-medium mb-1">
//               First Name
//             </label>
//             <input
//               type="text"
//               name="firstName"
//               placeholder="Enter first name"
//               value={formData.firstName}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
//             />
//           </div>

//           {/* Last Name */}
//           <div>
//             <label className="block text-gray-700 font-medium mb-1">
//               Last Name
//             </label>
//             <input
//               type="text"
//               name="lastName"
//               placeholder="Enter last name"
//               value={formData.lastName}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-gray-700 font-medium mb-1">
//               Email Address
//             </label>
//             <input
//               type="email"
//               name="email"
//               placeholder="Enter email address"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-gray-700 font-medium mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               placeholder="Enter password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
//             />
//           </div>

//           {/* Mobile Number */}
//           <div>
//             <label className="block text-gray-700 font-medium mb-1">
//               Mobile Number
//             </label>
//             <input
//               type="text"
//               name="mobileNumber"
//               placeholder="Enter mobile number"
//               value={formData.mobileNumber}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
//             />
//           </div>

//           {/* Address */}
//           <div>
//             <label className="block text-gray-700 font-medium mb-1">
//               Address
//             </label>
//             <textarea
//               name="address"
//               placeholder="Enter address"
//               value={formData.address}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
//             ></textarea>
//           </div>

//           {/* Hidden role */}
//           <input type="hidden" name="role" value="USER" />

//           {/* Register Button */}
//           <button
//             id="register-btn"
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-[#0A2533] text-white py-4 rounded-xl mt-2 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isLoading ? "Registering..." : "Register"}
//           </button>
//         </form>

//         <p className="text-gray-600 text-sm mt-6">
//           Already have an account?{" "}
//           <span
//             className="text-blue-600 font-semibold cursor-pointer"
//             onClick={() => navigate("/login")}
//           >
//             Login
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Registration;


import React, { useState } from "react";
import logo from "../../assets/Images/kharidobecho-logo.svg";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../store/services/authApi";

const ROLES = ["USER", "BUYER", "SELLER"]; // Define available roles

const Registration = () => {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    address: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
    // Changed default role to BUYER, or keep USER if that's the primary default
    role: "BUYER", 
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required validation
    if (
      !formData.email ||
      !formData.password ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.mobileNumber ||
      !formData.address ||
      !formData.role // Ensure a role is also selected
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      // The formData now includes the selected role
      const response = await register(formData).unwrap();

      console.log("Registration Response:", response);
      toast.success("Account created successfully! Redirecting to login...");
      navigate("/login");
    } catch (err) {
      console.error("Registration Error:", err);
      
      // Handle RTK Query errors
      if (err.data) {
        const errorMessage = err.data?.message || err.data?.error || "Registration failed";
        toast.error(errorMessage);
      } else if (err.status) {
        if (err.status === 'FETCH_ERROR') {
          toast.error("No response from server. Check your network or server status.");
        } else {
          toast.error(`Registration failed with status ${err.status}`);
        }
      } else {
        toast.error("An unexpected error occurred during registration.");
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT LOGO */}
      <div className="hidden md:flex w-1/2 bg-white items-center justify-center">
        <img src={logo} alt="Logo" className="w-150 h-100 object-contain" />
      </div>

      {/* RIGHT FORM */}
      <div className="w-full md:w-1/2 flex flex-col items-center px-8 py-10">
        <h1 className="text-3xl font-semibold text-center">Create Account</h1>

        <p className="text-gray-500 text-center text-sm mt-3 mb-10 max-w-xs">
          Start your journey with KharidoBecho. Join the marketplace today!
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
          {/* First Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              name="mobileNumber"
              placeholder="Enter mobile number"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Address
            </label>
            <textarea
              name="address"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
            ></textarea>
          </div>
          
          {/* 🆕 ROLE SELECTION DROPDOWN */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              I want to register as a:
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 appearance-none"
            >
              {ROLES.map((roleOption) => (
                <option key={roleOption} value={roleOption}>
                  {roleOption.charAt(0) + roleOption.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>


          {/* Register Button */}
          <button
            id="register-btn"
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0A2533] text-white py-4 rounded-xl mt-2 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-gray-600 text-sm mt-6">
          Already have an account?{" "}
          <span
            className="text-blue-600 font-semibold cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Registration;