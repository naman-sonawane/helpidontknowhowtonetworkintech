// routes/faceRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const Profile = require('../models/profileModel');
const { extractFaceDescriptor, findMatchingFace } = require('../faceRec/faceRecognition'); // adjust path if needed

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
      // Check if matchingProfile has toObject method (Mongoose document)
      const profileData = matchingProfile.toObject 
        ? matchingProfile.toObject() 
        : matchingProfile;
      
      // Remove the face descriptor from the response
      delete profileData.faceDescriptor;
      
      res.json({ 
        success: true, 
        profile: profileData,
        confidence: matchingProfile.confidence || null
      });
    } else {
      res.json({ success: false, message: 'No matching profile found' });
    }
  } catch (error) {
    console.error('Error in face matching:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;