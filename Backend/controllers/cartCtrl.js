// backend/controllers/cartCtrl.js
const Cart = require('../models/Cart');

const cartCtrl = {
  // 1. GET CART
  getCart: async (req, res) => {
    try {
      // CHANGED: Search by email using req.params.email
      // Note: your route is currently /:username, we will fix that in step 3
      let cart = await Cart.findOne({ email: req.params.email });
      
      if (!cart) {
        return res.status(200).json({ items: [] });
      }
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching cart', error });
    }
  },

  // 2. SYNC CART
  syncCart: async (req, res) => {
    // CHANGED: Destructure 'email' from the frontend request instead of username
    const { email, items } = req.body;

    try {
      // CHANGED: Search by email
      let cart = await Cart.findOne({ email });

      if (cart) {
        cart.items = items;
        await cart.save();
      } else {
        // CHANGED: Create a new cart using the email
        cart = new Cart({ email, items });
        await cart.save();
      }

      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Error syncing cart', error });
    }
  }
};

module.exports = cartCtrl;