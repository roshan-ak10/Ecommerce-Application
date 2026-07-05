import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const getStableNumber = (id = "", min, max) => {
  let sum = 0;
  for (let i = 0; i < id.length; i++) {
    sum += id.charCodeAt(i);
  }
  const randomFrac = (Math.sin(sum) + 1) / 2; 
  return (randomFrac * (max - min) + min);
};

function SearchResults() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('query') || '';
  
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- SMART SEARCH ALGORITHM ---
  const smartSearch = (field, query) => {
    if (!field || !query) return false;
    const text = field.toLowerCase();
    const search = query.toLowerCase().trim();

    if (text.includes(search)) return true;

    if (search.endsWith('s') && text.includes(search.slice(0, -1))) {
      return true;
    }

    const searchWords = search.split(/[ ,]+/); 
    
    return searchWords.some(word => {
      if (word.length < 3) return false; 
      return text.includes(word) || (word.endsWith('s') && text.includes(word.slice(0, -1)));
    });
  };

  const filteredProducts = products.filter((product) => {
    if (!searchTerm) return false; 
    
    const matchName = smartSearch(product.name, searchTerm);
    const matchBrand = smartSearch(product.brand, searchTerm);
    const matchCategory = smartSearch(product.category, searchTerm);
    const matchType = smartSearch(product.type, searchTerm);

    return matchName || matchBrand || matchCategory || matchType;
  });

  return (
    <div style={{ padding: '20px', marginTop: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>
        Search Results for "{searchTerm}"
      </h2>

      {loading ? (
        <p>Loading results...</p>
      ) : (

          <div className="product-grid-4">
          
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {

              const fakeOriginalPrice = Math.floor(product.price * 1.3);
              const fakeRating = getStableNumber(product._id || product.name, 3.5, 4.9).toFixed(1); 
              const fakeReviews = Math.floor(getStableNumber(product._id || product.name, 100, 5000));

              return (
                
                <div key={product._id} className="product-outer-wrapper">
                  
                  <div className="product-image-box">
                    <img src={product.image} alt={product.name} />
                  </div>
                  
                  <div className="product-info-outside">
                    <div className="product-title-row">
                      <strong>{product.brand || "Brand"}</strong>
                      {product.name}
                    </div>

                    <div className="rating-text">
                       <span style={{ backgroundColor: '#388e3c', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                         {fakeRating} ★
                       </span>
                       <span style={{ color: '#878787', fontSize: '13px' }}>({fakeReviews.toLocaleString('en-IN')})</span>
                    </div>
                    
                    <div className="product-price-row">
                      <span className="price-original">₹{fakeOriginalPrice.toLocaleString('en-IN')}</span>
                      <span className="price-current">₹{product.price.toLocaleString('en-IN')}</span>
                    </div>
                    
                    {product.quantity > 0 ? (
                      <button className="add-to-cart-modern" onClick={() => addToCart(product)}>
                        Add to Cart
                      </button>
                    ) : (
                      <button className="add-to-cart-modern" disabled>
                        Out of Stock
                      </button>
                    )} 
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              <h3 style={{ color: 'var(--text-muted)' }}>No products found matching "{searchTerm}".</h3>
              <button className="btn-primary" style={{ marginTop: '15px', width: 'auto' }} onClick={() => navigate('/')}>
                Return to Home
              </button>
            </div>
          )}
          
        </div>
      )}
    </div>
  );
}

export default SearchResults;