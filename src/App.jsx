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
import Home from "./pages/Home";
import BuyCars from "./pages/Buyer/BuyCars";
import BuyBikes from "./pages/Buyer/BuyBikes";
import BuyMobiles from "./pages/Buyer/BuyMobiles";
import BuyLaptops from "./pages/Buyer/BuyLaptops";
import BuyProducts from "./pages/Buyer/BuyProducts";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import ProductDetail from "./pages/ProductDetail";
import LaptopDetail from "./pages/LaptopDetail";

// Auth pages
import Login from "./components/Auth/Login ";
import Register from "./components/Auth/Register";
import ForgetPassword from "./components/Auth/ForgetPassword";
import ResetPassword from "./components/Auth/ResetPassword";

// Buyer general chat
import BuyerChatList from "./pages/Buyer/BuyerChatList";
import BuyerChatThread from "./pages/Buyer/BuyerChatThread";

// Seller general chat
import SellerChatList from "./components/Chat/SellerChatList";
import SellerChatThread from "./components/Chat/SellerChatThread";
import SellerRequestList from "./components/Chat/SellerRequestList";

// Dashboard + sell
import Dashboard from "./pages/Dashboard";
import SellProducts from "./pages/Seller/SellProducts";

// Profile
import Profile from "./components/Profile";

// Laptop Chat
import LaptopChat from "./pages/LaptopChat";
import BuyerLaptopChatList from "./pages/Buyer/BuyerLaptopChatList";
import SellerLaptopChatList from "./pages/Seller/SellerLaptopChatList";
import SellerLaptopChatThread from "./pages/Seller/SellerLaptopChatThread";

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

          <Route
            path="/buyer/laptop-chats"
            element={
              <ProtectedRoute requiredRole="BUYER">
                <BuyerLaptopChatList />
              </ProtectedRoute>
            }
          />

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

          {/* SELL PRODUCT PAGE */}
          <Route
            path="/sellfrom"
            element={
              <ProtectedRoute requiredRole="SELLER">
                <SellProducts />
              </ProtectedRoute>
            }
          />

          {/* ---------------------------------------
                SELL PRODUCT EDIT ROUTES (ADDED)
          ---------------------------------------- */}
          <Route
            path="/sell-laptop/:id"
            element={
              <ProtectedRoute requiredRole="SELLER">
                <SellProducts type="laptop" mode="edit" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sell-bike/:id"
            element={
              <ProtectedRoute requiredRole="SELLER">
                <SellProducts type="bike" mode="edit" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sell-car/:id"
            element={
              <ProtectedRoute requiredRole="SELLER">
                <SellProducts type="car" mode="edit" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sell-mobile/:id"
            element={
              <ProtectedRoute requiredRole="SELLER">
                <SellProducts type="mobile" mode="edit" />
              </ProtectedRoute>
            }
          />

          {/* Seller Chats */}
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

          <Route
            path="/seller/chat/laptops"
            element={
              <ProtectedRoute requiredRole="SELLER">
                <SellerLaptopChatList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/seller/chat/laptop/:bookingId"
            element={
              <ProtectedRoute requiredRole="SELLER">
                <SellerLaptopChatThread />
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
