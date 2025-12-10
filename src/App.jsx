import { Routes, Route, useLocation } from "react-router-dom";

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
import ProductDetail from "./pages/ProductDetail";
import LaptopDetail from "./pages/LaptopDetail";

// Auth
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ForgetPassword from "./components/Auth/ForgetPassword";
import ResetPassword from "./components/Auth/ResetPassword";

// Buyer
import BuyerChatList from "./pages/Buyer/BuyerChatList";
import BuyerChatThread from "./pages/Buyer/BuyerChatThread";
import BuyerLaptopChatList from "./pages/Buyer/BuyerLaptopChatList";
import LaptopChat from "./pages/LaptopChat";
import Profile from "./components/Profile";

// Seller
import Dashboard from "./pages/Dashboard";
import SellProducts from "./pages/Seller/SellProducts";
import SellerChatList from "./components/Chat/SellerChatList";
import SellerChatThread from "./components/Chat/SellerChatThread";
import SellerLaptopChatList from "./pages/Seller/SellerLaptopChatList";
import SellerLaptopChatThread from "./pages/Seller/SellerLaptopChatThread";
import SellerRequestList from "./components/Chat/SellerRequestList";

export default function App() {
  const location = useLocation();
  const isAuthPage = ["/login", "/register", "/forget-password"].includes(
    location.pathname
  );

  return (
    <>
      {!isAuthPage && <Navbar />}

      <div className="min-h-screen pb-16 md:pb-0">
        <Routes>
          {/* PUBLIC */}
          <Route
            path="/"
            element={
              <RoleBasedRoute public>
                <Home />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/buy/products"
            element={
              <RoleBasedRoute public>
                <BuyProducts />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/buy/cars"
            element={
              <RoleBasedRoute public>
                <BuyCars />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/buy/bikes"
            element={
              <RoleBasedRoute public>
                <BuyBikes />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/buy/mobiles"
            element={
              <RoleBasedRoute public>
                <BuyMobiles />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/buy/laptops"
            element={
              <RoleBasedRoute public>
                <BuyLaptops />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <RoleBasedRoute public>
                <ProductDetail />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/laptop/:id"
            element={
              <RoleBasedRoute public>
                <LaptopDetail />
              </RoleBasedRoute>
            }
          />

          {/* BUYER */}
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

          {/* SELLER */}
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

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>

      {!isAuthPage && <BottomBar />}
      {!isAuthPage && <Footer />}
    </>
  );
}
