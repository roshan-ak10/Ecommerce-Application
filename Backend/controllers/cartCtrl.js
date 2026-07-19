const Cart = require('../models/Cart');

const cartCtrl = {
  // 1. GET CART
  getCart: async (req, res) => {
    try {
      // 🛡️ SECURE: Ignore the URL parameter entirely. 
      // Pull the email directly from the verified token provided by the bouncer.
      const secureEmail = req.user.email; 
      
      let cart = await Cart.findOne({ email: secureEmail });
      
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
    // 🛡️ SECURE: Only extract the items from the frontend body. 
    // Ignore any email they try to send in the request payload.
    const { items } = req.body;
    
    // 🛡️ SECURE: Pull the email directly from the verified token.
    const secureEmail = req.user.email;

    try {
      let cart = await Cart.findOne({ email: secureEmail });

      if (cart) {
        cart.items = items;
        await cart.save();
      } else {
        // Create a new cart using the secure email, not the frontend email
        cart = new Cart({ email: secureEmail, items });
        await cart.save();
      }

      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Error syncing cart', error });
    }
  }
};

module.exports = cartCtrl;