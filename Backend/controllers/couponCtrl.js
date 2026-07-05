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

  // 3. Create a coupon (You can hit this route from Postman or your Admin page)
  createCoupon: async (req, res) => {
    try {
      const { code, discountPercentage, description } = req.body;
      const newCoupon = new Coupon({ code, discountPercentage, description });
      await newCoupon.save();
      return res.json({ message: "Coupon created successfully", newCoupon });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = couponCtrl;