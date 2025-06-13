const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validate = require('../middleware/validate');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post(
  '/register',
  validate([
    check('email').isEmail().withMessage('Invalid email'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    check('name').notEmpty().withMessage('Name is required'),
    check('role').isIn(['patient', 'doctor', 'admin']).withMessage('Invalid role'),
  ]),
  async (req, res) => {
    try {
      const { email, password, name, role } = req.body;
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ error: 'User already exists' });

      user = new User({ email, password, name, role });
      await user.save();

      const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.status(201).json({ user: { _id: user._id, email, name, role }, token });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.post(
  '/login',
  validate([
    check('email').isEmail().withMessage('Invalid email'),
    check('password').notEmpty().withMessage('Password is required'),
  ]),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ user: { _id: user._id, email: user.email, name: user.name, role: user.role }, token });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;