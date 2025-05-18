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
    const profiles = await Profile.find({}, { faceDescriptor: 0 }); // Exclude face descriptor from results
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
    
    // Generate conversation starters based on profile
    const conversationStarters = generateConversationStarters(profileData);
    
    // Create new profile
    const profile = new Profile({
      name: profileData.rawData?.full_name || profileData.name,
      linkedinUrl: profileData.linkedinUrl,
      rawData: profileData.rawData || {
        full_name: profileData.name,
        headline: profileData.headline,
        location: profileData.location,
        education: profileData.education || [],
        work_experience: profileData.workExperience || []
      },
      summary: profileData.summary || '',
      conversationStarters: conversationStarters,
      interests: profileData.interests || [],
      faceDescriptor: Array.from(faceDescriptor)
    });
    
    // Save profile to database
    const savedProfile = await profile.save();
    
    // Don't return the face descriptor in the response
    const { faceDescriptor: _, ...responseProfile } = savedProfile.toObject();
    res.status(201).json(responseProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Function to generate conversation starters based on profile
function generateConversationStarters(profile) {
  const starters = [];
  const rawData = profile.rawData || profile;
    
  return starters;
}

module.exports = router;