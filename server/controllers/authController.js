const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { validateInput } = require('../utils/validateInput');



const sendErrorResponse = (res, statusCode, errors) => {
  return res.status(statusCode).json({ errors });
};






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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({
      message: 'Login successful',
      token,
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


const resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; 
    await user.save();

    const resetUrl = `http://localhost:3000/reset/${resetToken}`;
    await sendEmail(user.email, 'Password Reset', `Reset your password here: ${resetUrl}`);

    res.status(200).json({ message: 'Reset link sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, resetPassword };
