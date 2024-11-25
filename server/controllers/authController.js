const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { validateInput } = require('../utils/validateInput');
const  generateToken  = require('../utils/generateToken');



const sendErrorResponse = (res, statusCode, errors) => {
  return res.status(statusCode).json({ errors });
};


const getMe = async (req, res) => {
  // console.log("hii");
  try {
    // Fetch user data from the database using req.user._id
    const responce = await User.findOne({ _id: req.user._id }).select("-password");

    if (!responce) {
      // Return immediately after sending the response to avoid further execution
      return res.status(400).json({ success: false, error: "User not found" });
    }

    // Respond with the user data
    res.status(200).json({ success: true, responce });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};



const authLogout =  async(req, res) => {
  try {
      res.cookie("jwt","",{maxAge:0})
      res.status(200).json({success:true,message:"logout successfully"})
  } catch (error) {
      res.status(500).json({ success: true, error: "internal server error" })
  }
}



const register = async (req, res) => {
  const { username, email, password } = req.body;

  const validationErrors = validateInput({ username, email, password });
  if (validationErrors.length > 0) {
    return sendErrorResponse(res, 400, validationErrors);
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      const conflictField = existingUser.email === email ? 'email' : 'username';
      return sendErrorResponse(res, 400, [
        { 
          message: `${conflictField.charAt(0).toUpperCase() + conflictField.slice(1)} is already in use`,
          field: conflictField,
          type: 'conflict'
        }
      ]);
    }

    const newUser = await User.create({ username, email, password });
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error('Error during registration:', error);
    return sendErrorResponse(res, 500, [
      { message: 'Server error. Please try again later.', type: 'server' }
    ]);
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email,password)

 
  const validationErrors = validateInput({ email, password });
  if (validationErrors.length > 0) {
    return sendErrorResponse(res, 400, validationErrors);
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return sendErrorResponse(res, 400, [
        { message: 'Invalid credentials', field: 'email', type: 'authentication' }
      ]);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendErrorResponse(res, 400, [
        { message: 'Invalid credentials', field: 'password', type: 'authentication' }
      ]);
    }

  
     generateToken(user._id,res)

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error during login:', error);
    return sendErrorResponse(res, 500, [
      { message: 'Server error. Please try again later.', type: 'server' }
    ]);
  }
};


const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  const validationErrors = validateInput({ email, password });
  if (validationErrors.length > 0) {
    return sendErrorResponse(res, 400, validationErrors);
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = crypto.randomInt(100000, 999999).toString();

    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 600000; 
    await user.save();

  
    const subject = 'Password Reset OTP';
    const text = `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.`;
    await sendEmail(user.email, subject, text);

    return res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


const verifyOtpAndChangePassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!otp || !newPassword) {
    return res.status(400).json({ message: 'OTP and new password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (Date.now() > user.resetOtpExpiry) {
      return res.status(400).json({ message: 'OTP has expired' });
    }
    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {getMe,authLogout, register, login, requestPasswordReset,verifyOtpAndChangePassword };
