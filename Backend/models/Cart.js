// backend/models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  // CHANGED: We now link the cart to the user's unique email!
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
      image: { type: String },
      quantity: { type: Number, default: 1, min: 1 }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);