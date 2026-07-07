// backend/routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const wishlistCtrl = require('../controllers/wishlistCtrl');

// The route to save/update the wishlist
router.post('/sync', wishlistCtrl.syncWishlist);

// The route to fetch the wishlist
router.get('/:email', wishlistCtrl.getWishlist);

module.exports = router;