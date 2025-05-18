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
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageSource, setImageSource] = useState('camera');
  
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

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check if the file is an image  
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please upload an image file');
        return;
      }
      
      setUploadedImage(file);
      setImageSource('upload');
      
      // Preview the uploaded image on canvas
      const reader = new FileReader();
      reader.onload = (event) => {
        if (canvasRef.current && event.target?.result) {
          const img = new Image();
          img.onload = () => {
            if (canvasRef.current) {
              const ctx = canvasRef.current.getContext('2d');
              
              // Set canvas dimensions to match image
              canvasRef.current.width = img.width;
              canvasRef.current.height = img.height;
              
              // Draw the image on canvas
              if (ctx) {
                ctx.drawImage(img, 0, 0);
                setHasPhoto(true);
              }
            }
          };
          img.src = event.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Switch between camera and upload
  const switchToCamera = () => {
    setImageSource('camera');
    setUploadedImage(null);
    clearPhoto();
    startCamera();
  };
  
  const switchToUpload = () => {
    setImageSource('upload');
    stopCamera();
    clearPhoto();
    // Trigger file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!linkedinUrl || !name || !(hasPhoto || uploadedImage)) {
      setErrorMessage('Please fill all required fields and provide a photo');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      let photoBlob: Blob | null = null;
      
      // Get image data - either from canvas or uploaded file
      if (imageSource === 'camera' && canvasRef.current) {
        // Convert canvas to blob
        photoBlob = await new Promise<Blob | null>((resolve) => {
          canvasRef.current?.toBlob(blob => resolve(blob), 'image/jpeg', 0.95);
        });
      } else if (imageSource === 'upload' && uploadedImage) {
        photoBlob = uploadedImage;
      }
      
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
      const response = await fetch('https://helpidontknowhowtonetworkintech.onrender.com/api/profiles', {
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
        setUploadedImage(null);
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
  
  // Initialize camera when component mounts and image source is camera
  useEffect(() => {
    if (imageSource === 'camera') {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [imageSource]);
  
  return (
    <div className="min-h-screen bg-[#fdf5eb] p-4 font-serif">
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
        {/* Photo Section */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl mb-4">Profile Photo</h2>
          
          {/* Image Source Selector */}
          <div className="flex justify-center mb-4 border-b pb-3">
            <button
              type="button"
              onClick={switchToCamera}
              className={`px-4 py-2 rounded-l-lg ${
                imageSource === 'camera' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Camera
            </button>
            <button
              type="button"
              onClick={switchToUpload}
              className={`px-4 py-2 rounded-r-lg ${
                imageSource === 'upload' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Upload
            </button>
            
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          
          <div className="relative bg-black rounded-lg overflow-hidden aspect-[3/4]">
            {/* Video element (only shown for camera) */}
            {imageSource === 'camera' && (
              <video 
                ref={videoRef}
                className={`absolute inset-0 w-full h-full object-cover ${hasPhoto ? 'hidden' : 'block'}`}
                playsInline
              ></video>
            )}
            
            {/* Canvas element (shown for both camera photos and uploads) */}
            <canvas 
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full object-cover ${hasPhoto ? 'block' : 'hidden'}`}
            ></canvas>
            
            {/* Message when neither camera nor photo is available */}
            {imageSource === 'upload' && !hasPhoto && !uploadedImage && (
              <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4">
                <p>Click "Upload" to select an image file</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-center">
            {imageSource === 'camera' && !hasPhoto && (
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
            )}
            
            {imageSource === 'upload' && !hasPhoto && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800"
              >
                Select Image
              </button>
            )}
            
            {hasPhoto && (
              <button 
                onClick={() => {
                  clearPhoto();
                  if (imageSource === 'upload') {
                    setUploadedImage(null);
                  }
                }}
                className="px-6 py-2 bg-gray-200 text-black rounded-full hover:bg-gray-300"
              >
                {imageSource === 'camera' ? 'Retake Photo' : 'Choose Another Image'}
              </button>
            )}
          </div>
        </div>
        
        {/* Form Section */}
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
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
              disabled={isLoading || !(hasPhoto || uploadedImage)}
              className={`w-full py-2 rounded-full ${
                isLoading || !(hasPhoto || uploadedImage)
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
