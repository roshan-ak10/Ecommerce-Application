import React from 'react';

function Categories() {
  const categories = [
    { name: 'Mobiles', icon: '📱' },
    { name: 'Laptops', icon: '💻' },
    { name: 'Electronics', icon: '🔌' },
    { name: 'Fashion', icon: '👕' },
    { name: 'Home Appliances', icon: '📺' },
    { name: 'Grocery', icon: '🛒' }
  ];

  // We completely removed the 'theme' prop and 'isDark' logic!
  
  const containerStyle = {
    margin:'0px',
    padding:"0px",
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    // 1. Use your global background color variable
    backgroundColor: 'var(--bg-color)', 
    // 2. Use your global border color variable
    borderBottom: '1px solid var(--border-color)'
  };

  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '10px 15px',
    minWidth: '90px',
    // 3. Set card background to transparent so it naturally matches the theme
    backgroundColor: 'transparent',
    borderRadius: '12px',
    // 4. Use your global text color variable
    color: 'var(--text-main)',
    transition: 'transform 0.2s ease-in-out'
  };

  return (
    <div style={containerStyle}>
      {categories.map((cat, index) => (
        <div
          key={index}
          style={cardStyle}
          // The hover animation stays exactly the same
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <span style={{ fontSize: '28px', marginBottom: '8px' }}>
            {cat.icon}
          </span>
          <span style={{ fontSize: '14px', fontWeight: '600' }}>
            {cat.name}
          </span>
        </div>
      ))}
    </div>
  );
}

export default Categories;