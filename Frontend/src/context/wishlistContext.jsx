import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isWishlistLoaded, setIsWishlistLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('userEmail'));

  // Sync user from storage
  useEffect(() => {
    const syncUser = () => setCurrentUser(localStorage.getItem('userEmail'));
    window.addEventListener('storage', syncUser);
    window.addEventListener('userChanged', syncUser);
    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('userChanged', syncUser);
    };
  }, []);

  // 1. FETCH FROM DB
  useEffect(() => {
    let cancelled = false;
    const fetchWishlist = async () => {
      if (!currentUser) {
        setWishlistItems([]);
        setIsWishlistLoaded(false);
        return;
      }
      try {
        setIsWishlistLoaded(false);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/wishlist/${encodeURIComponent(currentUser)}`);
        if (!cancelled) {
          setWishlistItems(response.data?.items || []);
          setIsWishlistLoaded(true);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist", error);
        setIsWishlistLoaded(true);
      }
    };
    fetchWishlist();
    return () => { cancelled = true; };
  }, [currentUser]);

  // 2. SYNC TO DB
  useEffect(() => {
    if (!isWishlistLoaded || !currentUser) return;

    const syncWishlistToDB = async () => {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/wishlist/sync`, {
          email: currentUser,
          items: wishlistItems
        });
      } catch (error) {
        console.error("Failed to sync wishlist", error);
      }
    };
    syncWishlistToDB();
  }, [wishlistItems, currentUser, isWishlistLoaded]);

  // 3. HELPER FUNCTIONS
  const isFavorited = (productId) => {
    return wishlistItems?.some(item => item._id === productId);
  };

  const toggleWishlist = (product) => {
    if (!currentUser) {
      alert("Please login to save items to your wishlist!");
      return;
    }
    setWishlistItems((prevItems) => {
      const exists = prevItems.find(item => item._id === product._id);
      return exists 
        ? prevItems.filter(item => item._id !== product._id) 
        : [...prevItems, { _id: product._id, name: product.name, price: product.price, image: product.image }];
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isFavorited }}>
      {children}
    </WishlistContext.Provider>
  );
};