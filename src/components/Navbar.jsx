// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import CategoriesDropdown from "./CategoriesDropdown";

export default function Navbar() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("India");
  const [showCategories, setShowCategories] = useState(false);
  const [categoriesEnabled] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleCategories = () => {
    if (!categoriesEnabled) return;
    setShowCategories((prev) => !prev);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false); // close mobile menu after navigation
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      {/* TOP BAR */}
      <div className="container mx-auto px-4 flex items-center h-16 md:h-18 lg:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center mr-2 md:mr-4">
          <img
            src="/logo.png"
            alt="KharidoBhecho"
            className="h-7 w-auto md:h-8 lg:h-9"
          />
        </Link>

        {/* Location selector - hidden on very small screens */}
        <div className="relative mr-2 md:mr-4 hidden sm:block">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border rounded-md py-1 px-2 text-xs md:text-sm"
          >
            <option value="India">India</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
          </select>
        </div>

        {/* Search bar - visible on md+ in navbar, separate row on mobile */}
        <div className="hidden md:flex flex-1 items-center">
          <input
            type="text"
            placeholder='Search “Cars”'
            className="flex-1 border rounded-l-md py-2 px-3 text-sm outline-none"
          />
          <button className="bg-blue-300 hover:bg-blue-700 text-white py-2 px-4 rounded-r-md text-sm">
            🔍
          </button>
        </div>

        {/* Right actions (desktop / tablet) */}
        <div className="hidden sm:flex items-center space-x-3 md:space-x-4 ml-2 md:ml-4">
          <button className="text-gray-600 hover:text-gray-800 text-lg">
            ♡
          </button>
          {/* Navigate to seller dashboard when clicking SELL */}
          <Link
            to="/dashboard"
            className="bg-yellow-200 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-3 md:px-4 rounded-md text-xs md:text-sm"
          >
            + SELL
          </Link>
        </div>

        {/* Mobile: Right side – Hamburger + Sell */}
        <div className="flex sm:hidden items-center gap-2 ml-auto">
          <Link
            to="/dashboard"
            className="bg-yellow-200 hover:bg-yellow-500 text-gray-900 font-semibold py-1.5 px-3 rounded-md text-xs"
          >
            SELL
          </Link>
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-md border border-gray-200 text-gray-700"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile search bar (separate row) */}
      <div className="container mx-auto px-4 pb-2 md:hidden">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search products"
            className="flex-1 border rounded-l-md py-2 px-3 text-sm outline-none"
          />
          <button className="bg-blue-300 hover:bg-blue-700 text-white py-2 px-3 rounded-r-md text-sm">
            🔍
          </button>
        </div>
      </div>

      {/* BOTTOM BAR - Desktop / Tablet categories row */}
      <div className="bg-gray-50 border-t relative hidden md:block">
        <div className="container mx-auto px-4 h-12 flex items-center space-x-6 text-sm">
          <button
            onClick={toggleCategories}
            className={`text-sm font-semibold ${
              categoriesEnabled
                ? "hover:text-blue-600 cursor-pointer"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            ALL CATEGORIES {showCategories ? "▲" : "▼"}
          </button>

          <button
            onClick={() => handleNavigate("/buy/cars")}
            className="hover:text-blue-600 text-sm"
          >
            Cars
          </button>
          <button
            onClick={() => handleNavigate("/buy/bikes")}
            className="hover:text-blue-600 text-sm"
          >
            Bikes
          </button>
          <button
            onClick={() => handleNavigate("/buy/mobiles")}
            className="hover:text-blue-600 text-sm"
          >
            Mobiles
          </button>
          <button
            onClick={() => handleNavigate("/buy/laptops")}
            className="hover:text-blue-600 text-sm"
          >
            Laptops
          </button>

          <span className="ml-auto text-sm text-gray-500">
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>

          {showCategories && (
            <CategoriesDropdown
              visible={showCategories}
              onClose={() => setShowCategories(false)}
            />
          )}
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU (Categories + Links) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-3 space-y-3 text-sm">
            {/* Location selector visible in mobile menu */}
            <div className="mb-2">
              <label className="block text-xs text-gray-500 mb-1">
                Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border rounded-md py-1.5 px-2 text-xs w-full"
              >
                <option value="India">India</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>

            <button
              onClick={toggleCategories}
              className={`w-full text-left font-semibold ${
                categoriesEnabled
                  ? "hover:text-blue-600 cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              ALL CATEGORIES {showCategories ? "▲" : "▼"}
            </button>

            <div className="flex flex-col space-y-2 mt-2">
              <button
                onClick={() => handleNavigate("/buy/cars")}
                className="text-left hover:text-blue-600"
              >
                Cars
              </button>
              <button
                onClick={() => handleNavigate("/buy/bikes")}
                className="text-left hover:text-blue-600"
              >
                Bikes
              </button>
              <button
                onClick={() => handleNavigate("/buy/mobiles")}
                className="text-left hover:text-blue-600"
              >
                Mobiles
              </button>
              <button
                onClick={() => handleNavigate("/buy/laptops")}
                className="text-left hover:text-blue-600"
              >
                Laptops
              </button>
            </div>

            {showCategories && (
              <div className="mt-2">
                <CategoriesDropdown
                  visible={showCategories}
                  onClose={() => setShowCategories(false)}
                />
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t mt-3 text-xs text-gray-500">
              <span>
                {new Date().toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span>KharidoBhecho</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
