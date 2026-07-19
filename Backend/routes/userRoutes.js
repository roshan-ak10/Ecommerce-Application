const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userCtrl');

const { authenticate } = require('../middleware/authMiddleware');

router.post('/register', userCtrl.registerUser);
router.post('/login', userCtrl.loginUser);
router.post('/logout', userCtrl.logoutUser);
router.post('/add-address',authenticate, userCtrl.addAddress);
router.put('/edit-address',authenticate, userCtrl.editAddress);
router.delete('/delete-address/:addressId',authenticate, userCtrl.deleteAddress);
router.get('/profile',authenticate, userCtrl.getProfile);

module.exports = router;