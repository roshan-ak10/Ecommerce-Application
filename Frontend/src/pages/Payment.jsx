import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import QRCode from 'react-qr-code'; 

function Payment() {
  const { cartItems, buyNowItem, setBuyNowItem } = useCart();
  const navigate = useNavigate();

  // --- ⚠️ YOUR UPI DETAILS HERE ⚠️ ---
  const myUpiId = "roshankrishnaraj10@okicici"; 
  const myStoreName = "RedKart.in";
  
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  
  // New state for the user's UPI reference number
  const [utrNumber, setUtrNumber] = useState('');

  const [transactionRef] = useState(() => "TXN" + Date.now());

  const activeItems = buyNowItem ? [buyNowItem] : cartItems;
  const subtotal = activeItems?.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0) || 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = subtotal - discountAmount;

 // --- UPI QR CODE FIXES ---
  const encodedName = encodeURIComponent(myStoreName);
  const formattedAmount = finalTotal.toFixed(2);
  
  // Added the &tr= parameter to satisfy strict UPI apps!
  const upiLink = `upi://pay?pa=${myUpiId}&pn=${encodedName}&am=${formattedAmount}&cu=INR&tr=${transactionRef}`;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setMessage({ type: 'error', text: 'Please enter a coupon code.' });
      return;
    }
    try {
      const response = await axios.post('${import.meta.env.VITE_API_URL}/api/coupons/validate', { code: couponCode });
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

    if (utrNumber.length < 12) {
      alert("Please enter a valid 12-digit UTR/Reference number after paying.");
      return;
    }

    setIsProcessing(true);
    
    // Here you would normally send the order and UTR to your backend:
    // axios.post('/api/orders', { items: activeItems, total: finalTotal, utr: utrNumber })

    setTimeout(() => {
      setIsProcessing(false);
      alert(`Order Placed! We will verify UTR: ${utrNumber} and process your order soon.`);
      
      if (buyNowItem) {
        setBuyNowItem(null); 
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

      {/* --- COUPON SECTION --- */}
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

      {/* --- UPI QR CODE SECTION --- */}
      <div style={{ textAlign: 'center', marginBottom: '30px', padding: '20px', border: '2px dashed #4caf50', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '15px', color: '#4caf50' }}>Pay via UPI</h3>
        <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
          Scan this QR code with GPay, PhonePe, or Paytm to pay exactly ₹{finalTotal.toLocaleString('en-IN')}.
        </p>
        
        <div style={{ background: 'white', padding: '15px', display: 'inline-block', borderRadius: '8px', marginBottom: '20px' }}>
          <QRCode value={upiLink} size={180} />
        </div>

        <div style={{ textAlign: 'left' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
            Enter 12-Digit UTR / Reference Number after paying:
          </label>
          <input 
            type="text" 
            placeholder="e.g., 312345678901"
            value={utrNumber}
            onChange={(e) => setUtrNumber(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '16px' }}
          />
        </div>
      </div>

      <button 
        onClick={handlePayment}
        disabled={isProcessing}
        style={{ width: '100%', backgroundColor: '#fb641b', color: 'white', border: 'none', padding: '15px', borderRadius: '4px', fontSize: '18px', fontWeight: 'bold', cursor: isProcessing ? 'not-allowed' : 'pointer', opacity: isProcessing ? 0.7 : 1 }}
      >
        {isProcessing ? 'Processing...' : `Submit Order (₹${finalTotal.toLocaleString('en-IN')})`}
      </button>
    </div>
  );
}

export default Payment;