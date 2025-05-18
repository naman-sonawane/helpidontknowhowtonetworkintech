// Results2.tsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Results2() {
  const navigate = useNavigate();
  const location = useLocation();
  const [comparison, setComparison] = useState<any>(null);
  const [profiles, setProfiles] = useState<any>(null);

  useEffect(() => {
    // Get comparison data from location state
    if (location.state?.comparison) {
      setComparison(location.state.comparison);
    }
    
    if (location.state?.profiles) {
      setProfiles(location.state.profiles);
    } else {
      // Redirect back if no data
      navigate('/search');
    }
  }, [location, navigate]);

  const goBack = () => {
    navigate('/results1', { 
      state: { 
        comparison: comparison,
        profiles: profiles 
      } 
    });
  };

  const goHome = () => {
    navigate('/');
  };

  // Loading state
  if (!comparison || !profiles) {
    return (
      <div className="h-screen bg-[#fdf5eb] font-serif flex flex-col items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-t-transparent border-black rounded-full"></div>
        <p className="mt-4">Loading conversation topics...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#fdf5eb] font-serif flex flex-col items-center justify-between px-6 py-6 text-black">
      {/* Header */}
      <div className="w-full flex justify-between items-center">
        <button onClick={goBack} className="text-black">
          ← Back
        </button>
        <h1 className="text-xl">Conversation Topics</h1>
        <div className="w-8"></div>
      </div>
      
      {/* Main Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-lg font-medium">{profiles.user.name} + {profiles.other.name}</h2>
          <p className="text-sm text-gray-600 mt-1">Try these conversation starters</p>
        </div>

        <div className="w-full space-y-3">
          {comparison.conversationTopics.map((topic: string, index: number) => (
            <div key={index} className="p-3 border border-black rounded-lg bg-white hover:bg-[#f9f3e9] transition-colors">
              <p className="text-[15px]">{topic}</p>
            </div>
          ))}
        </div>
        
        <button
          onClick={goHome}
          className="mt-8 border border-black rounded-lg px-6 py-2 flex items-center justify-center gap-2 text-lg transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-md hover:bg-[#f9f3e9]"
        >
          Finish
        </button>
      </div>

      {/* Footer */}
      <p className="text-sm text-gray-700">made with 💖</p>
    </div>
  );
}

export default Results2;