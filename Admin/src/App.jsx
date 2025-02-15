import React, { useState } from "react";
import ProductList from "./pages/ProductList.jsx";
import AddProduct from "./components/AddProduct.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import User from "./pages/User.jsx";

const App = () => {
  const [refresh, setRefresh] = useState(false);

  const handleProductAdded = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<AddProduct onProductAdded={handleProductAdded} />}
        />
        <Route path="/list" element={<ProductList refresh={refresh} />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </div>
  );
};

export default App;
