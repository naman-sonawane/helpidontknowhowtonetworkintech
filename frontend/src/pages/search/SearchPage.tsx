import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Get the profile data from the location state (passed from Analyze page)
  const profileToCompare = location.state?.profile;

  const handleCompareClick = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!profileToCompare?._id) {
      // If no profile to compare with, just navigate to results1 with default data
      navigate('/results1', {
        state: {
          userName: name,
          otherName: profileToCompare?.name || "Naman Sonawane"
        }
      });
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Call the backend API to compare profiles
      const response = await fetch('http://localhost:5000/api/compare/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: name,
          profileId: profileToCompare._id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate comparison');
      }

      const data = await response.json();
      
      // Navigate to results with the comparison data
      navigate('/results1', { 
        state: { 
          comparison: data.comparison,
          profiles: data.profiles 
        } 
      });
    } catch (error) {
      console.error('Error:', error);
      // On error, still navigate but with basic data
      navigate('/results1', {
        state: {
          userName: name,
          otherName: profileToCompare?.name || "Naman Sonawane"
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#fdf5eb] font-serif flex flex-col items-center justify-center px-6 text-black">
      {/* Profile info */}
      {profileToCompare && (
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-600">Comparing with</p>
          <p className="font-semibold">{profileToCompare.name}</p>
        </div>
      )}

      {/* Name Input */}
      <div className="flex flex-col w-full max-w-sm mb-10">
        <label htmlFor="name" className="mb-1 text-base">
          your name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Naman Sonawane"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-transparent border-b border-black text-lg px-1 py-0.5 focus:outline-none"
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Compare Button */}
      <button
        className="border border-black rounded-xl px-6 py-2 flex items-center justify-center gap-2 text-lg transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-md hover:bg-[#f9f3e9] relative"
        onClick={handleCompareClick}
        disabled={isLoading}
      >
        <img src="/compareicon.png" alt="Compare" className="w-auto h-5 mr-1" />
        {isLoading ? 'Comparing...' : 'compare interests'}
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-yellow-400 rounded-full border border-white"></span>
      </button>
    </div>
  );
}

export default Search;