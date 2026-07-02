import React, { useState } from 'react';
// Import your existing Wishlist component from the same directory
import Wishlist from './Wishlist'; 

function Profile() {
  const [activeTab, setActiveTab] = useState('account'); // 'account' or 'wishlist'
  
  const userName = localStorage.getItem('userName') || 'User';
  const userEmail = localStorage.getItem('userEmail') || 'Not Available';

  // Inline styles for tabs
  const tabStyle = (tabName) => ({
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    borderBottom: activeTab === tabName ? '3px solid var(--primary-red, #e53935)' : '3px solid transparent',
    color: activeTab === tabName ? 'var(--primary-red, #e53935)' : '#666'
  });

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
      {/* Tab Header Navigation */}
      <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #e0e0e0', marginBottom: '20px' }}>
        <div style={tabStyle('account')} onClick={() => setActiveTab('account')}>My Account</div>
        <div style={tabStyle('wishlist')} onClick={() => setActiveTab('wishlist')}>💖 My Wishlist</div>
      </div>

      {/* Tab Content Rendering */}
      {activeTab === 'account' ? (
        <div className="card" style={{ padding: '30px' }}>
          <h2>Account Details</h2>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p><strong>Name:</strong> {userName}</p>
            <p><strong>Email:</strong> {userEmail}</p>
          </div>
        </div>
      ) : (
        <div>
          {/* Directly renders your pre-built Wishlist code inside this panel */}
          <Wishlist />
        </div>
      )}
    </div>
  );
}

export default Profile;