import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Dummy data for our slideshow
const bannerDeals = [
  {
    id: 1,
    title: "Summer Tech Sale",
    subtitle: "Up to 40% off on Premium Laptops & Accessories",
    image: "https://images.unsplash.com/photo-1531297172867-4f541313ce87?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "New Audio Gear",
    subtitle: "Experience crystal clear sound with our new arrivals",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Step Up Your Game",
    subtitle: "Exclusive discounts on top sports footwear brands",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop"
  }
];

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for the Banner Slideshow
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play the slideshow (Changes slide every 5 seconds)
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === bannerDeals.length - 1 ? 0 : prev + 1));
    }, 5000);

    // Cleanup interval on component unmount so it doesn't run endlessly in the background
    return () => clearInterval(slideInterval);
  }, []);

  // Fetch Products from Backend
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

  // Manual Slider Controls
  const nextSlide = () => setCurrentSlide(currentSlide === bannerDeals.length - 1 ? 0 : currentSlide + 1);
  const prevSlide = () => setCurrentSlide(currentSlide === 0 ? bannerDeals.length - 1 : currentSlide - 1);

  return (
    <div style={{ marginTop: '20px' }}>
      
      {/* --- HERO BANNER / SLIDESHOW --- */}
      <section className="banner-container">
        
        {/* Left/Right Buttons */}
        <button className="banner-btn left" onClick={prevSlide}>
          <FiChevronLeft />
        </button>
        <button className="banner-btn right" onClick={nextSlide}>
          <FiChevronRight />
        </button>

        {/* The Slides */}
        {bannerDeals.map((deal, index) => (
          <div 
            key={deal.id} 
            className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${deal.image})` }}
          >
            <div className="banner-content">
              <h2>{deal.title}</h2>
              <p>{deal.subtitle}</p>
              <button className="btn-primary" style={{ width: 'auto', padding: '12px 30px', fontSize: '16px' }}>Shop Now</button>
            </div>
          </div>
        ))}

        {/* Indicator Dots at the bottom */}
        <div className="banner-dots">
          {bannerDeals.map((_, index) => (
            <div 
              key={index} 
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></div>
          ))}
        </div>
      </section>

      {/* --- PRODUCT GRID --- */}
      <section>
        <h2>Featured Products</h2>
        
        {loading ? (
          <p style={{ marginTop: '15px' }}>Loading products...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '15px' }}>
            

            
            {products.map((product) => (
              <div key={product._id} className="card">
                
                {/* --- NEW DYNAMIC IMAGE BLOCK --- */}
                <div style={{ height: '200px', overflow: 'hidden', marginBottom: '15px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                
                <h4>{product.name}</h4>
                <p style={{ color: 'var(--text-muted)' }}>{product.brand}</p>
                <h3 style={{ margin: '10px 0', color: 'var(--text-main)' }}>₹{product.price.toLocaleString('en-IN')}</h3>
                {product.quantity > 0 ? (
                  <button className="btn-primary">Add to Cart</button>
                ) : (
                  <button className="btn-disabled" disabled>Out of Stock</button>
                )} 
             </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

export default Home;