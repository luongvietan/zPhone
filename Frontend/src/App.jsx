import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Cart from "./components/Cart";
import Navibar from "./components/Navibar";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import { Product } from "./pages/Product";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPwd from "./pages/ForgotPwd";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Checkout from "./pages/Checkout";
import Payment from "./components/Payment";
import VNPayReturn from "./pages/VNPayReturn";
import OrderSuccess from "./pages/OrderSuccess";

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
          <Navibar />
          <Cart />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/product/:product_id" element={<Product />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recovery" element={<ForgotPwd />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/vnpay-return" element={<VNPayReturn />} />
            <Route path="/order-success" element={<OrderSuccess />} />
          </Routes>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
