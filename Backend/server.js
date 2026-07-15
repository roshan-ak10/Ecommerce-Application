require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const wishlistRoutes = require('./routes/wishlistRoutes');
const couponRoutes = require('./routes/couponRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();
app.use(express.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: ['https://ecommerce-application-mu-wheat.vercel.app' , 'http://localhost:5173'],
  credentials: true ,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce-dark-red';

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch(err => console.error('DB Connection Error:', err));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', require('./routes/orderRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));