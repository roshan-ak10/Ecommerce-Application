const Coupon = require('../models/Coupon');

const couponCtrl = {
  // 1. Get all active coupons (for the new Coupon page)
  getActiveCoupons: async (req, res) => {
    try {
      const coupons = await Coupon.find({ isActive: true });
      return res.json(coupons);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // 2. Validate a coupon (for the checkout page later)
  validateCoupon: async (req, res) => {
    try {
      const { code } = req.body;
      const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
      
      if (!coupon) {
        return res.status(404).json({ message: "Invalid or expired coupon code" });
      }

      return res.json({ message: "Coupon applied!", discount: coupon.discountPercentage });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

 // 3. Create a coupon (Updated with Expiration Date)
  createCoupon: async (req, res) => {
    try {
      // Grab the new expiryDate from the frontend request
      const { code, discountPercentage, description, expiryDate } = req.body;

      if (!expiryDate) {
        return res.status(400).json({ error: "Please provide an expiration date." });
      }

      const newCoupon = new Coupon({ 
        code, 
        discountPercentage, 
        description,
        expiresAt: new Date(expiryDate) // Converts the string to a real MongoDB Date object
      });
      
      await newCoupon.save();
      return res.json({ message: "Coupon created successfully", newCoupon });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = couponCtrl;