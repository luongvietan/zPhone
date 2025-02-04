import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Cart from "./components/Cart";
import Navibar from "./components/Navibar";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import { Product } from "./pages/Product";
import About from "./pages/About";
import Contact from "./pages/Contact";
const App = () => {
  return (
    <>
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <Navibar />
        <Cart />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/product/:product_id" element={<Product />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default App;
