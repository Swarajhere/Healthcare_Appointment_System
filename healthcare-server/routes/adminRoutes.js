const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, restrictTo } = require('../middlewares/auth-middleware');

router.get('/doctors/pending', verifyToken, restrictTo('admin'), adminController.getPendingDoctors);
router.put('/doctors/approve/:doctorId', verifyToken, restrictTo('admin'), adminController.approveDoctor);
router.put('/doctors/reject/:doctorId', verifyToken, restrictTo('admin'), adminController.rejectDoctor);

module.exports = router;