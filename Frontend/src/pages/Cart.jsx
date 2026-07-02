import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 

function Cart() {
  const navigate = useNavigate();
  
  // 1. Pull our new functions from the context!
  const { cartItems, updateQuantity, removeFromCart } = useCart(); 

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

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
            <button className="btn-primary">Proceed to Checkout</button>
          </div>
          
        </div>
      )}
    </div>
  );
}

export default Cart;