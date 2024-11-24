const express = require('express');
const { register, login, requestPasswordReset,verifyOtpAndChangePassword  } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', requestPasswordReset);
router.post('/verify-otp', verifyOtpAndChangePassword);

module.exports = router;
