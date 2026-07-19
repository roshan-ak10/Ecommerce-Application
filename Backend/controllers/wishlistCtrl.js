// backend/controllers/wishlistCtrl.js
const Wishlist = require('../models/Wishlist');

const wishlistCtrl = {
  
  // 1. GET WISHLIST
  getWishlist: async (req, res) => {
    try {
      // Find the wishlist by the email passed in the URL
      const secureEmail = req.user.email; 

      let wishlist = await Wishlist.findOne({ email: secureEmail });
      
      // If they don't have a wishlist yet, return an empty array
      if (!wishlist) {
        return res.status(200).json({ items: [] });
      }
      
      res.status(200).json(wishlist);
    } catch (error) {
      console.error("Fetch wishlist error:", error);
      res.status(500).json({ message: 'Error fetching wishlist', error });
    }
  },

  // 2. SYNC WISHLIST
  syncWishlist: async (req, res) => {
    const { items } = req.body;
          const secureEmail = req.user.email; 


    try {
      let wishlist = await Wishlist.findOne({ email:secureEmail });

      // If the wishlist exists, update the items. Otherwise, create a new one.
      if (wishlist) {
        wishlist.items = items;
        await wishlist.save();
      } else {
        wishlist = new Wishlist({ email:secureEmail , items });
        await wishlist.save();
      }

      res.status(200).json(wishlist);
    } catch (error) {
      console.error("Sync wishlist error:", error);
      res.status(500).json({ message: 'Error syncing wishlist', error });
    }
  }
};

module.exports = wishlistCtrl;