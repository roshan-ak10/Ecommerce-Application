import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';
  
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: ''
  });

  // 1. ADDED: State to toggle between View Mode and Edit Mode
  const [isEditing, setIsEditing] = useState(true);

  // Load saved address on component mount
  useEffect(() => {
    const savedAddress = JSON.parse(localStorage.getItem('userAddress'));
    if (savedAddress && savedAddress.fullName) {
      setAddress(savedAddress);
      // 2. ADDED: If they already have a saved address, hide the form!
      setIsEditing(false); 
    }
  }, []);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('userAddress', JSON.stringify(address));
    // 3. ADDED: Switch back to "View Mode" after saving
    setIsEditing(false); 
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h2>My Profile</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Welcome back, {userName}!</p>

      <div style={{ backgroundColor: 'var(--bg-color)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        
        {/* Header with dynamic Edit Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Delivery Address</h3>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)} 
              className="btn-primary" 
              style={{ padding: '6px 15px', fontSize: '14px', width: 'auto' }}
            >
              Edit Address
            </button>
          )}
        </div>
        
        <hr style={{ margin: '15px 0', borderColor: 'var(--border-color)' }} />
        
        {/* 4. TOGGLE: Show Form OR Show Details */}
        {isEditing ? (
          
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" name="fullName" placeholder="Full Name" value={address.fullName} onChange={handleChange} required className="search-input" style={{ width: '100%', border: '1px solid #ccc' }} />
            <input type="tel" name="phone" placeholder="Phone Number" value={address.phone} onChange={handleChange} required className="search-input" style={{ width: '100%', border: '1px solid #ccc' }} />
            <textarea name="street" placeholder="Street Address / Area" value={address.street} onChange={handleChange} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px', fontFamily: 'inherit' }} />
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <input type="text" name="city" placeholder="City" value={address.city} onChange={handleChange} required className="search-input" style={{ width: '100%', border: '1px solid #ccc' }} />
              <input type="text" name="state" placeholder="State" value={address.state} onChange={handleChange} required className="search-input" style={{ width: '100%', border: '1px solid #ccc' }} />
              <input type="text" name="zip" placeholder="Zip Code" value={address.zip} onChange={handleChange} required className="search-input" style={{ width: '100%', border: '1px solid #ccc' }} />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="add-to-cart-modern" style={{ width: 'auto', padding: '10px 20px' }}>
                Save Address
              </button>
              
              {/* Optional Cancel button if they already have an address and change their mind about editing */}
              {address.fullName && (
                <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '10px 20px', cursor: 'pointer', background: 'transparent', border: '1px solid #ccc', borderRadius: '4px', color: 'var(--text-main)' }}>
                  Cancel
                </button>
              )}
            </div>
          </form>

        ) : (

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '16px', color: 'var(--text-main)' }}>
            <p><strong>Name:</strong> {address.fullName}</p>
            <p><strong>Phone:</strong> {address.phone}</p>
            <p><strong>Address:</strong> {address.street}</p>
            <p><strong>City:</strong> {address.city}, {address.state}</p>
            <p><strong>Zip Code:</strong> {address.zip}</p>
          </div>

        )}

      </div>
    </div>
  );
}

export default Profile;