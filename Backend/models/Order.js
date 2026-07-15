const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Locked to the specific user
  userId: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  items: [
    {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String },
      quantity: { type: Number, required: true }
    }
  ],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  shippingAddress: {
    type: Object, // You can expand this based on your address form
    required: true
  },
  utrNumber: { type: String },
  // The crucial field for your tracking flow
  status: { 
    type: String, 
    enum: ['Pending Approval', 'Approved', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending Approval' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);