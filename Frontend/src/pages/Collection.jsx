import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/wishlistContext'; 

function Collection() {
  const { categoryName } = useParams(); 
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { toggleWishlist, wishlistItems, isFavorited } = useWishlist();

useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        const allProducts = response.data || [];

        const searchParam = categoryName.toLowerCase();

        // Helper: Calculate 60% fuzzy match
        const isMatch = (str) => {
          if (!str) return false;
          const target = str.toLowerCase();
          
          // Check if searchParam is inside the string OR vice versa
          if (target.includes(searchParam) || searchParam.includes(target)) return true;

          // Check for 60% character similarity
          const minLen = Math.min(target.length, searchParam.length);
          let matchCount = 0;
          for (let i = 0; i < minLen; i++) {
            if (target[i] === searchParam[i]) matchCount++;
          }
          return (matchCount / Math.max(target.length, searchParam.length)) >= 0.6;
        };

        const filteredProducts = allProducts.filter(product => 
          isMatch(product.category) || 
          isMatch(product.type) || 
          isMatch(product.name)
        );
        
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching collection:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName]);

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: 'auto' }}>
      <button onClick={() => navigate('/')} style={{ marginBottom: '20px', cursor: 'pointer' }}>← Back to Home</button>
      
      <h1>{categoryName} Products</h1>

      {loading ? (
        <p>Loading...</p>
      ) : products.length > 0 ? (
        <div className="product-grid-4">
          {products.map((product) => (
            <div key={product._id} className="product-outer-wrapper">
              <div className="product-image-box">
                <img src={product.image} alt={product.name} />
                <button 
                  className={`wishlist-btn ${isFavorited(product._id) ? 'favorited' : ''}`} 
                  onClick={() => toggleWishlist(product)}
                >
                   {isFavorited(product._id) ? '♥' : '♡'}
                </button>
              </div>
              <div className="product-info-outside">
                <strong>{product.brand}</strong>
                <p>{product.name}</p>
                <p>₹{product.price}</p>
                <button className="add-to-cart-modern" onClick={() => addToCart(product)}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found for this category.</p>
      )}
    </div>
  );
}

export default Collection;