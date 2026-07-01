import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setAuthUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [errorMsg, setErrorMsg] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // Handles typing in the input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Clears the form when switching between Login and Sign Up
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrorMsg(''); // Clear old errors
    setFormData({ email: '', password: '', name: '' }); // Empty the text boxes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(''); 
    setIsLoading(true);

    const axiosConfig = {
      withCredentials: true 
    };

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/login`, {
          email: formData.email,
          password: formData.password
        }, axiosConfig); 
        
        localStorage.setItem('userName', response.data.name);
        localStorage.setItem('userEmail', response.data.email);        
        if (setAuthUser) setAuthUser(response.data.name); 
        
        navigate('/'); 
        
      } else {
        // --- SIGN UP LOGIC ---
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password
        }, axiosConfig); 

        localStorage.setItem('userName', response.data.name);
        if (setAuthUser) setAuthUser(response.data.name); 
        
        navigate('/'); 
      }
    } catch (error) {
      console.error("Backend Error:", error);
      
      // Much smarter error handling based on your Network tab issues!
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMsg(error.response.data.message);
      } else if (error.response && error.response.status === 400) {
        setErrorMsg("This email is already registered. Please login instead.");
      } else if (error.response && error.response.status === 401) {
        setErrorMsg("Incorrect email or password.");
      } else {
        setErrorMsg("Cannot connect to the server. Please check if your backend is running.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--text-main)' }}>
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>

        {/* Error Message Display */}
        {errorMsg && (
          <div style={{ backgroundColor: '#ffcdd2', color: '#b71c1c', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name}
                className="auth-input" 
                placeholder="John Doe" 
                onChange={handleChange} 
                required={!isLogin} 
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email}
              className="auth-input" 
              placeholder="you@example.com" 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password}
              className="auth-input" 
              placeholder="••••••••" 
              onChange={handleChange} 
              required 
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }} disabled={isLoading}>
            {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <p className="auth-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={toggleMode} style={{ cursor: 'pointer', color: 'var(--primary-red)', fontWeight: 'bold' }}>
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;