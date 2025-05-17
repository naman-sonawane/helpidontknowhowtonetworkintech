import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

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
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
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
      fetch('https://helpidontknowhowtonetworkintech.onrender.com/api/face/match', {
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
        setErrorMessage('Failed to connect to the server. Please try again.');
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
    <div className="h-screen w-screen bg-[#fdf5eb] flex flex-col items-center justify-between overflow-hidden px-4 py-6 font-serif">
      {/* Header */}
      <div className="w-full flex justify-between items-center">
        <button onClick={() => navigate('/')} className="text-black">
          ← Back
        </button>
        <h1 className="text-xl">Find LinkedIn Profile</h1>
        <div className="w-8" />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="w-full max-w-xs bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mt-2">
          {errorMessage}
        </div>
      )}

      {/* Photo Container */}
      <div className="flex flex-col items-center justify-center flex-1 gap-6">
        <div className="rounded-2xl border border-black overflow-hidden w-[85%] max-w-xs aspect-[3/4] bg-white relative">
          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${hasPhoto ? 'hidden' : 'block'}`}
            playsInline
            autoPlay
          ></video>
          <canvas
            ref={canvasRef}
            className={`w-full h-full object-cover ${hasPhoto ? 'block' : 'hidden'}`}
          ></canvas>
          
          {/* Processing Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-spin mb-2 w-8 h-8 border-4 border-t-transparent border-white rounded-full mx-auto"></div>
                <p>Analyzing photo...</p>
              </div>
            </div>
          )}
        </div>

        {/* Icon Button */}
        <button
          onClick={hasPhoto ? clearPhoto : takePhoto}
          disabled={!cameraActive && !hasPhoto || isProcessing}
          className={`w-10 h-10 border border-black rounded-full text-xl flex items-center justify-center transition-all ${
            (cameraActive || hasPhoto) && !isProcessing ? '' : 'opacity-30 cursor-not-allowed'
          }`}
        >
          {hasPhoto ? '✓' : '+'}
        </button>

        {/* Optional Input */}
        {hasPhoto && !isProcessing && (
          <>
            <label className="text-sm text-gray-600 mt-2">where you met (optional)</label>
            <input
              type="text"
              placeholder="a hackathon!!"
              value={whereMet}
              onChange={(e) => setWhereMet(e.target.value)}
              className="border-b bg-transparent placeholder:text-gray-400 w-full max-w-xs text-center"
            />

            {/* Analyze Button */}
            <button
              onClick={processPhoto}
              disabled={isProcessing}
              className={`mt-4 border border-black rounded-lg px-6 py-2 flex items-center justify-center gap-2 transition-transform duration-200 ease-in-out ${
                isProcessing 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-105 hover:shadow-md hover:bg-[#f9f3e9]'
              }`}
            >
              ⚡ <span className="font-medium">analyze</span>
            </button>
          </>
        )}
      </div>

      {/* Footer */}
      <p className="text-sm text-gray-700 mt-6">made with 💖</p>
    </div>
  );
}

export default Camera;
