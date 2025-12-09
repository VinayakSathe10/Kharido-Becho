/**
 * App.jsx - Main Application Router
 *
 * Implements role-based routing with three user types:
 *
 * 1. GUEST (unauthenticated): Can browse products, redirected to login when trying to buy
 * 2. BUYER (role: "BUYER"): Can browse and purchase products, see buyer-specific UI
 * 3. SELLER (role: "SELLER"): Redirected to dashboard after login, see seller-specific UI
 *
 * Route Categories:
 * - Public routes: Accessible to all (guest, buyer, seller)
 * - Buyer-protected routes: Only accessible to authenticated buyers
 * - Seller-protected routes: Only accessible to authenticated sellers
 *
 * UI Components:
 * - Navbar: Always visible (except on auth pages), role-aware
 * - BottomBar: Visible for guest and buyer, hidden for seller
 * - Footer: Always visible (except on auth pages)
 */

import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BottomBar from "./components/BottomBar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import BikeDetail from "./components/BikeComponent/BikeDetails";
import BikeChat from "./components/BikeComponent/BikeChat";

// Core pages
import Home from "./hooks/pages/Home";
import BuyCars from "./hooks/pages/BuyCars";
import BuyBikes from "./hooks/pages/Bike/BuyBikes";
import BuyMobiles from "./hooks/pages/BuyMobiles";
import BuyLaptops from "./hooks/pages/laptops/BuyLaptops";
import Dashboard from "./hooks/pages/Dashboard";
import SellProducts from "./hooks/pages/SellProducts";
// import ProductDetail from "../src/components/";

// Auth
import Login from "./components/Auth/Login ";
import Register from "./components/Auth/Register";
import ForgetPassword from "./components/Auth/ForgetPassword";

// Chats
import SellerRequestList from "./components/SellerRequestList";

// Profile
import Profile from "../src/components/Profile";

function App() {
  const location = useLocation();
  const isAuthPage = ["/login", "/register", "/forget-password"].includes(
    location.pathname
  );

  return (
    <AuthProvider>
      {/* Navbar: Always visible except on auth pages, role-aware */}
      {!isAuthPage && <Navbar />}

      {/* Main content area with padding for bottom bar on mobile */}
      <div className="min-h-screen pb-16 md:pb-0">
        <Routes>
          {/* ============================================
              PUBLIC ROUTES (Guest, Buyer, Seller can access)
              ============================================ */}
               <Route path="/buy/bikes/:id" element={<BikeDetail />} />
               <Route path="/chat" element={<BikeChat />} />
          <Route
            path="/"
            element={
              <RoleBasedRoute public={true}>
                <Home />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/buy/cars"
            element={
              <RoleBasedRoute public={true}>
                <BuyCars />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/buy/bikes"
            element={
              <RoleBasedRoute public={true}>
                <BuyBikes />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/buy/mobiles"
            element={
              <RoleBasedRoute public={true}>
                <BuyMobiles />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/buy/laptops"
            element={
              <RoleBasedRoute public={true}>
                <BuyLaptops />
              </RoleBasedRoute>
            }
          />
        


          {/* ============================================
              BUYER-PROTECTED ROUTES (Only authenticated buyers)
              ============================================ */}
          
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute requiredRole="BUYER">
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* ============================================
              SELLER-PROTECTED ROUTES (Only authenticated sellers)
              ============================================ */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="SELLER">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sellfrom"
            element={
              <ProtectedRoute requiredRole="SELLER">
                <SellProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sell-laptop/:id"
            element={
              <ProtectedRoute requiredRole="SELLER">
                <SellProducts initialTab="laptop" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sell-mobile/:id"
            element={
              <ProtectedRoute requiredRole="SELLER">
                <SellProducts initialTab="mobile" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sell-car/:id"
            element={
              <ProtectedRoute requiredRole="SELLER">
                <SellProducts initialTab="car" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sell-bike/:id"
            element={
              <ProtectedRoute requiredRole="SELLER">
                <SellProducts initialTab="bike" />
              </ProtectedRoute>
            }
         />
          <Route
            path="/seller/requests"
            element={
              <ProtectedRoute requiredRole="SELLER">
                <SellerRequestList />
              </ProtectedRoute>
            }
          />

          {/* ============================================
              AUTH ROUTES (Public, but redirect if already logged in)
              ============================================ */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
        </Routes>
      </div>

      {/* BottomBar: Visible for guest and buyer, hidden for seller */}
      {!isAuthPage && <BottomBar />}

      {/* Footer: Always visible except on auth pages */}
      {!isAuthPage && <Footer />}
    </AuthProvider>
  );
}

export default App;
