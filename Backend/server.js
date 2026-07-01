require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// This allows your Vite frontend (port 5173) to securely send and receive cookies.
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: allowedOrigin, 
  credentials: true 
}));

// Database Connection
// Look for an environment variable FIRST, then fall back to localhost
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce-dark-red';

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch(err => console.error('DB Connection Error:', err));

// Basic Routes Structure
// Notice the user route is uncommented so your login/register functions will work!
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
// app.use('/api/wishlist', require('./routes/wishlistRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));