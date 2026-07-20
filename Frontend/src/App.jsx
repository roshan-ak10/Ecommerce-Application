import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import Home from './pages/Home';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Help from './pages/Help';
import './index.css';
import Admin from './pages/Admin';
import Cart from './pages/Cart';
import Navbar from './Navbar';
import SearchResults from './pages/SearchResults';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import Menu from './pages/Menu';
import Coupons from './pages/Coupon';
import Collection from './pages/Collection';
import UserOrders from './pages/UserOrders';
import AdminOrders from './pages/AdminOrders';
import { useAuth } from './context/AuthContext';
import ProductPage from './pages/ProductPage';

function AppLayout() {
  const [theme, setTheme] = useState(() => localStorage.getItem('appTheme') || 'light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  
  // --- AUTHENTICATION STATE ---
const { user, setUser } = useAuth();  

  const navigate = useNavigate();

  const AdminRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  // Define your exact admin emails here again
  const adminEmails = ["roshankrishnaraj10@gmail.com", "varshiniilango08@gmail.com"];

  if (isLoading) return <div>Loading secure environment...</div>;

  // If there's no verified user, or their verified email isn't on the list, kick them to home!
  if (!user || !adminEmails.includes(user.email)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('appTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleAccordion = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleNavigation = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

const handleLogout = async () => {
    try {
      // 1. Tell the backend to destroy the secure cookie
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Backend logout issue (you might already be logged out):", error);
    } finally {
      // 2. ALWAYS run this frontend cleanup, even if the backend request above failed
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      
      // Make sure you are using setUser from your AuthContext!
      if (typeof setUser === 'function') {
         setUser(null); 
      }
      
      setIsMenuOpen(false); // Close the sidebar
      navigate('/');        
    }
  };

  return (
    <div className="app-container">
      
      <Navbar 
        setIsMenuOpen={setIsMenuOpen} 
        theme={theme} 
        toggleTheme={toggleTheme}
      />
        
      {/* 2. SLIDE-OUT MENU */}
      <div className={`overlay ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
      
      <div className={`side-menu ${isMenuOpen ? 'open' : ''}`}>
        
        {/* --- User Profile Header --- */}
        <div style={{ 
          backgroundColor: 'var(--primary-red)', 
          margin: '-20px -20px 20px -20px', 
          padding: '30px 20px 20px 20px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px', textTransform: 'capitalize' }}>
                {user ? `Hello, ${user.name || 'User'}!` : 'Welcome, Guest'} 
              </h2>
              {user && <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>{user.email}</p>}
            </div>
            <button className="icon-btn" onClick={() => setIsMenuOpen(false)} style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
              ✕
            </button>
          </div>
        </div>
        
        <ul className="menu-list">
          <li onClick={() => handleNavigation('/')}>Home</li>
          
          {/* --- NEW: Added Account Link --- */}
          {user && <li onClick={() => handleNavigation('/profile')}>My Account</li>}
          
          <li onClick={() => handleNavigation('/cart')}>Cart</li>
          <li onClick={() => handleNavigation('/wishlist')}>Wishlist</li>
          {user && <li onClick={() => handleNavigation('/orders')}>My Orders</li>}
          
          {/* Show Admin Panel link only if they are an admin */}
          {user && ["roshankrishnaraj10@gmail.com", "varshiniilango08@gmail.com"].includes(user.email) && (
            <li onClick={() => handleNavigation('/admin')} style={{ color: 'var(--primary-red)' }}>
              Admin Panel
            </li>
          )}

          <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: '10px 0' }} />



          {/* --- Theme Toggle ---
          <li onClick={toggleTheme} style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span>🌗 Theme</span>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{theme === 'light' ? 'Light' : 'Dark'}</span>
          </li> */}
          
          <li onClick={() => handleNavigation('/help')}>Help & Support</li>
          
          {/* --- Login/Logout --- */}
          {user ? (
            <li onClick={handleLogout} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginTop: '10px', color: 'var(--primary-red)', fontWeight: 'bold', cursor: 'pointer' }}>
              Logout
            </li>
          ) : (
            <li onClick={() => handleNavigation('/login')} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginTop: '10px', color: 'var(--primary-red)', fontWeight: 'bold', cursor: 'pointer' }}>
              Login / Sign Up
            </li>
          )}
        </ul>
      </div>

      {/* 3. ROUTES */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/help" element={<Help />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/coupons" element={<Coupons />} />
          <Route path="/orders" element={<UserOrders />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/collection/:categoryName" element={<Collection />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/admin" element={
            <AdminRoute>
            <Admin />
            </AdminRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <>
      <AppLayout />
    </>
  );
}

export default App;