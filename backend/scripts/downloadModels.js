// scripts/downloadModels.js
const fs = require('fs');
const path = require('path');
const https = require('https');
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
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    https.get(url, response => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      const fileStream = fs.createWriteStream(filePath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${filePath}`);
        resolve();
      });
      
      fileStream.on('error', err => {
        fs.unlink(filePath, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

// Download models
async function downloadModels() {
  const baseUrl = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
  const models = [
    'ssd_mobilenetv1_model-weights_manifest.json',
    'ssd_mobilenetv1_model-shard1',
    'face_landmark_68_model-weights_manifest.json',
    'face_landmark_68_model-shard1',
    'face_recognition_model-weights_manifest.json',
    'face_recognition_model-shard1'
  ];
  
  try {
    await ensureDir(modelsDir);
    
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

downloadModels();