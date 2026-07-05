const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true // Automatically converts codes like "summer10" to "SUMMER10"
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
  }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);