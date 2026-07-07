// backend/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartCtrl = require('../controllers/cartCtrl'); 

router.post('/sync', cartCtrl.syncCart);

// CHANGED: The URL parameter is now :email instead of :username
router.get('/:email', cartCtrl.getCart);

module.exports = router;