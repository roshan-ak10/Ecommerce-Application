const express = require('express');
const router = express.Router();
const couponCtrl = require('../controllers/couponCtrl');

router.get('/active', couponCtrl.getActiveCoupons);
router.post('/validate', couponCtrl.validateCoupon);
router.post('/create', couponCtrl.createCoupon); // Admin use

module.exports = router;