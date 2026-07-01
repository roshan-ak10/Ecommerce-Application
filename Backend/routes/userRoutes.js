const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require('../controllers/userCtrl');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser); // <--- Make sure this line is here!

module.exports = router;