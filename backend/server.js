// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Import routes
const profileRoutes = require('./routes/profileRoutes');
const faceRoutes = require('./routes/faceRoutes');

// Use routes
app.use('/api/profiles', profileRoutes);
app.use('/api/face', faceRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Face Recognition API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});