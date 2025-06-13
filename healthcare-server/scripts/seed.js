const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});

    // Create admin account
    const admin = new User({
      email: 'ridebuddy.teams@gmail.com',
      password: 'admin@healthcare',
      name: 'Admin',
      role: 'admin',
    });
    await admin.save();
    console.log('Admin account created');

    // Create sample doctors
    const doctors = [
      {
        email: 'dr.smith@example.com',
        password: 'doctor123',
        name: 'Dr. John Smith',
        role: 'doctor',
        specialty: 'Cardiology',
        availability: [
          { date: '2025-06-15', startTime: '10:00', endTime: '10:30', status: 'available' },
          { date: '2025-06-15', startTime: '11:00', endTime: '11:30', status: 'available' },
        ],
      },
      {
        email: 'dr.jones@example.com',
        password: 'doctor123',
        name: 'Dr. Sarah Jones',
        role: 'doctor',
        specialty: 'Pediatrics',
        availability: [
          { date: '2025-06-15', startTime: '14:00', endTime: '14:30', status: 'available' },
          { date: '2025-06-15', startTime: '15:00', endTime: '15:30', status: 'available' },
        ],
      },
    ];

    for (const doc of doctors) {
      const user = new User({
        email: doc.email,
        password: doc.password,
        name: doc.name,
        role: doc.role,
      });
      await user.save();
      const doctor = new Doctor({
        userId: user._id,
        name: doc.name,
        specialty: doc.specialty,
        availability: doc.availability,
      });
      await doctor.save();
      console.log(`Doctor ${doc.name} created`);
    }

    console.log('Database seeded successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error('Seeding error:', err);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDB();