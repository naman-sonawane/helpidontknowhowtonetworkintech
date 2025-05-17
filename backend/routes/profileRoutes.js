// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const Profile = require('../models/profileModel');
const { extractFaceDescriptor } = require('../faceRec/faceRecognition');

// Get all profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find({});
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new profile with face image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }
    
    const profileData = JSON.parse(req.body.profileData);
    const imageBuffer = req.file.buffer;
    
    // Extract face descriptor
    const faceDescriptor = await extractFaceDescriptor(imageBuffer);
    
    // Create new profile
    const profile = new Profile({
      name: profileData.name,
      linkedinId: profileData.linkedinId,
      profileUrl: profileData.profileUrl,
      headline: profileData.headline,
      industry: profileData.industry,
      location: profileData.location,
      conversationStarters: profileData.conversationStarters || [],
      interests: profileData.interests || [],
      faceDescriptor: Array.from(faceDescriptor)
    });
    
    // Save profile to database
    const savedProfile = await profile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;