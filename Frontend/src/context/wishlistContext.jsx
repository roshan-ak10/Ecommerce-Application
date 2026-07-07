import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isWishlistLoaded, setIsWishlistLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('userEmail'));

  // 1. DEFINE THE FUNCTION FIRST
  const isFavorited = (productId) => {
    return wishlistItems?.some(item => item._id === productId);
  };

  // 2. TOGGLE FUNCTION
  const toggleWishlist = (product) => {
    if (!currentUser) {
      alert("Please login to save items to your wishlist!");
      return;
    }
    setWishlistItems((prevItems) => {
      const exists = prevItems.find(item => item._id === product._id);
      if (exists) {
        return prevItems.filter(item => item._id !== product._id);
      } else {
        return [...prevItems, { 
          _id: product._id, 
          name: product.name, 
          price: product.price, 
          image: product.image 
        }];
      }
    });
  };

  // ... (Keep your useEffects for fetchWishlist and syncWishlist here) ...

  // 3. PROVIDE THE VALUES
  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isFavorited }}>
      {children}
    </WishlistContext.Provider>
  );
};