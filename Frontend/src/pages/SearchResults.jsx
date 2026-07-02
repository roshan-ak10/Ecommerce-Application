import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

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

  // --- NEW: SMART SEARCH ALGORITHM ---
  const smartSearch = (field, query) => {
    if (!field || !query) return false;
    const text = field.toLowerCase();
    const search = query.toLowerCase().trim();

    // 1. Direct Match (User types "lap", field is "laptop")
    if (text.includes(search)) return true;

    // 2. Plural Tolerance (User types "laptops", field is "laptop")
    // If the search ends with 's', chop it off and check again
    if (search.endsWith('s') && text.includes(search.slice(0, -1))) {
      return true;
    }

    // 3. Word-by-Word Check (User types "asus laptops 2026")
    // This breaks the search into words and checks if ANY word matches
    const searchWords = search.split(/[ ,]+/); 
    
    return searchWords.some(word => {
      // Ignore tiny 1 or 2 letter words so they don't trigger false positives
      if (word.length < 3) return false; 
      
      return text.includes(word) || (word.endsWith('s') && text.includes(word.slice(0, -1)));
    });
  };

  // Apply the smart search to your products
  const filteredProducts = products.filter((product) => {
    if (!searchTerm) return false; 
    
    const matchName = smartSearch(product.name, searchTerm);
    const matchBrand = smartSearch(product.brand, searchTerm);
    const matchCategory = smartSearch(product.category, searchTerm);
    const matchType = smartSearch(product.type, searchTerm);

    return matchName || matchBrand || matchCategory || matchType;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
      <h2 style={{ marginBottom: '20px' }}>
        Search Results for "{searchTerm}"
      </h2>

      {loading ? (
        <p>Loading results...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ height: '200px', overflow: 'hidden', marginBottom: '15px', borderRadius: '4px' }}>
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                
                <h4>{product.name}</h4>
                <p style={{ color: 'var(--text-muted)' }}>{product.brand}</p>
                <h3 style={{ margin: '10px 0', color: 'var(--text-main)' }}>₹{product.price.toLocaleString('en-IN')}</h3>
                
                <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                  {product.quantity > 0 ? (
                    <button className="btn-primary" style={{ width: '100%' }} onClick={() => addToCart(product)}>
                      Add to Cart
                    </button>
                  ) : (
                    <button className="btn-disabled" style={{ width: '100%' }} disabled>Out of Stock</button>
                  )} 
                </div>
              </div>
            ))
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