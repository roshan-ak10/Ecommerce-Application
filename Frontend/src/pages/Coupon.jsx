import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/coupons/active');
        setCoupons(response.data);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000); // Reset after 2 seconds
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Exclusive Offers & Coupons</h2>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading latest deals...</p>
      ) : coupons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
          <p>No active coupons at the moment. Check back later!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {coupons.map((coupon) => (
            <div 
              key={coupon._id} 
              style={{ 
                border: '2px dashed #ff9f00', 
                borderRadius: '8px', 
                padding: '20px', 
                backgroundColor: 'var(--bg-secondary)',
                textAlign: 'center'
              }}
            >
              <h3 style={{ color: '#ff9f00', fontSize: '28px', margin: '0 0 10px 0' }}>
                {coupon.discountPercentage}% OFF
              </h3>
              <p style={{ color: 'var(--text-main)', marginBottom: '20px' }}>
                {coupon.description}
              </p>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                backgroundColor: 'var(--bg-main)',
                padding: '10px 15px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)'
              }}>
                <strong style={{ letterSpacing: '2px', fontSize: '18px' }}>{coupon.code}</strong>
                <button 
                  onClick={() => handleCopyCode(coupon.code)}
                  style={{
                    backgroundColor: copiedCode === coupon.code ? '#4caf50' : '#2874f0',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: '0.2s'
                  }}
                >
                  {copiedCode === coupon.code ? 'COPIED!' : 'COPY'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Coupons;