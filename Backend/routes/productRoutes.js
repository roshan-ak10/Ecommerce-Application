const express = require('express');
const router = express.Router();
const { getProducts, addProduct, updateProduct } = require('../controllers/productCtrl');
const { authenticate, protectAdmin } = require('../middleware/authMiddleware');

// Anyone can view products
router.get('/', getProducts);

// Only authenticated admins can add or update products
router.post('/', authenticate, protectAdmin, addProduct);
router.put('/:id', authenticate, protectAdmin, updateProduct);

module.exports = router;