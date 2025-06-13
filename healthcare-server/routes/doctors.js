const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const Doctor = require('../models/Doctor');

router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('userId', 'name email');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id/availability', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    const availableSlots = doctor.availability.filter((slot) => slot.status === 'available');
    res.json(availableSlots);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post(
  '/',
  [
    auth(['admin']),
    validate([
      check('userId').isMongoId().withMessage('Invalid user ID'),
      check('name').notEmpty().withMessage('Name is required'),
      check('specialty').notEmpty().withMessage('Specialty is required'),
    ]),
  ],
  async (req, res) => {
    try {
      const { userId, name, specialty, availability } = req.body;
      const doctor = new Doctor({ userId, name, specialty, availability: availability || [] });
      await doctor.save();
      res.status(201).json(doctor);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;