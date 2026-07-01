// src/pages/Help.jsx
import React from 'react';

function Help() {
  return (
    <div style={{ marginTop: '20px' }}>
      <div className="card">
        <h2 style={{ marginBottom: '15px', color: 'var(--primary-red)' }}>Help & Support</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: 'var(--text-main)' }}>Track Your Order</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Enter your order ID to check the current status.</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', maxWidth: '300px' }}>
            <input type="text" className="search-input" placeholder="Order ID" style={{ border: '1px solid var(--border-color)' }} />
            <button className="btn-primary" style={{ width: 'auto' }}>Track</button>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ color: 'var(--text-main)' }}>Frequently Asked Questions</h4>
          <ul style={{ color: 'var(--text-muted)', fontSize: '14px', marginLeft: '20px', marginTop: '10px' }}>
            <li>How do I return an item?</li>
            <li>What are the delivery charges?</li>
            <li>How do I contact customer care?</li>
          </ul>
        </div>

        <button className="btn-primary" style={{ width: 'auto' }}>Contact Support</button>
      </div>
    </div>
  );
}

export default Help;