// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import face recognition util
const { loadModels } = require('./faceRec/faceRecognition');

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

// Check if face-api models exist
const MODELS_PATH = path.join(__dirname, 'models/face-api-models');
const modelsExist = fs.existsSync(MODELS_PATH) && 
  fs.readdirSync(MODELS_PATH).length > 0;

// Start server after loading models
async function startServer() {
  try {
    // Only load models if they exist
    if (modelsExist) {
      console.log('Loading face recognition models...');
      await loadModels();
      console.log('Face recognition models loaded successfully');
    } else {
      console.error('Face recognition models not found in:', MODELS_PATH);
      console.error('Please run: npm run download-models');
      process.exit(1);
    }

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
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();