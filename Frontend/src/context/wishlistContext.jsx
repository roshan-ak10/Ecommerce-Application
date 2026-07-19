import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isWishlistLoaded, setIsWishlistLoaded] = useState(false);

  // 1. FETCH FROM DB
  useEffect(() => {
    if (isLoading) return;
    let cancelled = false;
    const fetchWishlist = async () => {
      if (!user) {
        if (!cancelled) {
          setWishlistItems([]);
          setIsWishlistLoaded(false);
        }
        return;
      }
      try {
        setIsWishlistLoaded(false);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/wishlist/me`,
          { withCredentials: true }
        );
        if (!cancelled) {
          setWishlistItems(response.data?.items || []);
          setIsWishlistLoaded(true);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch wishlist", error);
          setIsWishlistLoaded(true);
        }
      }
    };
    fetchWishlist();
    return () => { cancelled = true; };
  }, [user, isLoading]);

  // 2. SYNC TO DB
  useEffect(() => {
    if (!isWishlistLoaded || !user) return;

    const syncWishlistToDB = async () => {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/wishlist/sync`,
          { items: wishlistItems },
          { withCredentials: true }
        );
      } catch (error) {
        console.error("Failed to sync wishlist", error);
      }
    };
    syncWishlistToDB();
  }, [wishlistItems, user, isWishlistLoaded]);

  // 3. HELPER FUNCTIONS
  const isFavorited = (productId) => {
    return wishlistItems?.some(item => item._id === productId);
  };

  const toggleWishlist = (product) => {
    if (!user) {
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