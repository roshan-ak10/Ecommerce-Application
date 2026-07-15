const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/orderCtrl');

// Import your security bouncers
const { authenticate, protectAdmin } = require('../middleware/authMiddleware');

// --- Standard User Routes ---
// Must be logged in to place or view their own orders
router.post('/create', authenticate, orderCtrl.createOrder);
router.get('/my-orders', authenticate, orderCtrl.getUserOrders);

// --- Admin Only Routes ---
// Only you can see all orders and approve them
router.get('/admin/all', authenticate, protectAdmin, orderCtrl.getAllOrders);
router.put('/admin/update/:id', authenticate, protectAdmin, orderCtrl.updateOrderStatus);

module.exports = router;