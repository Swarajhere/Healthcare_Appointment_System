const express = require('express');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes'); // New admin routes
const appointmentRoutes = require("./routes/appointmentRoutes");
const auth = require('./routes/auth'); // Import auth routes
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json()); // Middleware to parse JSON
app.use('/api', userRoutes); // Mount user routes
app.use('/api/admin', adminRoutes); // Mount admin routes
app.use("/api", appointmentRoutes);
app.use('/api/auth', auth); // Mount auth routes

module.exports = app;