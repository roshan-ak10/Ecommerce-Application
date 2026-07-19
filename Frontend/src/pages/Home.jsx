import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // <-- ADDED: Navigation hook
import Categories from '../categories'; 
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/wishlistContext'; 

const getStableNumber = (id = "", min, max) => {
  let sum = 0;
  for (let i = 0; i < id.length; i++) {
    sum += id.charCodeAt(i);
  }
  const randomFrac = (Math.sin(sum) + 1) / 2; 
  return (randomFrac * (max - min) + min);
};

const bannerDeals = [
  {
    id: 1,
    title: "Summer Tech Sale",
    subtitle: "Up to 40% off on Premium Laptops & Accessories",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOCDBb4pp2_qjuaYT8-w9tQj3OLLWUJuElOJA_ZOS1Jw&s=10",
    targetCategory: "electronics" // <-- ADDED: Target category for routing
  },
  {
    id: 2,
    title: "New Audio Gear",
    subtitle: "Experience crystal clear sound with our new arrivals",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
    targetCategory: "tws" // <-- ADDED: Target category for routing
  },
  {
    id: 3,
    title: "Step Up Your Game",
    subtitle: "Exclusive discounts on top sports footwear brands",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
    targetCategory: "shoes" // <-- ADDED: Target category for routing
  }
];

function Home() {
  const navigate = useNavigate(); // <-- ADDED: Initialize navigation

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentSlide, setCurrentSlide] = useState(0);

  const { addToCart } = useCart();
  const { toggleWishlist, wishlistItems } = useWishlist();

  const isFavorited = (productId) => {
    return wishlistItems?.some(item => item._id === productId);
  };

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === bannerDeals.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

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

  const nextSlide = () => setCurrentSlide(currentSlide === bannerDeals.length - 1 ? 0 : currentSlide + 1);
  const prevSlide = () => setCurrentSlide(currentSlide === 0 ? bannerDeals.length - 1 : currentSlide - 1);

  const displayedProducts = products.filter(product => {
    if (selectedCategory === 'All') return true;
    const categoryWords = selectedCategory.toLowerCase().split(' ');
    const searchRoots = categoryWords.map(word => {
      let safeWord = word;
      if (safeWord.endsWith('s')) safeWord = safeWord.slice(0, -1);
      if (safeWord.length <= 4) return safeWord; 
      return safeWord.slice(0, Math.ceil(safeWord.length * 0.6));
    });

    const productCategory = product.category?.toLowerCase() || '';
    const productType = product.type?.toLowerCase() || '';
    const productName = product.name?.toLowerCase() || '';
    
    return searchRoots.some(root => 
      productCategory.includes(root) || 
      productType.includes(root) || 
      productName.includes(root)
    );
  });

  return (
    <div>

      <div className="sticky-categories-wrapper">
        <Categories 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
      </div>
      
      <section className="banner-container">
        <button className="banner-btn left" onClick={prevSlide}>{'<'}</button>
        <button className="banner-btn right" onClick={nextSlide}>{'>'}</button>

        {bannerDeals.map((deal, index) => (
          <div 
            key={deal.id} 
            className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${deal.image})` }}
          >
            <div className="banner-content">
              <h2>{deal.title}</h2>
              <p>{deal.subtitle}</p>
              
              {/* <-- ADDED: onClick handler for routing --> */}
              <button 
                className="btn-primary" 
                style={{ width: 'auto', padding: '12px 30px', fontSize: '16px' }}
                onClick={() => navigate(`/collection/${deal.targetCategory}`)}
              >
                Shop Now
              </button>
            </div>
          </div>
        ))}

        <div className="banner-dots">
          {bannerDeals.map((_, index) => (
            <div key={index} className={`dot ${index === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(index)}></div>
          ))}
        </div>
      </section>

      <section style={{ padding: '0 20px' }}>
        <h2>{selectedCategory === 'All' ? 'Featured Products' : `${selectedCategory}`}</h2>
        
        {loading ? (
          <p style={{ marginTop: '15px' }}>Loading products...</p>
        ) : (
          <div className="product-grid-4">
            
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product) => {
                const fakeOriginalPrice = Math.floor(product.price * 1.3);
                const fakeRating = getStableNumber(product._id || product.name, 3.5, 4.9).toFixed(1); 
                const fakeReviews = Math.floor(getStableNumber(product._id || product.name, 100, 5000));

                return (
                  <div key={product._id} className="product-outer-wrapper">
                    
                    <div className="product-image-box">
                      <img src={product.image} alt={product.name} />
                      
                      <button 
                        className={`wishlist-btn ${isFavorited(product._id) ? 'favorited' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                      >
                        {isFavorited(product._id) ? '♥' : '♡'}
                      </button>
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
              <p style={{ gridColumn: '1 / -1', padding: '20px 0', fontSize: '16px', color: 'var(--text-muted)' }}>
                No items found in {selectedCategory}.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;