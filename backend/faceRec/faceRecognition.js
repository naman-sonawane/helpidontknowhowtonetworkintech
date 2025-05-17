// faceRec/faceRecognition.js
const faceapi = require('face-api.js');
const canvas = require('canvas');
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
const path = require('path');
const fs = require('fs');

// Path to face-api.js models
const MODELS_PATH = path.join(__dirname, '../models/face-api-models');

// Initialize face recognition
async function loadModels() {
  try {
    // Check if models exist
    if (!fs.existsSync(MODELS_PATH)) {
      throw new Error(`Models directory not found: ${MODELS_PATH}`);
    }
    
    // List files to confirm models exist
    const files = fs.readdirSync(MODELS_PATH);
    console.log('Models directory contains:', files);
    
    if (files.length === 0) {
      throw new Error('No model files found. Please run the download-models script.');
    }
    
    // Try to load models
    console.log('Loading face recognition models...');
    
    // First try the tiny face detector
    await faceapi.nets.tinyFaceDetector.loadFromDisk(MODELS_PATH);
    console.log('Tiny Face Detector loaded');
    
    // Then load face landmark and recognition models
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_PATH);
    console.log('Face Landmark model loaded');
    
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_PATH);
    console.log('Face Recognition model loaded');
    
    // Verify models are loaded
    const tinyFaceDetectorLoaded = faceapi.nets.tinyFaceDetector.isLoaded;
    const faceLandmarkLoaded = faceapi.nets.faceLandmark68Net.isLoaded;
    const faceRecognitionLoaded = faceapi.nets.faceRecognitionNet.isLoaded;
    
    console.log('Tiny Face Detector loaded:', tinyFaceDetectorLoaded);
    console.log('Face Landmark loaded:', faceLandmarkLoaded);
    console.log('Face Recognition loaded:', faceRecognitionLoaded);
    
    if (!tinyFaceDetectorLoaded || !faceLandmarkLoaded || !faceRecognitionLoaded) {
      throw new Error('One or more models failed to load properly');
    }
    
    return true;
  } catch (error) {
    console.error('Error loading face recognition models:', error);
    throw error;
  }
}

// Extract face descriptor from image
async function extractFaceDescriptor(imageBuffer) {
  try {
    // Load image
    const img = await canvas.loadImage(imageBuffer);
    
    // Use tiny face detector options
    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 320,
      scoreThreshold: 0.5
    });
    
    // Detect face
    const detections = await faceapi.detectSingleFace(img, options)
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
      
      console.log(`Distance to ${profile.name || 'unknown'}: ${distance}`);
      
      if (distance < minDistance) {
        minDistance = distance;
        
        // Clone the profile object to avoid modifying the original
        bestMatch = JSON.parse(JSON.stringify(profile));
        
        // Add confidence score (0-100%, where 100% is perfect match)
        // Transform distance to confidence (0.6 → 0%, 0.0 → 100%)
        const confidence = Math.max(0, Math.min(100, Math.round((1 - distance / 0.6) * 100)));
        bestMatch.confidence = confidence;
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