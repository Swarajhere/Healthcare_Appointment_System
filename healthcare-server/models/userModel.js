const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  weight: { type: Number, min: 1, max: 500, default: null },
  height: { type: Number, min: 1, max: 300, default: null },
  role: { type: String, enum: ['user', 'doctor', 'admin'], default: 'user' },
  specialty: { type: String }, // Doctor-specific field
  licenseNumber: { type: String }, // Doctor-specific field
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' }, // For doctor approval workflow
  isActive: { type: Boolean, default: true }, // Inactive until approved for doctors
});

module.exports = mongoose.model('User', userSchema);