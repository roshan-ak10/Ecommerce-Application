import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiSearch } from 'react-icons/fi';
import { useCart } from './context/CartContext'; // Connects your cart badge

// We pass setIsMenuOpen as a prop in case you have a sidebar menu in App.jsx
function Navbar({ setIsMenuOpen , theme, toggleTheme}) {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  // 1. Check if user is logged in
  const authUser = localStorage.getItem('userName');

  // 2. Calculate the dynamic cart total
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  // 4. Logout Logic
  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <nav className="navbar">
    {/* 1. TOP NAVIGATION BAR */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Only trigger if the prop was passed */}
        <button className="icon-btn" onClick={() => setIsMenuOpen && setIsMenuOpen(true)}>
          <FiMenu />
        </button>
        <div className="logo" style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-red)' }}>
          RedKart
        </div>
      </div>

      
        <form className="search-container" onSubmit={handleSearch}>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search for products, brands and more..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update state as they type
        />
        <button className="search-btn"><FiSearch size={20} /></button>
        </form>
      
      <ul className="nav-links">
        <li><Link to="/" className="nav-link">Shop</Link></li>
        <li>
          <Link to="/cart" className="nav-link">
            🛒Cart 
            {/* Dynamic Cart Badge */}
            <span style={{ backgroundColor: 'var(--primary-red, #e53935)', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '12px', marginLeft: '4px' }}>
              {totalItems}
            </span>
          </Link>
        </li>
        <li><Link to="/profile" className="nav-link">Profile</Link></li>
        
        {/* --- NAVBAR LOGIN/LOGOUT BUTTON --- */}
        {authUser ? (
          <li style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ color: 'var(--primary-red)', fontWeight: 'bold' }}>Hi, {authUser.split(' ')[0]}</span>
            <button onClick={handleLogout} className="btn-primary" style={{ padding: '8px 15px', margin:'2px' ,  width: 'auto', backgroundColor: 'transparent', border: '1px solid var(--primary-red)', color: 'var(--primary-red)' }}>
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
          <button onClick={toggleTheme} className="theme-toggle-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;