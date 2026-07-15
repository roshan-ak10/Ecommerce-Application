import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import QRCode from 'react-qr-code'; 

function Payment() {
  const { cartItems, setCartItems, buyNowItem, setBuyNowItem } = useCart();
  const navigate = useNavigate();

  // --- UPI DETAILS ---
  const myUpiId = "roshankrishnaraj10@okicici"; 
  const myStoreName = "RedKart.in";
  
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [transactionRef] = useState(() => "TXN" + Date.now());
  
  // New state to hold the address from Step 1
  const [shippingAddress, setShippingAddress] = useState(null);

  // 1. Grab the address from localStorage
  useEffect(() => {
    const savedAddress = JSON.parse(localStorage.getItem('userAddress'));
    if (!savedAddress) {
      alert("Missing delivery details. Please fill out your address first.");
      navigate('/checkout'); 
    } else {
      setShippingAddress(savedAddress);
    }
  }, [navigate]);

  const activeItems = buyNowItem ? [buyNowItem] : cartItems;
  const subtotal = activeItems?.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0) || 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = subtotal - discountAmount;

  // --- UPI QR CODE FIXES ---
  const encodedName = encodeURIComponent(myStoreName);
  const formattedAmount = finalTotal.toFixed(2);
  const upiLink = `upi://pay?pa=${myUpiId}&pn=${encodedName}&am=${formattedAmount}&cu=INR&tr=${transactionRef}`;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setMessage({ type: 'error', text: 'Please enter a coupon code.' });
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/coupons/validate`, { code: couponCode });
      setDiscountPercent(response.data.discount);
      setMessage({ type: 'success', text: `Success! ${response.data.discount}% discount applied.` });
    } catch (error) {
      setDiscountPercent(0);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Invalid or expired coupon code.' });
    }
  };

  // 2. The Final Order Submission
  const handlePayment = async () => {
    if (finalTotal === 0 && activeItems?.length === 0) {
      alert("No items to purchase!");
      return navigate('/');
    }

    if (utrNumber.length < 12) {
      alert("Please enter a valid 12-digit UTR/Reference number after paying.");
      return;
    }

    try {
      setIsProcessing(true);
      
      // Prepare the exact data payload for MongoDB
      const orderData = {
        items: activeItems,
        totalAmount: finalTotal,
        shippingAddress: shippingAddress,
        utrNumber: utrNumber // Passing the UTR to the backend!
      };

      // Send to backend
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders/create`, 
        orderData, 
        { withCredentials: true } 
      );

      alert(`Order Placed! We will verify UTR: ${utrNumber} and process your order soon.`);
      
      // Clear the correct cart
      if (buyNowItem) {
        setBuyNowItem(null); 
      } else {
        setCartItems([]); 
      }
      
      // Redirect to the new Amazon-style tracking page
      navigate('/my-orders'); 

    } catch (error) {
      console.error("Order failed:", error);
      alert("Payment failed or server error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Don't render the page until the address is loaded
  if (!shippingAddress) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading secure payment...</div>;

  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Secure Payment</h2>

      {/* --- ORDER SUMMARY (Now includes Address Preview) --- */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #ddd' }}>
        <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '15px' }}>Order Summary</h3>
        
        <div style={{ marginBottom: '15px', color: '#555', fontSize: '14px' }}>
          <strong>Delivering to:</strong> {shippingAddress.fullName} - {shippingAddress.city}, {shippingAddress.state}
        </div>

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

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #ddd', fontSize: '20px', fontWeight: 'bold' }}>
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
            style={{ flex: 1, padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px', textTransform: 'uppercase' }}
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
        <p style={{ marginBottom: '20px', color: '#666' }}>
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
            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }}
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