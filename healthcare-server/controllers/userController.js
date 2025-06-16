const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.firstName + " " + user.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // 3. Login successful
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        gender: user.gender
      },
      token: accessToken,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Register user
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, age, gender, role } = req.body;

    // Trim inputs to remove accidental spaces
    const trimmedFirstName = firstName?.trim();
    const trimmedLastName = lastName?.trim();
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedRole = role?.trim();

    // 1. Basic field validation
    if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !password || !age || !gender) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // 3. Password strength validation
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    // 4. Age validation
    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid age provided' });
    }

    // 5. Gender validation
    if (!['Male', 'Female'].includes(gender)) {
      return res.status(400).json({ success: false, message: 'Invalid gender value' });
    }

    // 6. Role validation (optional, defaults to 'user')
    const validRoles = ['user', 'doctor', 'admin'];
    const userRole = trimmedRole && validRoles.includes(trimmedRole) ? trimmedRole : 'user';

    // 7. Check for existing user
    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // 8. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 9. Create and save user
    const newUser = new User({
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      email: trimmedEmail,
      password: hashedPassword,
      age: parsedAge,
      gender,
      role: userRole
    });

    await newUser.save();

    // 10. Return success
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        age: newUser.age,
        gender: newUser.gender,
        role: newUser.role
      }
    });

  } catch (err) {
    console.error('❌ Register Route Error:', err.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Find user by ID and exclude password
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by email
exports.getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by email:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUsersByRole = async (req, res) => {
  try {
    const role = req.params.role;
    const validRoles = ['user', 'doctor', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided' });
    }
    const users = await User.find({ role }).select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users by role:', error);
    res.status(500).json({ message: 'Server error' });
  }
};