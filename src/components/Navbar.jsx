/**
 * Navbar Component
 * 
 * Role-aware navigation bar that conditionally renders UI based on user role:
 * - Guest: Shows login button, browse links
 * - Buyer: Shows profile, chat, browse links
 * - Seller: Shows dashboard link, seller-specific menu items (no buyer links)
 * 
 * Uses AuthContext for role detection instead of directly reading localStorage.
 */

// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Img from "../assets/Images/img.png";  // adjust relative path as needed

export default function Navbar() {
  const navigate = useNavigate();
  const { isSignedIn, roles } = useAuth();

  // UI state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, setLocation] = useState("India");

  // Determine user role from AuthContext
  const isSeller = roles.includes("SELLER");
  const isBuyer = roles.includes("BUYER") || roles.includes("USER");
  const isGuest = !isSignedIn;

  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      {/* TOP BAR */}
      <div className="container mx-auto px-4 flex items-center h-16 md:h-18 lg:h-20">
        {/* Logo */}
        <img src={Img} alt="KharidoBhecho" className="h-7 w-auto md:h-8 lg:h-9" />


        {/* Search (desktop) */}
        <div className="hidden md:flex flex-1 items-center">
          <input
            type="text"
            placeholder="Search"
            className="flex-1 border rounded-l-md py-2 px-3 text-sm outline-none"
          />
          <button className="bg-blue-300 hover:bg-blue-700 text-white py-2 px-4 rounded-r-md text-sm">
            🔍
          </button>
        </div>

        {/* RIGHT ACTIONS (desktop) */}
        <div className="hidden sm:flex items-center space-x-4 ml-4">
          {/* Wishlist */}
          <button className="text-gray-600 hover:text-gray-800 text-lg">♡</button>

          {/* SELL BUTTON */}
          {isSeller ? (
            <Link
              to="/dashboard"
              className="bg-yellow-200 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-4 rounded-md text-sm"
            >
              + SELL
            </Link>
          ) : (
            <button
              className="bg-yellow-100 text-gray-400 font-semibold py-2 px-4 rounded-md text-sm cursor-not-allowed"
              disabled
              title={isSignedIn ? "Only sellers can list products" : "Login as seller"}
            >
              + SELL
            </button>
          )}

          {/* PROFILE / LOGIN */}
          {isSignedIn ? (
            <button
              onClick={() => navigate(isSeller ? "/dashboard" : "/profile")}
              className="text-gray-700 hover:text-gray-900 text-3xl"
            >
              <FaUserCircle />
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </button>
          )}
        </div>

        {/* MOBILE ACTIONS */}
        <div className="flex sm:hidden items-center gap-3 ml-auto">
          {/* SELL (mobile) */}
          {isSeller ? (
            <Link
              to="/dashboard"
              className="bg-yellow-200 hover:bg-yellow-500 text-gray-900 font-semibold py-1.5 px-3 rounded-md text-xs"
            >
              SELL
            </Link>
          ) : (
            <button
              className="bg-yellow-100 text-gray-400 font-semibold py-1.5 px-3 rounded-md text-xs cursor-not-allowed"
              disabled
            >
              SELL
            </button>
          )}

          {/* PROFILE ICON (MOBILE) */}
          {isSignedIn && (
            <button
              onClick={() => navigate(isSeller ? "/dashboard" : "/profile")}
              className="text-gray-700 text-2xl"
            >
              <FaUserCircle />
            </button>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-md border border-gray-200 text-gray-700"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH */}
      <div className="container mx-auto px-4 pb-2 md:hidden">
        <div className="flex">
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

      {/* DESKTOP LINKS ROW - Conditionally show based on role */}
      <div className="bg-gray-50 border-t relative hidden md:block">
        <div className="container mx-auto px-4 h-12 flex items-center space-x-6 text-sm">
          {/* Show product categories only for guests and buyers (not sellers) */}
          {!isSeller && (
            <>
              <button
                onClick={() => handleNavigate("/buy/cars")}
                className="hover:text-blue-600"
              >
                Cars
              </button>
              <button
                onClick={() => handleNavigate("/buy/bikes")}
                className="hover:text-blue-600"
              >
                Bikes
              </button>
              <button
                onClick={() => handleNavigate("/buy/mobiles")}
                className="hover:text-blue-600"
              >
                Mobiles
              </button>
              <button
                onClick={() => handleNavigate("/buy/laptops")}
                className="hover:text-blue-600"
              >
                Laptops
              </button>
            </>
          )}

          {/* Seller-specific links */}
          {isSeller && (
            <>
              <button
                onClick={() => handleNavigate("/dashboard")}
                className="hover:text-blue-600"
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavigate("/seller/requests")}
                className="hover:text-blue-600"
              >
                Requests
              </button>
              <button
                onClick={() => handleNavigate("/seller/chat")}
                className="hover:text-blue-600"
              >
                Chat
              </button>
            </>
          )}

          <span className="ml-auto text-gray-500 text-sm">
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-3 space-y-3 text-sm">
            <div>
              <label className="text-xs text-gray-500">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border rounded-md py-1.5 px-2 text-xs w-full"
              >
                <option>India</option>
                <option>Mumbai</option>
                <option>Delhi</option>
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              {/* Show product categories only for guests and buyers */}
              {!isSeller && (
                <>
                  <button
                    onClick={() => handleNavigate("/buy/cars")}
                    className="text-left"
                  >
                    Cars
                  </button>
                  <button
                    onClick={() => handleNavigate("/buy/bikes")}
                    className="text-left"
                  >
                    Bikes
                  </button>
                  <button
                    onClick={() => handleNavigate("/buy/mobiles")}
                    className="text-left"
                  >
                    Mobiles
                  </button>
                  <button
                    onClick={() => handleNavigate("/buy/laptops")}
                    className="text-left"
                  >
                    Laptops
                  </button>
                </>
              )}

              {/* Seller-specific mobile menu items */}
              {isSeller && (
                <>
                  <button
                    onClick={() => handleNavigate("/dashboard")}
                    className="text-left"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleNavigate("/seller/requests")}
                    className="text-left"
                  >
                    Requests
                  </button>
                  <button
                    onClick={() => handleNavigate("/seller/chat")}
                    className="text-left"
                  >
                    Chat
                  </button>
                </>
              )}
            </div>

            <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
              <span>{new Date().toLocaleDateString("en-GB")}</span>
              <span>KharidoBhecho</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
