const express = require('express');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes'); // New admin routes
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json()); // Middleware to parse JSON
app.use('/api', userRoutes); // Mount user routes
app.use('/api/admin', adminRoutes); // Mount admin routes

module.exports = app;