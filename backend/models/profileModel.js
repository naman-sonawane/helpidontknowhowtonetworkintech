// models/profileModel.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  linkedinId: String,
  profileUrl: { type: String, required: true },
  headline: String,
  industry: String,
  location: String,
  conversationStarters: [String],
  interests: [String],
  faceDescriptor: { type: Array, required: true }, // numerical face embedding vector
  createdAt: { type: Date, default: Date.now }
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;