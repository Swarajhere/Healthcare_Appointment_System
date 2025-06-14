const express = require('express');
const userRoutes = require('./routes/userRoutes');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json()); // Middleware to parse JSON
app.use('/api', userRoutes); // Mount user routes

module.exports = app;
