import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();


export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [buyNowItem, setBuyNowItem] = useState(null);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('redkart_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('redkart_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item._id === product._id);
      if (existingItem) {
        return prevItems.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // --- NEW: Function to increase or decrease quantity ---
  const updateQuantity = (productId, amount) => {
    setCartItems((prevItems) => {
      return prevItems.map(item => {
        if (item._id === productId) {
          // Math.max prevents the quantity from ever dropping below 1
          const newQuantity = Math.max(1, item.quantity + amount);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  // --- NEW: Function to completely remove an item ---
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item._id !== productId));
  };

  // Make sure to expose the new functions at the bottom!
  return (
    <CartContext.Provider value={{ cartItems, addToCart, buyNowItem , setBuyNowItem , updateQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};