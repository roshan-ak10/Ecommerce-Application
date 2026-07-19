import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // When the app loads, ask the server who this user is using their secure cookie!
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
          withCredentials: true // Automatically sends the JWT cookie
        });
        
        // The server responded with real data! Set the user state.
        setUser(response.data); 
      } catch (error) {
        // Token is invalid, expired, or missing. They are definitely logged out.
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);