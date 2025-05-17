// routes/faceRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const Profile = require('../models/profileModel');
const { extractFaceDescriptor, findMatchingFace } = require('../faceRec/faceRecognition');

// Match a face from uploaded image
router.post('/match', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }
    
    const imageBuffer = req.file.buffer;
    
    // Extract face descriptor from uploaded image
    const faceDescriptor = await extractFaceDescriptor(imageBuffer);
    
    // Get all profiles from database
    const profiles = await Profile.find({});
    
    // Find matching face
    const matchingProfile = await findMatchingFace(faceDescriptor, profiles);
    
    if (matchingProfile) {
      // Don't send back the face descriptor in the response
      const { faceDescriptor, ...profileData } = matchingProfile.toObject();
      res.json({ success: true, profile: profileData });
    } else {
      res.json({ success: false, message: 'No matching profile found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;