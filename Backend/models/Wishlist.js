// backend/models/Wishlist.js
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  // Link the wishlist to the user's unique email
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  items: [
    {
      _id: { type: String, required: true }, 
      name: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);