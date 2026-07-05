const express = require('express');
const router = express.Router();
const wishlistCtrl = require('../controllers/wishlistCtrl');

router.get('/', wishlistCtrl.getWishlist);

router.post('/toggle', wishlistCtrl.toggleWishlist);

module.exports = router;