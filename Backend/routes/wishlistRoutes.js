// backend/routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const wishlistCtrl = require('../controllers/wishlistCtrl');

const { authenticate } = require('../middleware/authMiddleware');


// The route to save/update the wishlist
router.post('/sync',authenticate, wishlistCtrl.syncWishlist);

// The route to fetch the wishlist
router.get('/me',authenticate, wishlistCtrl.getWishlist);

module.exports = router;