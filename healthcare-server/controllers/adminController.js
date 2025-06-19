const User = require('../models/userModel');

const getPendingDoctors = async (req, res) => {
  try {
    const pendingDoctors = await User.find({ role: 'doctor', status: 'pending' }).select('-password');
    res.status(200).json({
      message: 'Pending doctors fetched successfully',
      doctors: pendingDoctors,
    });
  } catch (error) {
    console.error('getPendingDoctors: Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const approveDoctor = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor' || doctor.status !== 'pending') {
      return res.status(404).json({ message: 'Doctor not found or already processed' });
    }

    doctor.status = 'approved';
    doctor.isActive = true;
    await doctor.save();

    res.status(200).json({
      message: 'Doctor approved successfully',
      doctor: {
        id: doctor._id.toString(),
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        specialty: doctor.specialty,
        licenseNumber: doctor.licenseNumber,
        status: doctor.status,
        isActive: doctor.isActive,
      },
    });
  } catch (error) {
    console.error('approveDoctor: Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const rejectDoctor = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor' || doctor.status !== 'pending') {
      return res.status(404).json({ message: 'Doctor not found or already processed' });
    }

    doctor.status = 'rejected';
    await doctor.save();

    res.status(200).json({
      message: 'Doctor rejected successfully',
      doctor: {
        id: doctor._id.toString(),
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        specialty: doctor.specialty,
        licenseNumber: doctor.licenseNumber,
        status: doctor.status,
      },
    });
  } catch (error) {
    console.error('rejectDoctor: Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPendingDoctors,
  approveDoctor,
  rejectDoctor,
};