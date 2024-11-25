const express = require('express');
const { register, login, requestPasswordReset,verifyOtpAndChangePassword ,getMe } = require('../controllers/authController');
const protectRoute = require('../middleware/protectedRoute');
const router = express.Router();


router.get("/me",protectRoute,getMe)
router.post('/register', register);
router.post('/login' , login);
router.post('/reset-password', requestPasswordReset);
router.post('/verify-otp', verifyOtpAndChangePassword);

module.exports = router;
