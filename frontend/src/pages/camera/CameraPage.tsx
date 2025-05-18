import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Camera() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [whereMet, setWhereMet] = useState('');
  const [photoData, setPhotoData] = useState(null);
  
  // New states for backend interaction
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
        setErrorMessage('');
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setErrorMessage(
        'Could not access the camera. Please ensure you have granted camera permissions.'
      );
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const takePhoto = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, width, height);
      setHasPhoto(true);
      
      // Store the photo data as a base64 string
      const photoDataUrl = canvasRef.current.toDataURL('image/jpeg');
      setPhotoData(photoDataUrl);
    }
  };

  const clearPhoto = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setHasPhoto(false);
      setPhotoData(null);
    }
  };

  const processPhoto = () => {
    if (!canvasRef.current || !photoData) return;
    
    setIsProcessing(true);
    setErrorMessage('');

    canvasRef.current.toBlob((blob) => {
      if (!blob) {
        setIsProcessing(false);
        setErrorMessage('Failed to process photo');
        return;
      }
      
      // Create form data to send to backend
      const formData = new FormData();
      formData.append('image', blob, 'photo.jpg');
      
      // If whereMet is provided, include it in the request
      if (whereMet.trim()) {
        formData.append('contextInfo', JSON.stringify({ whereMet }));
      }
      
      // Send the photo to the backend for face matching
      fetch('http://localhost:5000/api/face/match', {
        method: 'POST',
        body: formData,
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Server error: ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        setIsProcessing(false);
        
        if (data.success && data.profile) {
          // Store the matched profile
          setMatchedProfile(data.profile);
          
          // Navigate to analyze page with profile data AND photo data
          navigate('/analyze', { 
            state: { 
              profile: data.profile,
              whereMet: whereMet,
              confidence: data.confidence || null,
              photoData: photoData // Pass the captured photo
            } 
          });
        } else {
          // No match found, go to no-match page
          navigate('/no-match', { 
            state: { whereMet, photoData } // Also pass the photo to no-match page
          });
        }
      })
      .catch(error => {
        console.error('Error connecting to backend:', error);
        setIsProcessing(false);
        setErrorMessage('Face not found. Please try again.');
      });
    }, 'image/jpeg', 0.8);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <motion.div 
      className="h-screen w-screen bg-[#fdf5eb] flex flex-col items-center justify-between overflow-hidden px-4 py-6 font-serif"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div 
        className="w-full flex justify-between items-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.button 
          onClick={() => navigate('/')} 
          className="text-black"
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back
        </motion.button>
        <motion.h1 
          className="text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Find LinkedIn Profile
        </motion.h1>
        <div className="w-8" />
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div 
            className="w-full max-w-xs bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mt-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Container */}
      <motion.div 
        className="flex flex-col items-center justify-center flex-1 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div 
          className="rounded-2xl border border-black overflow-hidden w-[85%] max-w-xs aspect-[3/4] bg-white relative"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${hasPhoto ? 'hidden' : 'block'}`}
            playsInline
            autoPlay
          ></video>
          <motion.canvas
            ref={canvasRef}
            className={`w-full h-full object-cover ${hasPhoto ? 'block' : 'hidden'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: hasPhoto ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          ></motion.canvas>
          
          {/* Processing Overlay */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div 
                className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-white text-center">
                  <motion.div 
                    className="mb-2 w-8 h-8 border-4 border-t-transparent border-white rounded-full mx-auto"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  ></motion.div>
                  <p>Analyzing photo...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Icon Button */}
        <motion.button
          onClick={hasPhoto ? clearPhoto : takePhoto}
          disabled={!cameraActive && !hasPhoto || isProcessing}
          className={`w-10 h-10 border border-black rounded-full text-xl flex items-center justify-center transition-all ${
            (cameraActive || hasPhoto) && !isProcessing ? '' : 'opacity-30 cursor-not-allowed'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {hasPhoto ? '✓' : '+'}
        </motion.button>

        {/* Optional Input */}
        <AnimatePresence>
          {hasPhoto && !isProcessing && (
            <motion.div
              className="flex flex-col items-center w-full max-w-xs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.label 
                className="text-sm text-gray-600 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                where you met (optional)
              </motion.label>
              <motion.input
                type="text"
                placeholder="a hackathon!!"
                value={whereMet}
                onChange={(e) => setWhereMet(e.target.value)}
                className="border-b bg-transparent placeholder:text-gray-400 w-full max-w-xs text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              />

              {/* Analyze Button */}
              <motion.button
                onClick={processPhoto}
                disabled={isProcessing}
                className={`mt-4 border border-black rounded-lg px-6 py-2 flex items-center justify-center gap-2 transition-transform duration-200 ease-in-out ${
                  isProcessing 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-[#f9f3e9]'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ y: 0, boxShadow: "0 0px 0px rgba(0, 0, 0, 0.1)" }}
              >
                ⚡ <span className="font-medium">analyze</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer */}
      <motion.p 
        className="text-sm text-gray-700 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        made with 💖
      </motion.p>
    </motion.div>
  );
}

export default Camera;