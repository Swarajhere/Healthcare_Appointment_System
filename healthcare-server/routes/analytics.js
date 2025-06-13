const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');

router.get('/appointments', auth(['admin']), async (req, res) => {
  try {
    const appointments = await Appointment.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          booked: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
          canceled: { $sum: { $cond: [{ $eq: ['$status', 'canceled'] }, 1, 0] } },
        },
      },
      { $sort: { '_id': 1 } },
    ]);

    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = {
      labels: appointments.map((a) => labels[a._id - 1]),
      booked: appointments.map((a) => a.booked),
      canceled: appointments.map((a) => a.canceled),
    };
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;