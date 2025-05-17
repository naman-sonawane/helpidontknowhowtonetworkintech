import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

function Camera() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [whereMet, setWhereMet] = useState('');

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
    }
  };

  const clearPhoto = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setHasPhoto(false);
    }
  };

  const processPhoto = () => {
    if (!canvasRef.current) return;

    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      console.log('Photo ready to send to backend', blob);
      console.log('Where you met:', whereMet);
      // You can send `blob` and `whereMet` to your backend here.
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

      {/* Photo Container */}
      <div className="flex flex-col items-center justify-center flex-1 gap-6">
        <div className="rounded-2xl border border-black overflow-hidden w-[85%] max-w-xs aspect-[3/4] bg-white">
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
        </div>

        {/* Icon Button */}
        <button
          onClick={hasPhoto ? clearPhoto : takePhoto}
          disabled={!cameraActive && !hasPhoto}
          className={`w-10 h-10 border border-black rounded-full text-xl flex items-center justify-center transition-all ${
            cameraActive || hasPhoto ? '' : 'opacity-30 cursor-not-allowed'
          }`}
        >
          {hasPhoto ? '✓' : '+'}
        </button>

        {/* Optional Input */}
        {hasPhoto && (
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
              className="mt-4 border border-black rounded-lg px-6 py-2 flex items-center justify-center gap-2 transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-md hover:bg-[#f9f3e9]"
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
