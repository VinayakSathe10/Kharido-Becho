import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BuyCars from './pages/BuyCars'; 
import BuyBikes from './pages/BuyBikes';
import BuyMobiles from './pages/BuyMobiles';
import BuyLaptops from './pages/BuyLaptops';
import SellProducts from './pages/SellProducts';
import Dashboard from './pages/Dashboard';
import Login from './components/Auth/Login ';
import Register from './components/Auth/Register';
import ForgetPassword from './components/Auth/ForgetPassword';

function App() {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/forget-password'].includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Navbar />}
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sellfrom" element={<SellProducts />} />
          <Route path="/buy/cars" element={<BuyCars />} />
          <Route path="/buy/bikes" element={<BuyBikes />} />
          <Route path="/buy/mobiles" element={<BuyMobiles />} />
          <Route path="/buy/laptops" element={<BuyLaptops />} />
        </Routes>
      </div>
      {!isAuthPage && <Footer />}
    </>
  );
}

export default App;
