import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Checkout() {
  const navigate = useNavigate();
  
  // Pre-fill with the address from Profile if it exists
  const [address, setAddress] = useState({
    fullName: '', phone: '', street: '', city: '', state: '', zip: ''
  });

  useEffect(() => {
    const savedAddress = JSON.parse(localStorage.getItem('userAddress'));
    if (savedAddress) setAddress(savedAddress);
  }, []);

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    // Save/Update the address just in case they changed it here
    localStorage.setItem('userAddress', JSON.stringify(address));
    // Move to payment page
    navigate('/payment');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h2>Checkout - Delivery Details</h2>
      
      <div style={{ backgroundColor: 'var(--bg-color)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '20px' }}>
        <form onSubmit={handleProceedToPayment} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" name="fullName" placeholder="Full Name" value={address.fullName} onChange={handleChange} required className="search-input" style={{ border: '1px solid #ccc' }} />
          <input type="tel" name="phone" placeholder="Phone Number" value={address.phone} onChange={handleChange} required className="search-input" style={{ border: '1px solid #ccc' }} />
          <textarea name="street" placeholder="Street Address" value={address.street} onChange={handleChange} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px', fontFamily: 'inherit' }} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="text" name="city" placeholder="City" value={address.city} onChange={handleChange} required className="search-input" style={{ border: '1px solid #ccc' }} />
            <input type="text" name="state" placeholder="State" value={address.state} onChange={handleChange} required className="search-input" style={{ border: '1px solid #ccc' }} />
            <input type="text" name="zip" placeholder="Zip" value={address.zip} onChange={handleChange} required className="search-input" style={{ border: '1px solid #ccc' }} />
          </div>

          <button type="submit" className="add-to-cart-modern" style={{ marginTop: '20px', padding: '15px', fontSize: '16px' }}>
            Confirm & Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;