const User = require('../models/User');

const wishlistCtrl = {
  // 1. Toggle Item in Wishlist (Using ID)
  toggleWishlist: async (req, res) => {
    try {
      const { userEmail, productId } = req.body;
      
      const user = await User.findOne({ email: userEmail });
      if (!user) return res.status(404).json({ message: "User not found" });

      // Check if the ID already exists in the array
      const itemIndex = user.wishlist.indexOf(productId);

      if (itemIndex > -1) {
        // If it exists, remove it
        user.wishlist.splice(itemIndex, 1);
        await user.save();
        return res.json({ message: "Removed from wishlist", wishlist: user.wishlist });
      } else {
        // If it doesn't exist, push the product ID
        user.wishlist.push(productId);
        await user.save();
        return res.json({ message: "Added to wishlist", wishlist: user.wishlist });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // 2. Get User's Wishlist Data
  getWishlist: async (req, res) => {
    try {
      const { email } = req.query;
      
      // .populate('wishlist') looks at the IDs in the array and automatically 
      // fetches the full product details (name, price, image) from the Product collection!
      const user = await User.findOne({ email }).populate('wishlist');
      
      if (!user) return res.status(404).json({ message: "User not found" });
      
      return res.json(user.wishlist);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = wishlistCtrl;