import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

function Camera() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
        setErrorMessage('');
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setErrorMessage('Could not access the camera. Please ensure you have granted camera permissions.');
    }
  };

  // Stop the camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  // Take a photo from the video stream
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
    }
  };

  // Clear the photo and go back to camera view
  const clearPhoto = () => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setHasPhoto(false);
    }
  };

  // Send the photo to the backend
  const processPhoto = () => {
    if (!canvasRef.current) return;
    
    // Convert canvas to blob
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      
      // Here you would send the photo to your backend
      // For now, let's just simulate this with a console log
      console.log("Photo ready to send to backend", blob);
      
      // You can implement API call to your backend here
      // const formData = new FormData();
      // formData.append('image', blob, 'photo.jpg');
      // fetch('your-backend-url', {
      //   method: 'POST',
      //   body: formData
      // })
      // .then(response => response.json())
      // .then(data => {
      //   console.log('Success:', data);
      //   // Navigate to results page or show results
      // })
      // .catch(error => {
      //   console.error('Error:', error);
      // });
      
      // For now, let's just clear the photo
      clearPhoto();
    }, 'image/jpeg', 0.8);
  };

  // Start camera when component mounts
  useEffect(() => {
    startCamera();
    
    // Clean up function to stop camera when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen min-w-screen bg-cream flex flex-col items-center p-4">
      <header className="w-full flex justify-between items-center mb-4">
        <button 
          onClick={() => navigate('/')}
          className="text-black hover:text-gray-600"
        >
          &larr; Back
        </button>
        <h1 className="text-xl font-serif">Find LinkedIn Profile</h1>
        <div className="w-8"></div> {/* Empty div for spacing */}
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}
        
        <div className="relative w-full rounded-lg overflow-hidden bg-black aspect-[3/4]">
          {/* Video element for camera stream */}
          <video 
            ref={videoRef}
            className={`w-full h-full object-cover ${hasPhoto ? 'hidden' : 'block'}`}
            playsInline
            autoPlay
          ></video>
          
          {/* Canvas element for captured photo */}
          <canvas 
            ref={canvasRef}
            className={`w-full h-full object-cover ${hasPhoto ? 'block' : 'hidden'}`}
          ></canvas>
          
          {!cameraActive && !hasPhoto && !errorMessage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white">Loading camera...</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex gap-4">
          {!hasPhoto ? (
            <button 
              onClick={takePhoto}
              disabled={!cameraActive}
              className={`px-6 py-2 rounded-full transition-colors ${
                cameraActive 
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Take Photo
            </button>
          ) : (
            <>
              <button 
                onClick={clearPhoto}
                className="px-6 py-2 bg-gray-200 text-black rounded-full hover:bg-gray-300 transition-colors"
              >
                Retake
              </button>
              <button 
                onClick={processPhoto}
                className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                Find Profile
              </button>
            </>
          )}
        </div>
        
        <p className="mt-6 text-sm text-gray-500 text-center">
          Position the person's face in the frame and take a photo to find their LinkedIn profile
        </p>
      </div>
    </div>
  );
}

export default Camera;