// src/pages/no-match/NoMatchPage.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function NoMatchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [whereMet, setWhereMet] = useState('');

  useEffect(() => {
    if (location.state) {
      const { whereMet } = location.state as any;
      setWhereMet(whereMet || '');
    }
  }, [location]);

  return (
    <div className="h-screen w-screen bg-[#fdf5eb] flex flex-col items-center justify-between overflow-hidden px-4 py-6 font-serif">
      {/* Header */}
      <div className="w-full flex justify-between items-center">
        <button onClick={() => navigate('/camera')} className="text-black">
          ← Back
        </button>
        <h1 className="text-xl">No Match Found</h1>
        <div className="w-8" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-white border border-black rounded-2xl p-6 max-w-md text-center">
          <h2 className="text-xl font-medium mb-4">We couldn't find a match</h2>
          <p className="text-gray-700 mb-6">
            The person you're looking for might not be in our database yet, or the photo might need to be clearer.
          </p>
          
          <button
            onClick={() => navigate('/camera')}
            className="border border-black rounded-lg px-6 py-2 hover:bg-[#f9f3e9] transition-colors"
          >
            Try Again
          </button>
          
          <button
            onClick={() => navigate('/admin')}
            className="ml-3 border border-black rounded-lg px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
          >
            Add Profile
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-sm text-gray-700 mt-6">made with 💖</p>
    </div>
  );
}

export default NoMatchPage;