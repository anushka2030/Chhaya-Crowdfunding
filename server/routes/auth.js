require('dotenv').config();

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const sendOTPEmail = require('../utils/sendEmail');

// Helper to generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// === REQUEST OTP ===
router.post('/request-otp', async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    if (!user) {
      // Only store OTP for now; defer full registration
      user = new User({ email, otp, otpExpiry });
      await user.save({ validateBeforeSave: false });
    } else {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save({ validateBeforeSave: false });
    }

    await sendOTPEmail(email, otp);

    res.json({ msg: 'OTP sent to your email' });
    console.log('OTP:', otp);
console.log('Saving user with email:', email);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error while sending OTP' });
  }
});

// === VERIFY OTP ===
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save({ validateBeforeSave: false });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error during OTP verification' });
  }
});

// === REGISTER ===
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let existingUser = await User.findOne({ email });
    if (existingUser && existingUser.password) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    if (existingUser) {
      // Complete the profile if already created via OTP
      existingUser.name = name;
      existingUser.password = hashedPassword;
      user = await existingUser.save();
    } else {
      // Create new user
      user = new User({ name, email, password: hashedPassword });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error during registration' });
  }
});

// === LOGIN ===
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error during login' });
  }
});

module.exports = router;
