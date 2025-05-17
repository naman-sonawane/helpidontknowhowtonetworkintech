import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const navigate = useNavigate();
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [location, setLocation] = useState('');
  const [summary, setSummary] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);
  
  // Start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setErrorMessage('Could not access the camera');
    }
  };
  
  // Stop the camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };
  
  // Take a photo
  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
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
  
  // Clear the photo
  const clearPhoto = () => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setHasPhoto(false);
    }
  };
  
  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!linkedinUrl || !name || !hasPhoto) {
      setErrorMessage('Please fill all required fields and take a photo');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Convert canvas to blob
      const photoBlob = await new Promise<Blob | null>((resolve) => {
        canvasRef.current?.toBlob(blob => resolve(blob), 'image/jpeg', 0.95);
      });
      
      if (!photoBlob) {
        throw new Error('Failed to process photo');
      }
      
      // Create the profile data
      const profileData = {
        name,
        linkedinUrl,
        rawData: {
          full_name: name,
          headline,
          location,
          education: [],
          work_experience: []
        },
        summary
      };
      
      // Create form data
      const formData = new FormData();
      formData.append('profileData', JSON.stringify(profileData));
      formData.append('image', photoBlob, 'profile.jpg');
      
      // Send to API
      const response = await fetch('http://localhost:5000/api/profiles', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSuccessMessage('Profile added successfully!');
        // Reset form
        setLinkedinUrl('');
        setName('');
        setHeadline('');
        setLocation('');
        setSummary('');
        clearPhoto();
      } else {
        throw new Error(result.message || 'Failed to add profile');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clean up camera when component unmounts
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-cream p-4">
      <header className="mb-6">
        <button 
          onClick={() => navigate('/')}
          className="text-black hover:text-gray-600"
        >
          &larr; Back to Home
        </button>
        <h1 className="text-2xl font-serif mt-2">Add LinkedIn Profile</h1>
      </header>
      
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Camera Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl mb-4">Profile Photo</h2>
          
          <div className="relative bg-black rounded-lg overflow-hidden aspect-[3/4]">
            <video 
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover ${hasPhoto ? 'hidden' : 'block'}`}
              playsInline
            ></video>
            
            <canvas 
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full object-cover ${hasPhoto ? 'block' : 'hidden'}`}
            ></canvas>
          </div>
          
          <div className="mt-4 flex justify-center">
            {!hasPhoto ? (
              <button 
                onClick={takePhoto}
                disabled={!cameraActive}
                className={`px-6 py-2 rounded-full ${
                  cameraActive 
                    ? 'bg-black text-white hover:bg-gray-800' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Take Photo
              </button>
            ) : (
              <button 
                onClick={clearPhoto}
                className="px-6 py-2 bg-gray-200 text-black rounded-full hover:bg-gray-300"
              >
                Retake Photo
              </button>
            )}
          </div>
        </div>
        
        {/* Form Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl mb-4">LinkedIn Profile</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">LinkedIn URL *</label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="https://www.linkedin.com/in/username"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Software Engineer at Company"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Waterloo, Ontario, Canada"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Summary</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Brief professional summary"
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !hasPhoto}
              className={`w-full py-2 rounded-full ${
                isLoading || !hasPhoto
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {isLoading ? 'Adding Profile...' : 'Add Profile'}
            </button>
            
            {errorMessage && (
              <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
                {errorMessage}
              </div>
            )}
            
            {successMessage && (
              <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
                {successMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;