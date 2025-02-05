import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    // console.log("Adding to cart - Received product:", product);

    setCartItems((prevItems) => {
      // Check for an existing item with the same product_id AND storage
      const existingItem = prevItems.find(
        (item) =>
          item.product_id === product.product_id &&
          item.storage === product.storage
      );

      if (existingItem) {
        // If item exists with same product_id and storage, increment quantity
        return prevItems.map((item) =>
          item.product_id === product.product_id &&
          item.storage === product.storage
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Create a new cart item
      const newItem = {
        product_id: product.product_id,
        name: product.product_name,
        price: product.price, // Use the price passed from Product component
        image: product.product_image?.[0],
        storage: product.storage,
        quantity: 1,
      };

      // console.log("New cart item:", newItem);
      return [...prevItems, newItem];
    });
  };

  const removeFromCart = (productId, storage) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.product_id === productId && item.storage === storage)
      )
    );
  };

  const updateQuantity = (productId, storage, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId, storage);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product_id === productId && item.storage === storage
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        isCartOpen,
        toggleCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
