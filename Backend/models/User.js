const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true // Ensures no two accounts use the same email
  },
  password: { 
    type: String, 
    required: true // We will hash this before saving for security!
  },
  phone: { 
    type: String 
  },
  // We use an array of objects so users can have multiple saved addresses
  addresses: [{
    fullName: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: { type: Boolean, default: false }
  }],
  role: { 
    type: String, 
    enum: ['customer', 'admin'], 
    default: 'customer' // Makes it easy to build your Admin Dashboard later
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt dates

module.exports = mongoose.model('User', userSchema);