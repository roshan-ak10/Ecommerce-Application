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

  const [baseSearchResults, setBaseSearchResults] = useState([]); 
  const [finalFilteredProducts, setFinalFilteredProducts] = useState([]); 
  
  const [availableBrands, setAvailableBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [highestPriceLimit, setHighestPriceLimit] = useState(100000);

  // --- NEW: Mobile Drawer State ---
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // 1. FETCH ALL PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
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
    if (search.endsWith('s') && text.includes(search.slice(0, -1))) return true;
    const searchWords = search.split(/[ ,]+/); 
    return searchWords.some(word => {
      if (word.length < 3) return false; 
      return text.includes(word) || (word.endsWith('s') && text.includes(word.slice(0, -1)));
    });
  };

  // 2. APPLY SEARCH & EXTRACT BRANDS/PRICES
  useEffect(() => {
    if (products.length === 0) return;
    const searchResults = products.filter((product) => {
      if (!searchTerm) return false; 
      const matchName = smartSearch(product.name, searchTerm);
      const matchBrand = smartSearch(product.brand, searchTerm);
      const matchCategory = smartSearch(product.category, searchTerm);
      const matchType = smartSearch(product.type, searchTerm);
      return matchName || matchBrand || matchCategory || matchType;
    });

    setBaseSearchResults(searchResults);

    if (searchResults.length > 0) {
      const uniqueBrands = [...new Set(searchResults.map(p => p.brand).filter(Boolean))];
      setAvailableBrands(uniqueBrands);
      const highestPrice = Math.max(...searchResults.map(p => p.price));
      setHighestPriceLimit(highestPrice);
    }
  }, [products, searchTerm]);

  useEffect(() => {
    setSelectedBrands([]);
    setMaxPrice(highestPriceLimit);
  }, [searchTerm, highestPriceLimit]);

  // 3. APPLY SIDEBAR FILTERS
  useEffect(() => {
    let result = baseSearchResults;
    if (selectedBrands.length > 0) {
      result = result.filter(product => selectedBrands.includes(product.brand));
    }
    result = result.filter(product => product.price <= maxPrice);
    setFinalFilteredProducts(result);
  }, [baseSearchResults, selectedBrands, maxPrice]);

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prevSelected => 
      prevSelected.includes(brand) 
        ? prevSelected.filter(b => b !== brand) 
        : [...prevSelected, brand]              
    );
  };

  return (
    <div className="search-page-layout" style={{ padding: '20px', marginTop: '20px' }}>
      
      {/* --- NEW: Mobile Filter Toggle Button --- */}
      <div className="mobile-filter-bar">
        <button className="mobile-filter-btn" onClick={() => setIsMobileFilterOpen(true)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          Filters
        </button>
      </div>

      {/* --- NEW: Dark Overlay for Mobile Drawer --- */}
      <div className={`filter-overlay ${isMobileFilterOpen ? 'open' : ''}`} onClick={() => setIsMobileFilterOpen(false)}></div>

      {/* --- LEFT SIDEBAR / MOBILE DRAWER --- */}
      <aside className={`filter-sidebar card ${isMobileFilterOpen ? 'open' : ''}`}>
        
        {/* Mobile Header (Only shows on phones) */}
        <div className="filter-mobile-header">
          <h3 style={{ margin: 0 }}>Filters</h3>
          <button className="icon-btn" onClick={() => setIsMobileFilterOpen(false)}>✕</button>
        </div>

        {/* Desktop Header */}
        <h3 className="filter-desktop-header" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          Filters
        </h3>

        {/* Brand Checkboxes */}
        <div className="filter-section">
          <h4 style={{ marginBottom: '10px', color: 'var(--text-main)' }}>Brands</h4>
          {availableBrands.length > 0 ? (
            availableBrands.map((brand, index) => (
              <label key={index} className="filter-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                />
                {brand}
              </label>
            ))
          ) : (
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No brands found</p>
          )}
        </div>

        {/* Price Filter Section */}
        <div className="filter-section" style={{ marginTop: '25px' }}>
          <h4 style={{ marginBottom: '15px', color: 'var(--text-main)' }}>Max Price</h4>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-muted)' }}>₹</span>
            <input 
              type="number" 
              className="auth-input"
              value={maxPrice === 0 ? '' : maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value) || 0)}
              style={{ width: '100%', padding: '8px' }}
              placeholder="Enter price..."
            />
          </div>

          <input 
            type="range" 
            min="0" 
            max={highestPriceLimit} 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginTop: '5px' }}>
            <span>₹0</span>
            <span>₹{highestPriceLimit.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Apply Button (Only shows on phones) */}
        <div className="filter-mobile-footer">
          <button className="btn-primary" onClick={() => setIsMobileFilterOpen(false)}>
            Apply Filters
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT GRID --- */}
      <main className="search-results-main">
        <h2 style={{ marginBottom: '20px' }}>
          Search Results for "{searchTerm}"
          <span style={{ fontSize: '14px', color: 'var(--text-muted)', marginLeft: '10px' }}>
            ({finalFilteredProducts.length} items)
          </span>
        </h2>

        {loading ? (
          <p>Loading results...</p>
        ) : (
          <div className="product-grid-4" style={{ margin: 0 }}>
          
            {finalFilteredProducts.length > 0 ? (
              finalFilteredProducts.map((product) => {
                const fakeOriginalPrice = Math.floor(product.price * 1.3);
                const fakeRating = getStableNumber(product._id || product.name, 3.5, 4.9).toFixed(1); 
                const fakeReviews = Math.floor(getStableNumber(product._id || product.name, 100, 5000));

                return (
                  <div key={product._id} className="product-outer-wrapper" onClick={() => navigate(`/product/${product._id}`)} style={{ cursor: 'pointer' }}>
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
                        <button className="add-to-cart-modern" onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product)}}>Add to Cart</button>
                      ) : (
                        <button className="add-to-cart-modern" disabled>Out of Stock</button>
                      )} 
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                <h3 style={{ color: 'var(--text-muted)', marginBottom: '15px' }}>No products match your current filters.</h3>
                <button className="btn-primary" style={{ width: 'auto' }} onClick={() => { setSelectedBrands([]); setMaxPrice(highestPriceLimit); }}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default SearchResults;