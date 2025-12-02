import React, { useState } from "react";
import logo from "../../assets/Images/kharidobecho-logo.svg";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../../store/services/authServices";

const ROLES = ["USER", "BUYER", "SELLER"];

const Registration = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    address: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
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

    if (
      !formData.email ||
      !formData.password ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.mobileNumber ||
      !formData.address ||
      !formData.role
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setIsLoading(true);
      await registerUser(formData);
      toast.success("Account created successfully! Redirecting to login...");
      navigate("/login");
    } catch (err) {
      console.error("Registration Error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.data?.message ||
        err?.message ||
        "Registration failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 bg-white items-center justify-center">
        <img src={logo} alt="Logo" className="w-150 h-100 object-contain" />
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-center px-8 py-10">
        <h1 className="text-3xl font-semibold text-center">Create Account</h1>

        <p className="text-gray-500 text-center text-sm mt-3 mb-10 max-w-xs">
          Start your journey with KharidoBecho. Join the marketplace today!
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
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


// import React, { useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import logo from "../../assets/Images/kharidobecho-logo.svg";
// import { toast } from "react-toastify";
// import { registerUser } from "../../store/services/authServices";

// const ROLES = ["BUYER", "SELLER"];

// const Registration = () => {
//   const navigate = useNavigate();

//   const [isLoading, setIsLoading] = useState(false);
//   const [focused, setFocused] = useState(null);

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPass, setShowConfirmPass] = useState(false);

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     confirmPassword: "",
//     firstName: "",
//     lastName: "",
//     mobileNumber: "",
//     address: "",
//     role: "BUYER",
//   });

//   const refs = {
//     firstName: useRef(),
//     lastName: useRef(),
//     email: useRef(),
//     password: useRef(),
//     confirmPassword: useRef(),
//     mobileNumber: useRef(),
//     address: useRef(),
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const validate = () => {
//     const { firstName, lastName, email, password, confirmPassword, mobileNumber, address } =
//       formData;

//     if (!firstName || !lastName || !email || !password || !confirmPassword || !mobileNumber || !address) {
//       toast.error("Please fill all fields");
//       return false;
//     }

//     if (!/^\d{10}$/.test(mobileNumber)) {
//       toast.error("Mobile number must be 10 digits");
//       return false;
//     }

//     if (!/^[\w.+\-]+@gmail\.com$/.test(email)) {
//       toast.error("Email must be a valid Gmail (@gmail.com)");
//       return false;
//     }

//     if (!/^(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,}$/.test(password)) {
//       toast.error("Password must be 8+ chars & contain 1 special symbol");
//       return false;
//     }

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match");
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validate()) return;

//     try {
//       setIsLoading(true);

//       const payload = {
//         email: formData.email,
//         password: formData.password,
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         mobileNumber: Number(formData.mobileNumber),
//         address: formData.address,
//         role: formData.role,
//       };

//       await registerUser(payload);

//       toast.success("Account created successfully!");
//       navigate("/login");
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message ||
//         err?.message ||
//         "Registration failed"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const RenderInput = ({
//     label,
//     name,
//     type = "text",
//     placeholder,
//     next,
//     isPassword,
//     toggle,
//     showPass,
//   }) => {
//     const inputType = isPassword ? (showPass ? "text" : "password") : type;

//     return (
//       <div>
//         <label className="block text-gray-700 font-medium mb-1">{label}</label>

//         <div
//           onClick={() => refs[name]?.current?.focus()}
//           className={`flex items-center border rounded-xl bg-gray-50 px-4 py-3 transition-all ${
//             focused === name ? "border-blue-500 shadow" : "border-gray-300"
//           }`}
//         >
//           <input
//             ref={refs[name]}
//             type={inputType}
//             name={name}
//             value={formData[name]}
//             placeholder={placeholder}
//             onChange={handleChange}
//             onFocus={() => setFocused(name)}
//             onBlur={() => setFocused(null)}
//             onKeyUp={(e) => {             // ✅ FIXED (keyUp instead of keyDown)
//               if (e.key === "Enter" && next) refs[next].current?.focus();
//             }}
//             className="w-full bg-transparent outline-none"
//           />

//           {isPassword && (
//             <button
//               type="button"
//               onClick={toggle}
//               className="text-gray-500 hover:text-gray-700 ml-2"
//             >
//               {showPass ? "🙈" : "👁️"}
//             </button>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen flex">
//       <div className="hidden md:flex w-1/2 bg-white items-center justify-center">
//         <img src={logo} alt="Logo" className="w-72 object-contain" />
//       </div>

//       <div className="w-full md:w-1/2 flex flex-col items-center px-8 py-10">
//         <h1 className="text-3xl font-semibold text-center">Create Account</h1>
//         <p className="text-gray-500 text-center text-sm mt-3 mb-10 max-w-xs">
//           Start your journey with KharidoBecho. Join our marketplace today!
//         </p>

//         <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">

//           <RenderInput label="First Name" name="firstName" placeholder="Enter first name" next="lastName" />

//           <RenderInput label="Last Name" name="lastName" placeholder="Enter last name" next="email" />

//           <RenderInput label="Email Address" name="email" type="email" placeholder="Enter email" next="password" />

//           <RenderInput
//             label="Password"
//             name="password"
//             isPassword
//             showPass={showPassword}
//             toggle={() => setShowPassword(!showPassword)}
//             placeholder="Enter password"
//             next="confirmPassword"
//           />

//           <RenderInput
//             label="Confirm Password"
//             name="confirmPassword"
//             isPassword
//             showPass={showConfirmPass}
//             toggle={() => setShowConfirmPass(!showConfirmPass)}
//             placeholder="Re-enter password"
//             next="mobileNumber"   // correct
//           />

//           <RenderInput
//             label="Mobile Number"
//             name="mobileNumber"
//             placeholder="Enter mobile number"
//             next="address"
//           />

//           <div>
//             <label className="block text-gray-700 font-medium mb-1">Address</label>
//             <textarea
//               name="address"
//               ref={refs.address}
//               placeholder="Enter address"
//               value={formData.address}
//               onChange={handleChange}
//               onFocus={() => setFocused("address")}
//               onBlur={() => setFocused(null)}
//               className={`w-full p-3 border rounded-xl bg-gray-50 outline-none ${
//                 focused === "address" ? "border-blue-500 shadow" : "border-gray-300"
//               }`}
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 font-medium mb-1">Register as</label>
//             <select
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50"
//             >
//               {ROLES.map((role) => (
//                 <option key={role} value={role}>
//                   {role}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <button
//             id="register-btn"
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-[#0A2533] text-white py-4 rounded-xl mt-2 text-lg font-medium disabled:opacity-50"
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
