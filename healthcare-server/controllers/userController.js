const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('verifyToken: Authorization header:', authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('verifyToken: Decoded token:', decoded);
    req.userId = decoded.id; // Match JWT payload 'id'
    next();
  } catch (error) {
    console.error('verifyToken: Token verification error:', error.message);
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

    const accessToken = jwt.sign(
      { id: user._id.toString(), email: user.email, name: user.firstName + " " + user.lastName },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    console.log('loginUser: Generated token for id:', user._id.toString());

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
        lastName: newUser.firstName,
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

const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('getUserById: Requested userId:', userId, 'req.userId:', req.userId);
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
    console.log('updateUser: Requested userId:', userId, 'req.userId:', req.userId);
    if (userId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const { weight, height } = req.body;

    if (weight !== undefined && weight !== null && (weight <= 0 || weight > 500)) {
      return res.status(400).json({ message: 'Weight must be between 1-500 kg' });
    }

    if (height !== undefined && height !== null && (height <= 0 || height > 300)) {
      return res.status(400).json({ message: 'Height must be between 1-300 cm' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { weight, height },
      { new: true, select: '-password' }
    );

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

module.exports = {
  verifyToken,
  getAllUsers,
  loginUser,
  registerUser,
  getUserById,
  updateUser,
  getUserByEmail,
  getUsersByRole,
};