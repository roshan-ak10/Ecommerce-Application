import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/wishlistContext';

// Reusing your star rating generator for consistency
const getStableNumber = (id = "", min, max) => {
  let sum = 0;
  for (let i = 0; i < id.length; i++) {
    sum += id.charCodeAt(i);
  }
  const randomFrac = (Math.sin(sum) + 1) / 2; 
  return (randomFrac * (max - min) + min);
};

function ProductPage() {
  const { id } = useParams(); // Gets the product ID from the URL
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, wishlistItems } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isFavorited = (productId) => {
    return wishlistItems?.some(item => item._id === productId);
  };






  const handleBuyNow = () => {
    addToCart(product);
    navigate('/checkout', { 
      state: { 
        isBuyNow: true, 
        buyNowProduct: product 
      } 
    }); // Change this to '/checkout' if you have a direct checkout route
  };




useEffect(() => {
    // Scroll to top whenever the URL ID changes
    window.scrollTo(0, 0); 

    const fetchProductData = async () => {
      setLoading(true);
      try {
        // 1. Fetch ALL products (We know this route works perfectly!)
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        const allProducts = response.data;

        // 2. Find the exact product that matches the ID in the URL
        const currentProduct = allProducts.find(p => p._id === id || p.id === id);

        if (currentProduct) {
          setProduct(currentProduct);

          // 3. Find related products (Same category, but NOT the current item)
          const related = allProducts.filter(p => 
            p.category === currentProduct.category && p._id !== currentProduct._id
          );

          // Shuffle and pick the top 4 related products
          const shuffledRelated = related.sort(() => 0.5 - Math.random()).slice(0, 4);
          setRelatedProducts(shuffledRelated);
        } else {
          setProduct(null); // Triggers the "Product not found" message if it actually doesn't exist
        }

      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading product details...</div>;
  }

  if (!product) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Product not found.</div>;
  }

  const fakeOriginalPrice = Math.floor(product.price * 1.3);
  const fakeRating = getStableNumber(product._id || product.name, 3.5, 4.9).toFixed(1); 
  const fakeReviews = Math.floor(getStableNumber(product._id || product.name, 100, 5000));

  return (
    <div className="main-content">
      
      {/* --- TOP SECTION: PRODUCT DETAILS --- */}
      <div className="product-page-layout card">
        
        {/* Left Side: Large Image */}
        <div className="product-page-image-container">
          <img src={product.image} alt={product.name} className="product-page-image" />
          <button 
            className={`wishlist-btn ${isFavorited(product._id) ? 'favorited' : ''}`}
            onClick={() => toggleWishlist(product)}
            style={{ top: '20px', right: '20px' }}
          >
            {isFavorited(product._id) ? '♥' : '♡'}
          </button>
        </div>

        {/* Right Side: Info & Actions */}
        <div className="product-page-info">
          <h4 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {product.brand || 'Brand'}
          </h4>
          <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>{product.name}</h1>
          
          <div className="rating-text" style={{ fontSize: '15px', marginBottom: '20px' }}>
             <span style={{ backgroundColor: '#388e3c', color: 'white', padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
               {fakeRating} ★
             </span>
             <span style={{ color: '#878787' }}>{fakeReviews.toLocaleString('en-IN')} Ratings & Reviews</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px', marginBottom: '20px' }}>
            <span style={{ fontSize: '32px', fontWeight: 'bold' }}>₹{product.price.toLocaleString('en-IN')}</span>
            <span style={{ textDecoration: 'line-through', color: '#878787', fontSize: '18px' }}>
              ₹{fakeOriginalPrice.toLocaleString('en-IN')}
            </span>
            <span style={{ color: '#388e3c', fontWeight: 'bold' }}>30% off</span>
          </div>

          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '30px' }}>
            {product.description || "Experience premium quality and comfort. This product is designed to meet your everyday needs with superior materials and excellent craftsmanship."}
          </p>

          <div style={{ display: 'flex', gap: '15px' }}>
            {product.quantity > 0 ? (
              <>
                <button className="btn-primary" style={{ padding: '8px 20px', 
                    fontSize: '14px', 
                    width: '300px', /* Gives it a normal, fixed button size */
                    margin: 0 }} onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
                <button className="btn-primary"  onClick={handleBuyNow} style={{ padding: '8px 20px', 
                    fontSize: '14px', 
                    width: '300px', 
                    heigth:'100px',
                    backgroundColor: '#fb641b', 
                    margin: 0 }}>
                  Buy Now
                </button>
              </>
            ) : (
              <button className="btn-primary" style={{ backgroundColor: '#cccccc' }} disabled>
                Out of Stock
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION: RELATED PRODUCTS --- */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: '50px' }}>
          <h2 style={{ marginBottom: '20px', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px' }}>
            Similar Products You Might Like
          </h2>
          
          {/* Reusing your existing awesome product grid class! */}
          <div className="product-grid-4">
            {relatedProducts.map((item) => {
              const itemOrigPrice = Math.floor(item.price * 1.3);
              const itemRating = getStableNumber(item._id || item.name, 3.5, 4.9).toFixed(1); 
              const itemReviews = Math.floor(getStableNumber(item._id || item.name, 100, 5000));

              return (
                <div key={item._id} className="product-outer-wrapper" onClick={() => navigate(`/product/${item._id}`)} style={{ cursor: 'pointer' }}>
                  <div className="product-image-box">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="product-info-outside">
                    <div className="product-title-row">
                      <strong>{item.brand || "Brand"}</strong>
                      {item.name}
                    </div>
                    <div className="rating-text">
                       <span style={{ backgroundColor: '#388e3c', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                         {itemRating} ★
                       </span>
                       <span style={{ color: '#878787', fontSize: '13px' }}>({itemReviews.toLocaleString('en-IN')})</span>
                    </div>
                    <div className="product-price-row">
                      <span className="price-original">₹{itemOrigPrice.toLocaleString('en-IN')}</span>
                      <span className="price-current">₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

export default ProductPage;