const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const sendEmail = require('../utils/sendEmail');

router.post(
  '/',
  [
    auth(['patient']),
    validate([
      check('doctorId').isMongoId().withMessage('Invalid doctor ID'),
      check('date').isISO8601().withMessage('Invalid date'),
      check('startTime').notEmpty().withMessage('Start time is required'),
      check('endTime').notEmpty().withMessage('End time is required'),
    ]),
  ],
  async (req, res) => {
    try {
      const { doctorId, date, startTime, endTime } = req.body;
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

      const isAvailable = doctor.availability.some(
        (slot) => slot.date === date && slot.startTime === startTime && slot.status === 'available'
      );
      if (!isAvailable) return res.status(400).json({ error: 'Slot not available' });

      const appointment = new Appointment({
        patientId: req.user._id,
        doctorId,
        date,
        startTime,
        endTime,
        status: 'confirmed',
      });
      await appointment.save();

      doctor.availability = doctor.availability.map((slot) =>
        slot.date === date && slot.startTime === startTime ? { ...slot, status: 'booked' } : slot
      );
      await doctor.save();

      const user = await User.findById(req.user._id);
      await sendEmail({
        to: user.email,
        subject: 'Appointment Confirmation',
        text: `Your appointment with ${doctor.name} on ${date} at ${startTime} is confirmed.`,
      });

      res.status(201).json(appointment);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

router.get('/patient/:id', auth(['patient']), async (req, res) => {
  try {
    if (req.user._id !== req.params.id) return res.status(403).json({ error: 'Unauthorized' });
    const appointments = await Appointment.find({ patientId: req.params.id }).populate('doctorId', 'name specialty');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/doctor/:id', auth(['doctor']), async (req, res) => {
  try {
    if (req.user._id !== req.params.id) return res.status(403).json({ error: 'Unauthorized' });
    const appointments = await Appointment.find({ doctorId: req.params.id }).populate('patientId', 'name email');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', auth(['admin']), async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('patientId', 'name email').populate('doctorId', 'name specialty');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;