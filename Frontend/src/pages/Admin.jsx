import React, { useState } from 'react';
import axios from 'axios';
import AdminOrders from './AdminOrders';

function Admin() {
  const [activeTab, setActiveTab] = useState('products');

  // --- 1. PRODUCT STATE & HANDLERS ---
  const [formData, setFormData] = useState({
    name: '', brand: '', price: '', image: '', description: '', category: '', type: '', quantity: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, formData, { withCredentials: true });
      alert('Product added successfully!');
      setFormData({ name: '', brand: '', price: '', image: '', description: '', category: '', type: '', quantity: '' });
    } catch (error) {
      alert('Failed: ' + (error.response?.data?.message || 'Unauthorized'));
    }
  };

  // --- 2. COUPON STATE & HANDLERS (NEW!) ---
  const [couponData, setCouponData] = useState({
    code: '', discount: '', description: '' , expiryDate: ''
  });

  const handleCouponChange = (e) => {
    setCouponData({ ...couponData, [e.target.name]: e.target.value });
  };

const handleCouponSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`h${import.meta.env.VITE_API_URL}/api/coupons/create`, {
        code: couponData.code.toUpperCase(),
        discountPercentage: Number(couponData.discount),
        description: couponData.description,
        expiryDate: couponData.expiryDate // <-- NEW: Send the date to the backend!
      }, { 
        withCredentials: true 
      });
      
      alert('Coupon added successfully!');
      setCouponData({ code: '', discount: '', description: '', expiryDate: '' }); 
    } catch (error) {
      console.error(error);
      alert('Failed: ' + (error.response?.data?.error || 'Could not add coupon'));
    }
  };

  // --- 3. RENDER LOGIC ---
  const renderContent = () => {
    switch (activeTab) {
      
      case 'products':
        return (
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Manage Products</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required style={{ padding: '10px' }} />
              <input type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} required style={{ padding: '10px' }} />
              <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required style={{ padding: '10px' }} />
              <input type="text" name="type" placeholder="Type" value={formData.type} onChange={handleChange} required style={{ padding: '10px' }} />
              <input type="number" name="price" placeholder="Price (₹)" value={formData.price} onChange={handleChange} required style={{ padding: '10px' }} />
              <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required style={{ padding: '10px' }} />
              <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} required style={{ padding: '10px' }} />
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required style={{ padding: '10px', minHeight: '100px' }} />
              <button type="submit" style={{ padding: '12px', marginTop: '10px', backgroundColor: '#2874f0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save Product</button>
            </form>
          </div>
        );

      case 'coupons':
        return (
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Add New Coupon</h2>
            
            <form onSubmit={handleCouponSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ fontWeight: 'bold' }}>Coupon Code</label>
                <input type="text" name="code" placeholder="e.g., DIWALI50" value={couponData.code} onChange={handleCouponChange} required style={{ width: '100%', padding: '10px', marginTop: '5px', textTransform: 'uppercase' }} />
              </div>
              
              <div>
                <label style={{ fontWeight: 'bold' }}>Discount Percentage (%)</label>
                <input type="number" name="discount" placeholder="e.g., 15" min="1" max="100" value={couponData.discount} onChange={handleCouponChange} required style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
              </div>
              
              <div>
                <label style={{ fontWeight: 'bold' }}>Description</label>
                <textarea name="description" placeholder="e.g., Get 15% off on all electronics this festival season!" value={couponData.description} onChange={handleCouponChange} required style={{ width: '100%', padding: '10px', marginTop: '5px', minHeight: '80px' }} />
              </div>

              {/* ---> PASTE YOUR NEW DATE CODE RIGHT HERE <--- */}
              <div>
                <label style={{ fontWeight: 'bold' }}>Expiration Date</label>
                <input 
                  type="date" 
                  name="expiryDate" 
                  value={couponData.expiryDate} 
                  onChange={handleCouponChange} 
                  required 
                  min={new Date().toISOString().split("T")[0]} 
                  style={{ width: '100%', padding: '10px', marginTop: '5px' }} 
                />
              </div>
              {/* ----------------------------------------------- */}
              
              <button type="submit" style={{ padding: '12px', marginTop: '10px', backgroundColor: '#fb641b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Save Coupon
              </button>
            </form>
            
          </div>
        );

      case 'orders':
        return (
          <div><AdminOrders/></div>
          
        );

      default:
        return <h2>Welcome to the Admin Dashboard</h2>;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '85vh', backgroundColor: '#f1f3f6', fontFamily: 'sans-serif' }}>
      
      {/* LEFT SIDEBAR NAVIGATION */}
      <div style={{ width: '250px', backgroundColor: '#fff', borderRight: '1px solid #e0e0e0', padding: '20px' }}>
        <h3 style={{ color: '#878787', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '1px', marginBottom: '20px' }}>
          Admin Panel
        </h3>
        
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <li onClick={() => setActiveTab('products')} style={{ padding: '12px 15px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold', backgroundColor: activeTab === 'products' ? '#e0f0ff' : 'transparent', color: activeTab === 'products' ? '#2874f0' : '#333' }}>
            📦 Add Products
          </li>
          <li onClick={() => setActiveTab('coupons')} style={{ padding: '12px 15px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold', backgroundColor: activeTab === 'coupons' ? '#e0f0ff' : 'transparent', color: activeTab === 'coupons' ? '#2874f0' : '#333' }}>
            🎟️ Add Coupons
          </li>
          <li onClick={() => setActiveTab('orders')} style={{ padding: '12px 15px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold', backgroundColor: activeTab === 'orders' ? '#e0f0ff' : 'transparent', color: activeTab === 'orders' ? '#2874f0' : '#333' }}>
            🚚 Manage Orders
          </li>
        </ul>
      </div>

      {/* RIGHT MAIN CONTENT AREA */}
      <div style={{ flex: 1, padding: '40px', maxWidth: '800px' }}>
        {renderContent()}
      </div>
      
    </div>
  );
}

export default Admin;