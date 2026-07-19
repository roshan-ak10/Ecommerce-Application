// backend/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartCtrl = require('../controllers/cartCtrl'); 

const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.post('/sync', cartCtrl.syncCart);

// CHANGED: The URL parameter is now :email instead of :username
router.get('/me', authenticate, cartCtrl.getCart); // put above /:email

module.exports = router;