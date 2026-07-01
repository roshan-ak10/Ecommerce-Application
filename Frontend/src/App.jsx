import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { FiMenu, FiSearch, FiX, FiFilter, FiSettings, FiLogIn, FiLogOut, FiHelpCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Help from './pages/Help';
import './index.css';
import Admin from './pages/Admin';

function AppLayout() {
  const [theme, setTheme] = useState(() => localStorage.getItem('appTheme') || 'light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  
  // --- AUTHENTICATION STATE ---
  // This checks if a user is currently logged in by checking local storage
  const [authUser, setAuthUser] = useState(localStorage.getItem('userName')); 
  
  const navigate = useNavigate();

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
    await axios.post(`${import.meta.env.VITE_API_URL}/api/users/logout`, {}, { withCredentials: true });
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail'); // ADD THIS
    setAuthUser(null);
    setIsMenuOpen(false);
    navigate('/');
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

  return (
    <div className="app-container">
      
      {/* 1. TOP NAVIGATION BAR */}
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button className="icon-btn" onClick={() => setIsMenuOpen(true)}>
            <FiMenu />
          </button>
          <div className="logo" style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-red)' }}>
            RedKart
          </div>
        </div>

        <div className="search-container">
          <input type="text" className="search-input" placeholder="Search for products, brands and more..." />
          <button className="search-btn"><FiSearch size={20} /></button>
        </div>
        
        <ul className="nav-links">
          <li><Link to="/" className="nav-link">Shop</Link></li>
          <li><Link to="/wishlist" className="nav-link">Wishlist</Link></li>
          <li><Link to="/profile" className="nav-link">Profile</Link></li>
          
          {/* --- NAVBAR LOGIN/LOGOUT BUTTON --- */}
          {authUser ? (
            <li style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ color: 'var(--primary-red)', fontWeight: 'bold' }}>Hi, {authUser.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn-primary" style={{ padding: '8px 15px', width: 'auto', backgroundColor: 'transparent', border: '1px solid var(--primary-red)', color: 'var(--primary-red)' }}>
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 15px', display: 'inline-block' }}>
                Login / Sign Up
              </Link>
            </li>
          )}

          <li>
            <button onClick={toggleTheme} className="theme-toggle-btn">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </li>
        </ul>
      </nav>

      {/* 2. SLIDE-OUT MENU */}
      <div className={`overlay ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
      
      <div className={`side-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <h2>Menu</h2>
          <button className="icon-btn" onClick={() => setIsMenuOpen(false)}><FiX /></button>
        </div>
        
        <ul className="menu-list">
          <li className="menu-item-container">
            <div className="menu-item-header" onClick={() => handleAccordion('filters')}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><FiFilter /> Filters</span>
              {expandedSection === 'filters' ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            
            {expandedSection === 'filters' && (
              <div className="sub-menu">
                <p style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>Brand</p>
                <label><input type="checkbox" /> Asus</label>
                <label><input type="checkbox" /> Sony</label>
                <label><input type="checkbox" /> Nike</label>
                <button className="btn-primary" style={{ marginTop: '15px', padding: '8px' }} onClick={() => setIsMenuOpen(false)}>
                  Find Products
                </button>
              </div>
            )}
          </li>

          <li><FiSettings /> Settings</li>
          <li onClick={() => handleNavigation('/help')}><FiHelpCircle /> Help & Support</li>
          
          {/* --- SIDE MENU LOGIN/LOGOUT BUTTON --- */}
          {authUser ? (
            <li onClick={handleLogout} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginTop: '10px', color: 'var(--primary-red)', fontWeight: 'bold', cursor: 'pointer' }}>
              <FiLogOut style={{ marginRight: '10px' }} /> Logout
            </li>
          ) : (
            <li onClick={() => handleNavigation('/login')} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginTop: '10px', color: 'var(--primary-red)', fontWeight: 'bold', cursor: 'pointer' }}>
              <FiLogIn style={{ marginRight: '10px' }} /> Login / Sign Up
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
          
          {/* We pass setAuthUser down to Login so it can instantly update the UI when someone logs in */}
          <Route path="/login" element={<Login setAuthUser={setAuthUser} />} />
          <Route 
  path="/admin" 
  element={
    ['roshankrishnaraj10@gmail.com', 'varshiniilango08@gmail.com'].includes(localStorage.getItem('userEmail')) ? (
      <Admin />
    ) : (
      <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-main)' }}>
        <h1>403 - Access Denied</h1>
        <p>You are not authorized to view this page.</p>
        <br></br>
        <Link to="/" className="btn-primary" style={{ padding: '10px 20px' }}>Return Home</Link>
      </div>
    )
  } 
/>
</Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;