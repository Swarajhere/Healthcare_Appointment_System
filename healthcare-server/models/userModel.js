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
  role: { type: String, enum: ['user', 'doctor', 'admin'], default: 'user' }
});

module.exports = mongoose.model('User', userSchema);