import React, { useState } from 'react';
import axios from 'axios';

function Admin() {
  const [formData, setFormData] = useState({
    name: '', brand: '', price: '', image: '', description: '', category: '', type: '', quantity: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Must include withCredentials: true to send the auth cookie
      await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, formData, { 
        withCredentials: true 
      });
      alert('Product added successfully!');
      
      // Optional: Clear the form after a successful save
      setFormData({ name: '', brand: '', price: '', image: '', description: '', category: '', type: '', quantity: '' });
      
    } catch (error) {
      alert('Failed: ' + (error.response?.data?.message || 'Unauthorized'));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '40px auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <h2>Manage Products</h2>
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="auth-input" />
      <input type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} required className="auth-input" />
      <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required className="auth-input" />
      <input type="text" name="type" placeholder="Type" value={formData.type} onChange={handleChange} required className="auth-input" />
      <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required className="auth-input" />
      <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required className="auth-input" />
      <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} required className="auth-input" />
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="auth-input" />
      
      <button type="submit" className="btn-primary">Save Product</button>
    </form>
  );
}

export default Admin;