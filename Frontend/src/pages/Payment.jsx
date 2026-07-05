import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext'; 

function Payment() {
  // 1. Pull buyNowItem and setBuyNowItem from the context
  const { cartItems, buyNowItem, setBuyNowItem } = useCart();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  // 2. THE FIX: Determine which items we are calculating the price for!
  // If buyNowItem exists, put it in an array by itself. Otherwise, use the full cart.
  const activeItems = buyNowItem ? [buyNowItem] : cartItems;

  // Calculate totals based on the activeItems
  const subtotal = activeItems?.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0) || 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = subtotal - discountAmount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setMessage({ type: 'error', text: 'Please enter a coupon code.' });
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/coupons/validate', { code: couponCode });
      setDiscountPercent(response.data.discount);
      setMessage({ type: 'success', text: `Success! ${response.data.discount}% discount applied.` });
    } catch (error) {
      setDiscountPercent(0);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Invalid or expired coupon code.' });
    }
  };

  const handlePayment = () => {
    if (finalTotal === 0 && activeItems?.length === 0) {
      alert("No items to purchase!");
      return navigate('/');
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Payment of ₹${finalTotal.toLocaleString('en-IN')} successful!`);
      
      // 3. Clear the Buy Now state after a successful purchase so it doesn't get stuck!
      if (buyNowItem) {
        setBuyNowItem(null); 
      } else {
        // clearCart(); // If you have a clearCart function for standard cart checkouts
      }
      
      navigate('/');
    }, 2000);
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Secure Payment</h2>

      <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid var(--border-color)' }}>
        <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '15px' }}>
          Order Summary
        </h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          {/* Dynamically show if it's 1 item or the full cart */}
          <span>Subtotal ({activeItems?.length || 0} items):</span>
          <span>₹{subtotal.toLocaleString('en-IN')}</span>
        </div>

        {discountPercent > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#388e3c', fontWeight: 'bold' }}>
            <span>Discount ({discountPercent}%):</span>
            <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--border-color)', fontSize: '20px', fontWeight: 'bold' }}>
          <span>Total to Pay:</span>
          <span>₹{finalTotal.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Have a coupon code?</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Enter code here..." 
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            style={{ flex: 1, padding: '12px', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '16px', textTransform: 'uppercase' }}
          />
          <button 
            onClick={handleApplyCoupon}
            style={{ backgroundColor: '#2874f0', color: 'white', border: 'none', padding: '0 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            APPLY
          </button>
        </div>
        {message.text && (
          <p style={{ marginTop: '10px', fontSize: '14px', color: message.type === 'success' ? '#388e3c' : '#e53935', fontWeight: 'bold' }}>
            {message.text}
          </p>
        )}
      </div>

      <button 
        onClick={handlePayment}
        disabled={isProcessing}
        style={{ width: '100%', backgroundColor: '#fb641b', color: 'white', border: 'none', padding: '15px', borderRadius: '4px', fontSize: '18px', fontWeight: 'bold', cursor: isProcessing ? 'not-allowed' : 'pointer', opacity: isProcessing ? 0.7 : 1 }}
      >
        {isProcessing ? 'Processing...' : `PAY ₹${finalTotal.toLocaleString('en-IN')}`}
      </button>
    </div>
  );
}

export default Payment;