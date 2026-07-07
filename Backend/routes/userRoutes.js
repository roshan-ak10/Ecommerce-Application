const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userCtrl');

router.post('/register', userCtrl.registerUser);
router.post('/login', userCtrl.loginUser);
router.post('/logout', userCtrl.logoutUser);
router.post('/add-address', userCtrl.addAddress);
router.put('/edit-address', userCtrl.editAddress);
router.delete('/delete-address/:email/:addressId', userCtrl.deleteAddress);
router.get('/:email', userCtrl.getUserProfile);

module.exports = router;