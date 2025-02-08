import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ShopContextProvider from "./context/ShopContext.jsx";
import { CartContext, CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <ShopContextProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ShopContextProvider>
    </AuthProvider>
  </BrowserRouter>
);
