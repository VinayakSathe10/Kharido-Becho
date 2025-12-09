/**
 * App.jsx - Main Application Router
 */

import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import BottomBar from "./components/Layout/BottomBar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";

// Public pages
import Home from "./hooks/pages/Home";
import BuyCars from "./hooks/pages/BuyCars";
import BuyBikes from "./hooks/pages/BuyBikes";
import BuyMobiles from "./hooks/pages/BuyMobiles";
import BuyLaptops from "./hooks/pages/BuyLaptops";
import BuyProducts from "./hooks/pages/BuyProducts";
import Contact from "./hooks/pages/Contact";
import Services from "./hooks/pages/Services";
import ProductDetail from "./hooks/pages/ProductDetail";
import LaptopDetail from "./hooks/pages/LaptopDetail";

// Auth pages
import Login from "./components/Auth/Login ";
import Register from "./components/Auth/Register";
import ForgetPassword from "./components/Auth/ForgetPassword";
import ResetPassword from "./components/Auth/ResetPassword";

// Buyer general chat
import BuyerChatList from "./hooks/pages/BuyerChatList";
import BuyerChatThread from "./hooks/pages/BuyerChatThread";

// Seller general chat
import SellerChatList from "./components/SellerChatList";
import SellerChatThread from "./components/SellerChatThread";
import SellerRequestList from "./components/SellerRequestList";

// Dashboard + sell
import Dashboard from "./hooks/pages/Dashboard";
import SellProducts from "./hooks/pages/SellProducts";

// Profile
import Profile from "./components/Profile";

// ⭐ NEW — Laptop Chat Pages (Buyer + Seller)
import LaptopChat from "./hooks/pages/LaptopChat";
import BuyerLaptopChatList from "./hooks/pages/BuyerLaptopChatList";
import SellerLaptopChatList from "./hooks/pages/SellerLaptopChatList";
import SellerLaptopChatThread from "./hooks/pages/SellerLaptopChatThread";

function App() {
  const location = useLocation();
  const isAuthPage = ["/login", "/register", "/forget-password"].includes(
    location.pathname
  );

  return (
    <AuthProvider>
      {!isAuthPage && <Navbar />}

      <div className="min-h-screen pb-16 md:pb-0">
        <Routes>
          {/* ---------------------------------------
                PUBLIC ROUTES
          ---------------------------------------- */}
          <Route
            path="/"
            element={
              <RoleBasedRoute public={true}>
                <Home />
              </RoleBasedRoute>
            }
          />

          <Route
            path="/buy/products"
            element={
              <RoleBasedRoute public={true}>
                <BuyProducts />
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

          <Route
            path="/product/:id"
            element={
              <RoleBasedRoute public={true}>
                <ProductDetail />
              </RoleBasedRoute>
            }
          />

          <Route
            path="/laptop/:id"
            element={
              <RoleBasedRoute public={true}>
                <LaptopDetail />
              </RoleBasedRoute>
            }
          />

          {/* ---------------------------------------
                BUYER ROUTES
          ---------------------------------------- */}

          {/* Buyer general chat */}
          <Route
            path="/buyer/chat"
            element={
              <ProtectedRoute requiredRole="BUYER">
                <BuyerChatList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/buyer/chat/:id"
            element={
              <ProtectedRoute requiredRole="BUYER">
                <BuyerChatThread />
              </ProtectedRoute>
            }
          />

          {/* Buyer laptop chat list */}
          <Route
            path="/buyer/laptop-chats"
            element={
              <ProtectedRoute requiredRole="BUYER">
                <BuyerLaptopChatList />
              </ProtectedRoute>
            }
          />

          {/* Buyer laptop chat thread */}
          <Route
            path="/chat/laptop/:bookingId"
            element={
              <ProtectedRoute requiredRole="BUYER">
                <LaptopChat />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute requiredRole="BUYER">
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* ---------------------------------------
                SELLER ROUTES
          ---------------------------------------- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="SELLER">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* SELL PAGES */}
          <Route
            path="/sellfrom"
            element={
              <ProtectedRoute requiredRole="SELLER">
                <SellProducts />
              </ProtectedRoute>
            }
          />

          {/* Seller general chat */}
          <Route
            path="/seller/chat"
            element={
              <ProtectedRoute requiredRole="SELLER">
                <SellerChatList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/seller/chat/:id"
            element={
              <ProtectedRoute requiredRole="SELLER">
                <SellerChatThread />
              </ProtectedRoute>
            }
          />

          {/* Seller Laptop Chat List */}
          <Route
            path="/seller/chat/laptops"
            element={
              <ProtectedRoute requiredRole="SELLER">
                <SellerLaptopChatList />
              </ProtectedRoute>
            }
          />

          {/* Seller Laptop Chat Thread */}
          <Route
            path="/seller/chat/laptop/:bookingId"
            element={
              <ProtectedRoute requiredRole="SELLER">
                <SellerLaptopChatThread />
              </ProtectedRoute>
            }
          />

          {/* Seller request list */}
          <Route
            path="/seller/requests"
            element={
              <ProtectedRoute requiredRole="SELLER">
                <SellerRequestList />
              </ProtectedRoute>
            }
          />

          {/* ---------------------------------------
                AUTH ROUTES
          ---------------------------------------- */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>

      {!isAuthPage && <BottomBar />}
      {!isAuthPage && <Footer />}
    </AuthProvider>
  );
}

export default App;
