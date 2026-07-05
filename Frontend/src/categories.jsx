import React, { useState, useEffect } from 'react';

// Accept the selected category and the function to change it as props
function Categories({ selectedCategory, onSelectCategory }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { name: 'All', icon: '🛍️' }, // Added an 'All' option
    { name: 'Mobiles', icon: '📱' },
    { name: 'Laptops', icon: '💻' },
    { name: 'Electronics', icon: '🔌' },
    { name: 'Fashion', icon: '👕' },
    { name: 'Home Appliances', icon: '📺' },
    { name: 'Grocery', icon: '🛒' }
  ];

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    padding: isScrolled ? '10px 20px' : '20px', 
    backgroundColor: 'var(--bg-color)', 
    overflowX: 'auto',
    transition: 'padding 0.3s ease' 
  };

  return (
    <div style={containerStyle}>
      {categories.map((cat, index) => {
        // Check if this card is the currently selected one
        const isActive = selectedCategory === cat.name;

        return (
          <div
            key={index}
            // Trigger the filter when clicked
            onClick={() => onSelectCategory(cat.name)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              padding: isScrolled ? '5px 15px' : '10px 15px',
              minWidth: '90px',
              backgroundColor: 'transparent',
              borderRadius: '12px',
              transition: 'all 0.2s ease-in-out',
              // Add a subtle highlight to the active category
              borderBottom: isActive ? '3px solid #2874f0' : '3px solid transparent',
              color: isActive ? '#2874f0' : 'var(--text-main)',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {!isScrolled && (
              <span style={{ fontSize: '28px', marginBottom: '8px', transition: 'all 0.3s ease' }}>
                {cat.icon}
              </span>
            )}
            
            <span style={{ fontSize: '14px', fontWeight: isActive ? 'bold' : '600' }}>
              {cat.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default Categories;