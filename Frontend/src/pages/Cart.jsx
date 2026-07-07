import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  
  // 1. Put the username in a React State so it triggers a screen update
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const calculateTotal = () => {
    return cartItems?.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0) || 0;
  };

  // 2. Check the memory the moment the page loads
  useEffect(() => {
    const storedUser = localStorage.getItem('userName');
    setCurrentUser(storedUser);
    setIsLoading(false); // Finished checking
  }, []);

  // 3. Prevent the page from flashing while it checks memory
  if (isLoading) {
    return null; 
  }

  // 4. If NO user is logged in, show the Login UI
  if (!currentUser) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', maxWidth: '500px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '15px', fontSize: '24px' }}>Missing Cart Items?</h2>
        <p style={{ color: '#666', fontSize: '16px', marginBottom: '30px', lineHeight: '1.5' }}>
          Please log in to view your cart, add products, and proceed to checkout securely.
        </p>
        <button 
          onClick={() => navigate('/login')}
          style={{
            backgroundColor: '#fb641b',
            color: 'white',
            border: 'none',
            padding: '14px 40px',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          Login to Continue
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
      <h2>Shopping Cart</h2>
      
      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)' }}>Your cart is empty.</p>
          <button className="btn-primary" style={{ width: 'auto', marginTop: '15px' }} onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
          
          <div style={{ flex: 1 }}>
            {cartItems.map((item) => (
              <div key={item._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px', padding: '15px' }}>
                <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                
                <div style={{ flex: 1 }}>
                  <h4>{item.name}</h4>
                  <h3 style={{ margin: '5px 0' }}>₹{item.price.toLocaleString('en-IN')}</h3>
                </div>
                
                {/* 2. THE NEW QUANTITY CONTROLS */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  
                  {/* Plus/Minus Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                    <button 
                      onClick={() => updateQuantity(item._id, -1)}
                      style={{ padding: '8px 12px', border: 'none', background: '#f5f5f5', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
                    >
                      −
                    </button>
                    
                    <span style={{ padding: '0 15px', fontWeight: 'bold' }}>{item.quantity}</span>
                    
                    <button 
                      onClick={() => updateQuantity(item._id, 1)}
                      style={{ padding: '8px 12px', border: 'none', background: '#f5f5f5', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-red, #e53935)', cursor: 'pointer', fontSize: '20px' }}
                    title="Remove item"
                  >
                    🗑️
                  </button>
                  
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: '20px', alignSelf: 'flex-end', minWidth: '300px' }}>
            <h3>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 0', fontWeight: 'bold' }}>
              <span>Total Price:</span>
              <span>₹{calculateTotal().toLocaleString('en-IN')}</span>
            </div>
            <button className="btn-primary" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
          </div>
          
        </div>
      )}
    </div>
  );
}

export default Cart;