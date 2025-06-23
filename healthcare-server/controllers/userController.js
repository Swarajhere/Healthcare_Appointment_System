const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    console.error('verifyToken: Error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (user.role === 'doctor') {
      if (user.status === 'pending') {
        return res.status(403).json({ message: 'Your registration is pending admin approval.' });
      }
      if (user.status === 'rejected') {
        return res.status(403).json({ message: 'Your registration was rejected.' });
      }
      if (!user.isActive) {
        return res.status(403).json({ message: 'Your account is inactive. Contact support.' });
      }
    }

    const accessToken = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        gender: user.gender,
        weight: user.weight,
        height: user.height,
        role: user.role,
        specialty: user.specialty,
        licenseNumber: user.licenseNumber,
        yearsOfExperience: user.yearsOfExperience,
        status: user.status,
      },
      token: accessToken,
    });
  } catch (error) {
    console.error('loginUser: Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, age, gender, role } = req.body;

    const trimmedFirstName = firstName?.trim();
    const trimmedLastName = lastName?.trim();
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedRole = role?.trim();

    if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !password || !age || !gender) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid age provided' });
    }

    if (!['Male', 'Female'].includes(gender)) {
      return res.status(400).json({ success: false, message: 'Invalid gender value' });
    }

    const validRoles = ['user', 'doctor', 'admin'];
    const userRole = trimmedRole && validRoles.includes(trimmedRole) ? trimmedRole : 'user';

    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      email: trimmedEmail,
      password: hashedPassword,
      age: parsedAge,
      gender,
      role: userRole,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: newUser._id.toString(),
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        age: newUser.age,
        gender: newUser.gender,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error('registerUser: Error:', err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const registerDoctor = async (req, res) => {
  try {
    const { firstName, lastName, email, password, specialty, licenseNumber, yearsOfExperience, clinicAddress, receptionNumber } = req.body;

    if (!firstName || !lastName || !email || !password || !specialty || !licenseNumber || yearsOfExperience === undefined || !clinicAddress) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const parsedYears = parseInt(yearsOfExperience, 10);
    if (isNaN(parsedYears) || parsedYears < 0 || parsedYears > 50) {
      return res.status(400).json({ message: 'Years of experience must be between 0 and 50' });
    }

    const trimmedAddress = clinicAddress.trim();
    if (trimmedAddress.length === 0 || trimmedAddress.length > 200) {
      return res.status(400).json({ message: 'Clinic address must be 1-200 characters' });
    }

    if (receptionNumber) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(receptionNumber.trim())) {
        return res.status(400).json({ message: 'Invalid reception number format' });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newDoctor = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: 'doctor',
      specialty: specialty.trim(),
      licenseNumber: licenseNumber.trim(),
      yearsOfExperience: parsedYears,
      clinicAddress: trimmedAddress,
      receptionNumber: receptionNumber ? receptionNumber.trim() : undefined,
      status: 'pending',
      isActive: false,
      age: 0,
      gender: 'Male',
    });

    await newDoctor.save();

    res.status(201).json({
      message: 'Doctor registration submitted. Awaiting admin approval.',
      data: {
        id: newDoctor._id.toString(),
        email: newDoctor.email,
        role: newDoctor.role,
      },
    });
  } catch (error) {
    console.error('registerDoctor: Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (userId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User fetched successfully',
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        gender: user.gender,
        weight: user.weight,
        height: user.height,
        role: user.role,
        specialty: user.specialty,
        licenseNumber: user.licenseNumber,
        yearsOfExperience: user.yearsOfExperience,
      },
    });
  } catch (error) {
    console.error('getUserById: Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (userId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const { firstName, lastName, age, gender, weight, height } = req.body;

    if (firstName !== undefined && (!firstName.trim() || firstName.length > 50)) {
      return res.status(400).json({ message: 'First name must be 1-50 characters' });
    }

    if (lastName !== undefined && (!lastName.trim() || lastName.length > 50)) {
      return res.status(400).json({ message: 'Last name must be 1-50 characters' });
    }

    if (age !== undefined && (isNaN(age) || age <= 0 || age > 120)) {
      return res.status(400).json({ message: 'Age must be between 1 and 120' });
    }

    if (gender !== undefined && !['Male', 'Female'].includes(gender)) {
      return res.status(400).json({ message: 'Gender must be Male or Female' });
    }

    if (weight !== undefined && weight !== null && (weight <= 0 || weight > 500)) {
      return res.status(400).json({ message: 'Weight must be between 1-500 kg' });
    }

    if (height !== undefined && height !== null && (height <= 0 || height > 300)) {
      return res.status(400).json({ message: 'Height must be between 1-300 cm' });
    }

    const updateData = {
      ...(firstName && { firstName: firstName.trim() }),
      ...(lastName && { lastName: lastName.trim() }),
      ...(age && { age: parseInt(age) }),
      ...(gender && { gender }),
      ...(weight !== undefined && { weight }),
      ...(height !== undefined && { height }),
    };

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true, select: '-password' });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        gender: user.gender,
        weight: user.weight,
        height: user.height,
        role: user.role,
        yearsOfExperience: user.yearsOfExperience,
      },
    });
  } catch (error) {
    console.error('updateUser: Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      message: 'User fetched successfully',
      user,
    });
  } catch (error) {
    console.error('getUserByEmail: Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUsersByRole = async (req, res) => {
  try {
    const role = req.params.role;
    const validRoles = ['user', 'doctor', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided' });
    }
    const users = await User.find({ role }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('getUsersByRole: Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.userId;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New password and confirmation do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    if (await bcrypt.compare(newPassword, user.password)) {
      return res.status(400).json({ message: 'New password must be different from the old password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully', success: true });
  } catch (error) {
    console.error('resetPassword: Error:', error.message);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = otpExpires;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent to your email', success: true });
  } catch (error) {
    console.error('forgotPassword: Error:', error.message);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

const verifyOtpAndReset = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New password and confirmation do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp || user.resetPasswordOtpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    if (await bcrypt.compare(newPassword, user.password)) {
      return res.status(400).json({ message: 'New password must be different from the old password' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful', success: true });
  } catch (error) {
    console.error('verifyOtpAndReset: Error:', error.message);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

module.exports = {
  verifyToken,
  getAllUsers,
  loginUser,
  registerUser,
  registerDoctor,
  getUserById,
  updateUser,
  getUserByEmail,
  getUsersByRole,
  resetPassword,
  forgotPassword,
  verifyOtpAndReset,
};