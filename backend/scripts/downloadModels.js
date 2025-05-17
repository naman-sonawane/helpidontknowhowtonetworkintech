// scripts/downloadModels.js
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { promisify } = require('util');
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

const modelsDir = path.join(__dirname, '../models/face-api-models');

// Ensure models directory exists
async function ensureDir(dirPath) {
  try {
    await mkdir(dirPath, { recursive: true });
    console.log(`Directory created: ${dirPath}`);
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

// Download file from URL
async function downloadFile(url, filePath) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
    }
    
    const buffer = await response.buffer();
    await writeFile(filePath, buffer);
    console.log(`Downloaded: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`Error downloading ${url}:`, error);
    throw error;
  }
}

// Download models
async function downloadModels() {
  try {
    // Create models directory
    await ensureDir(modelsDir);
    
    // Use the face-api.js GitHub repository for model files
    const baseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
    const models = [
      // SSD MobileNet
      'ssd_mobilenetv1_model-weights_manifest.json',
      'ssd_mobilenetv1_model-shard1',
      // Face Landmark
      'face_landmark_68_model-weights_manifest.json',
      'face_landmark_68_model-shard1',
      // Face Recognition - ADDING SHARD2 HERE
      'face_recognition_model-weights_manifest.json',
      'face_recognition_model-shard1',
      'face_recognition_model-shard2',
      // Tiny Face Detector
      'tiny_face_detector_model-weights_manifest.json',
      'tiny_face_detector_model-shard1'
    ];
    
    // Download all model files
    for (const model of models) {
      const url = `${baseUrl}/${model}`;
      const filePath = path.join(modelsDir, model);
      await downloadFile(url, filePath);
    }
    
    console.log('All models downloaded successfully');
  } catch (error) {
    console.error('Error downloading models:', error);
  }
}

// Let's try an alternative approach with a mirror
async function downloadModelsFromMirror() {
  try {
    // Create models directory
    await ensureDir(modelsDir);
    
    // Use a different source for models
    console.log('Trying alternative model source...');
    const modelsInfo = [
      {
        name: 'tiny_face_detector',
        url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json',
        files: [
          'tiny_face_detector_model-shard1'
        ]
      },
      {
        name: 'face_landmark_68',
        url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json',
        files: [
          'face_landmark_68_model-shard1'
        ]
      },
      {
        name: 'face_recognition',
        url: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json',
        files: [
          'face_recognition_model-shard1',
          'face_recognition_model-shard2'
        ]
      }
    ];
    
    // Download manifests and read them
    for (const model of modelsInfo) {
      // Download manifest
      const manifestPath = path.join(modelsDir, `${model.name}_model-weights_manifest.json`);
      await downloadFile(model.url, manifestPath);
      
      // Download model shards
      for (const file of model.files) {
        const fileUrl = `https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/${file}`;
        const filePath = path.join(modelsDir, file);
        await downloadFile(fileUrl, filePath);
      }
    }
    
    console.log('All models downloaded successfully via mirror');
  } catch (error) {
    console.error('Error downloading models from mirror:', error);
    throw error;
  }
}

// Try both methods
async function downloadAllModels() {
  try {
    await downloadModels();
  } catch (error) {
    console.error('Primary download method failed, trying alternative...');
    await downloadModelsFromMirror();
  }
}

downloadAllModels();