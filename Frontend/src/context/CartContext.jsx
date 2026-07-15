import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [buyNowItem, setBuyNowItem] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('userEmail'));

  // --- 0. LISTEN FOR LOGIN/LOGOUT EVENTS ---
  useEffect(() => {
    const syncUser = () => setCurrentUser(localStorage.getItem('userEmail'));
    window.addEventListener('storage', syncUser);    
    window.addEventListener('userChanged', syncUser); 
    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('userChanged', syncUser);
    };
  }, []);

  // --- 1. FETCH CART FROM DATABASE ---
  useEffect(() => {
    let cancelled = false;

    const fetchCart = async () => {
      if (!currentUser) {
        if (!cancelled) {
          setCartItems([]);
          setIsCartLoaded(false);
        }
        return;
      }

      try {
        if (!cancelled) setIsCartLoaded(false); 

        // ADDED: withCredentials is REQUIRED for secure cookies!
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/cart/${encodeURIComponent(currentUser)}`,
          { withCredentials: true } 
        );

        if (!cancelled) {
          setCartItems(response.data?.items || []);
          setIsCartLoaded(true); 
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch cart from DB:", error);
          setCartItems([]);
          setIsCartLoaded(true); 
        }
      }
    };

    fetchCart();
    return () => { cancelled = true; };
  }, [currentUser]);

  // --- 2. SYNC CART TO DATABASE ---
  useEffect(() => {
    if (!isCartLoaded || !currentUser) return;

    const syncCartToDB = async () => {
      try {
        // ADDED: withCredentials is REQUIRED for secure cookies!
        await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/sync`, {
          email: currentUser, 
          items: cartItems
        }, { 
          withCredentials: true 
        });
      } catch (error) {
        console.error("Failed to sync cart to DB:", error);
      }
    };

    // ADDED DEBOUNCE: Wait 1 second before saving to stop 500 error spam!
    const timer = setTimeout(() => {
      syncCartToDB();
    }, 1000);

    return () => clearTimeout(timer);
  }, [cartItems, currentUser, isCartLoaded]);

  // --- CART FUNCTIONS ---
  const addToCart = (product) => {
    if (!currentUser) {
      window.location.href = '/login'; 
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
          return { ...item, quantity: Math.max(1, item.quantity + amount) };
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