import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiUser, FiHeart, FiPackage, FiTag, FiLogOut, FiChevronRight } from 'react-icons/fi';

function Menu() {
  const navigate = useNavigate();
  const authUser = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  // Shared styling for the links to keep the code clean
  const linkStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    textDecoration: 'none',
    color: 'var(--text-main)',
    borderBottom: '1px solid var(--border-color)',
    fontSize: '16px',
    transition: 'background-color 0.2s',
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', minHeight: '80vh', backgroundColor: 'var(--bg-color)' }}>
      
      {/* Profile Header inside the Menu */}
      <div style={{ padding: '30px 20px', backgroundColor: '#474849', color: 'white', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#2874f0' }}>
          <FiUser size={30} />
        </div>
        <div>
          <h2 style={{ margin: '0', fontSize: '20px' }}>{authUser ? `Hi, ${authUser.split(' ')[0]}` : 'Welcome!'}</h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: '0.9' }}>
            {authUser ? 'Manage your account' : 'Login to view your details'}
          </p>  
        </div>
      </div>

      {/* Menu Options */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        
        <Link to="/" style={linkStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--border-color)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><FiHome size={20} /> Home</div>
          <FiChevronRight size={18} color="var(--text-muted)" />
        </Link>
        
        <Link to="/profile" style={linkStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--border-color)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><FiUser size={20} /> My Profile</div>
          <FiChevronRight size={18} color="var(--text-muted)" />
        </Link>

        <Link to="/orders" style={linkStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--border-color)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><FiPackage size={20} /> My Orders</div>
          <FiChevronRight size={18} color="var(--text-muted)" />
        </Link>

        <Link to="/wishlist" style={linkStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--border-color)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><FiHeart size={20} /> Wishlist</div>
          <FiChevronRight size={18} color="var(--text-muted)" />
        </Link>

        <Link to="/coupons" style={linkStyle} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--border-color)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><FiTag size={20} /> Coupons & Offers</div>
          <FiChevronRight size={18} color="var(--text-muted)" />
        </Link>

        {/* Dynamic Login/Logout Button at the bottom */}
        {authUser ? (
          <button 
            onClick={handleLogout} 
            style={{ ...linkStyle, border: 'none', background: 'transparent', cursor: 'pointer', color: '#e53935', marginTop: '20px' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ffebee'} 
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><FiLogOut size={20} /> Logout</div>
          </button>
        ) : (
          <Link 
            to="/login" 
            style={{ ...linkStyle, border: 'none', color: '#2874f0', marginTop: '20px' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e3f2fd'} 
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><FiUser size={20} /> Login / Sign Up</div>
          </Link>
        )}

      </div>
    </div>
  );
}

export default Menu;    