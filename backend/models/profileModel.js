// models/profileModel.js
const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  school: String,
  degree: String,
  years: String
}, { _id: false });

const workExperienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  duration: String
}, { _id: false });

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  linkedinUrl: { type: String, required: true },
  rawData: {
    full_name: String,
    headline: String,
    location: String,
    education: [educationSchema],
    work_experience: [workExperienceSchema]
  },
  summary: String,
  conversationStarters: [String],
  interests: [String],
  faceDescriptor: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;