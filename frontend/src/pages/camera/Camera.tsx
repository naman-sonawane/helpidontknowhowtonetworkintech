import { useNavigate } from 'react-router-dom';

function Camera() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen min-w-screen bg-cream flex flex-col items-center p-4">
      <header className="w-full">
        <button 
          onClick={() => navigate('/')}
          className="text-black hover:text-gray-600"
        >
          &larr; Back
        </button>
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-serif mb-6">Camera Page</h1>
        
        <div className="bg-black w-full max-w-md aspect-[3/4] rounded-lg flex items-center justify-center">
          <p className="text-white">Camera will appear here</p>
        </div>
        
        <button className="mt-6 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
          Take Photo
        </button>
      </div>
    </div>
  );
}

export default Camera;