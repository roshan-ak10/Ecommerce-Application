const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true 
  },
  discountPercentage: { 
    type: Number, 
    required: true,
    min: 1,
    max: 100
  },
  description: {
    type: String,
    required: true
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  // --- NEW: The Auto-Delete Timer ---
  expiresAt: {
    type: Date,
    required: true,
    expires: 0 // This tells MongoDB to delete the document exactly at this Date!
  }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);