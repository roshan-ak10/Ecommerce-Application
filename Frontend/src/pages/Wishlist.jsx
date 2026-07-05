import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/wishlistContext';
import { useCart } from '../context/CartContext';
import { AiFillHeart } from 'react-icons/ai';

function Wishlist() {
  const { addToCart, setBuyNowItem } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '20px auto' }}>
      <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <AiFillHeart color="#e53935" /> My Wishlist ({wishlistItems?.length || 0})
      </h2>

      {!wishlistItems || wishlistItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5px 0', marginTop: '40px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Your wishlist is empty!</p>
          <button className="btn-primary" style={{ width: 'auto', marginTop: '15px' }} onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="product-grid-4">
          {wishlistItems.map((product) => {
            const fakeOriginalPrice = Math.floor(product.price * 1.3);

            return (
              <div key={product._id} className="product-outer-wrapper">
                
                <div className="product-image-box" style={{ position: 'relative' }}>
                  <img src={product.image} alt={product.name} />
                  <button 
                    onClick={() => toggleWishlist(product)}
                    style={{
                      position: 'absolute', top: '12px', right: '12px',
                      background: 'rgba(255, 255, 255, 0.9)', border: 'none',
                      borderRadius: '50%', width: '32px', height: '32px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                    }}
                  >
                    <AiFillHeart size={20} color="#e53935" />
                  </button>
                </div>
                
                <div className="product-info-outside">
                  <div className="product-title-row">
                    <strong>{product.brand || "Brand"}</strong>
                    {product.name}
                  </div>
                  
                  <div className="product-price-row">
                    <span className="price-original">₹{fakeOriginalPrice.toLocaleString('en-IN')}</span>
                    <span className="price-current">₹{product.price.toLocaleString('en-IN')}</span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {product.quantity > 0 ? (
                      <>
                        <button 
                          className="add-to-cart-modern" 
                          style={{ backgroundColor: '#ff9f00' }}
                          onClick={() => addToCart(product)}
                        >
                          Add to Cart
                        </button>
                        <button 
                          className="add-to-cart-modern" 
                          style={{ backgroundColor: '#fb641b' }}
                          onClick={() => {
                          setBuyNowItem({ ...product, quantity: 1 }); 
                          navigate('/checkout');
                        }}
                        >
                          Buy Now
                        </button>
                      </>
                    ) : (
                      <button className="add-to-cart-modern" disabled>
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Wishlist;