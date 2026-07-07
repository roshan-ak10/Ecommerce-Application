import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [buyNowItem, setBuyNowItem] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // --- THE LOADING LOCK ---
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // Grab the current user (email is the unique key)
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('userEmail'));

  // --- 0. LISTEN FOR LOGIN/LOGOUT EVENTS ---
  useEffect(() => {
    const syncUser = () => setCurrentUser(localStorage.getItem('userEmail'));
    
    // Listens for changes in OTHER tabs
    window.addEventListener('storage', syncUser);    
    // Listens for custom login/logout events in THIS tab
    window.addEventListener('userChanged', syncUser); 
    
    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('userChanged', syncUser);
    };
  }, []);

  // --- 1. FETCH CART FROM DATABASE ON LOAD / LOGIN CHANGE ---
  useEffect(() => {
    let cancelled = false;

    const fetchCart = async () => {
      if (!currentUser) {
        if (!cancelled) {
          setCartItems([]);
          setIsCartLoaded(false); // Lock sync for guests
        }
        return;
      }

      try {
        if (!cancelled) setIsCartLoaded(false); // Lock sync during fetch

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/cart/${encodeURIComponent(currentUser)}`
        );

        if (!cancelled) {
          setCartItems(response.data?.items || []);
          setIsCartLoaded(true); // Unlock sync after successful fetch
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch cart from DB:", error);
          setCartItems([]);
          setIsCartLoaded(true); // Unlock so they can still use a temporary cart
        }
      }
    };

    fetchCart();

    // Cleanup function: If currentUser changes mid-fetch, cancel the old fetch
    return () => { cancelled = true; };
  }, [currentUser]);

  // --- 2. SYNC CART TO DATABASE WHENEVER IT CHANGES ---
  useEffect(() => {
    // Prevent wiping DB before initial fetch is done, and block guest syncs
    if (!isCartLoaded) return;
    if (!currentUser) return;

    const syncCartToDB = async () => {
      try {
        await axios.post('${import.meta.env.VITE_API_URL}/api/cart/sync', {
          email: currentUser, // Sending the email exactly as you updated it!
          items: cartItems
        });
      } catch (error) {
        console.error("Failed to sync cart to DB:", error);
      }
    };

    syncCartToDB();
  }, [cartItems, currentUser, isCartLoaded]);

  // --- CART FUNCTIONS ---
  const addToCart = (product) => {
    if (!currentUser) {
      window.location.href = '/cart'; // Kick guests to the login prompt
      return;
    }

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

  const updateQuantity = (productId, amount) => {
    setCartItems((prevItems) => {
      return prevItems.map(item => {
        if (item._id === productId) {
          const newQuantity = Math.max(1, item.quantity + amount);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter(item => item._id !== productId));
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      buyNowItem,
      setBuyNowItem,
      updateQuantity,
      removeFromCart
    }}>
      {children}
    </CartContext.Provider>
  );
};