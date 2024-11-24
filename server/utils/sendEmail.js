const nodemailer = require('nodemailer');
const User = require('../models/User'); // Adjust the path to your User model
const crypto = require('crypto'); // For generating OTP
const bcrypt = require('bcryptjs'); // For hashing the new password

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use the email service of your choice
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error('Failed to send email');
  }
};


module.exports=sendEmail
