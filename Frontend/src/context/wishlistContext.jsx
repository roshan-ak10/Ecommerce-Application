import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Create the Context
const WishlistContext = createContext();

// 2. Create the Provider Component
export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  
  // Get the logged-in user's email from localStorage
  const userEmail = localStorage.getItem('userEmail');

  // Fetch the wishlist from the database whenever the user logs in or the app loads
  useEffect(() => {
    if (userEmail) {
      fetchWishlist();
    } else {
      setWishlistItems([]); // Clear wishlist if logged out
    }
  }, [userEmail]);

  // Function to get the latest wishlist data from MongoDB
  const fetchWishlist = async () => {
    try {
      console.log("Fetching wishlist for:", userEmail);
      const response = await axios.get(`http://localhost:5000/api/wishlist?email=${userEmail}`);
      
      console.log("Wishlist data received from backend:", response.data);
      setWishlistItems(response.data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  // Function to add or remove an item using the MongoDB _id
  const toggleWishlist = async (product) => {
    if (!userEmail) {
      alert("Please login to add items to your wishlist!");
      return;
    }

    // DIAGNOSTIC LOG: See exactly what we are trying to send
    console.log("Toggling product:", { 
      name: product.name, 
      id: product._id, 
      userEmail: userEmail 
    });
    
    try {
      // Send the request to your backend controller
      const response = await axios.post('http://localhost:5000/api/wishlist/toggle', {
        userEmail: userEmail,
        productId: product._id // Using the automatic MongoDB ID
      });

      console.log("Backend response after toggle:", response.data);
      
      // Fetch the updated list so the UI changes instantly
      fetchWishlist();
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  // Helper function for the Heart buttons to check if they should be filled or empty
  const isFavorited = (productId) => {
    // Safety check in case wishlistItems is undefined
    if (!wishlistItems || !Array.isArray(wishlistItems)) return false;
    
    return wishlistItems.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isFavorited, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

// 3. Export a custom hook to make it easy to use in other components
export const useWishlist = () => useContext(WishlistContext);