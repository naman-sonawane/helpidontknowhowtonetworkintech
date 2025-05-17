// faceRec/faceRecognition.js
const faceapi = require('face-api.js');
const canvas = require('canvas');
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
const path = require('path');

// Path to face-api.js models
const MODELS_PATH = path.join(__dirname, '../models/face-api-models');

// Initialize face recognition
async function loadModels() {
  try {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_PATH);
    console.log('Face recognition models loaded successfully');
  } catch (error) {
    console.error('Error loading face recognition models:', error);
    throw error;
  }
}

// Extract face descriptor from image
async function extractFaceDescriptor(imageBuffer) {
  try {
    const img = await canvas.loadImage(imageBuffer);
    const detections = await faceapi.detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();
    
    if (!detections) {
      throw new Error('No face detected in the image');
    }
    
    return detections.descriptor;
  } catch (error) {
    console.error('Error extracting face descriptor:', error);
    throw error;
  }
}

// Find matching face in database
async function findMatchingFace(faceDescriptor, profiles) {
  try {
    if (!profiles || profiles.length === 0) {
      return null;
    }
    
    let bestMatch = null;
    let minDistance = 0.6; // Threshold for face matching (lower is better)
    
    for (const profile of profiles) {
      if (!profile.faceDescriptor || profile.faceDescriptor.length === 0) {
        continue;
      }
      
      const storedDescriptor = new Float32Array(profile.faceDescriptor);
      const distance = faceapi.euclideanDistance(faceDescriptor, storedDescriptor);
      
      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = profile;
      }
    }
    
    return bestMatch;
  } catch (error) {
    console.error('Error finding matching face:', error);
    throw error;
  }
}

module.exports = {
  loadModels,
  extractFaceDescriptor,
  findMatchingFace
};