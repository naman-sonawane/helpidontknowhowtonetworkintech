// Results1.tsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function Results1() {
  const navigate = useNavigate();
  const location = useLocation();
  const [comparison, setComparison] = useState(null);
  const [profiles, setProfiles] = useState(null);

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

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

  const goToNext = () => {
    navigate('/results2', { 
      state: { 
        comparison: comparison,
        profiles: profiles 
      } 
    });
  };

  // Loading state
  if (!comparison || !profiles) {
    return (
      <div className="h-screen bg-[#fdf5eb] font-serif flex flex-col items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-t-transparent border-black rounded-full"></div>
        <p className="mt-4">Loading comparison...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#fdf5eb] font-serif flex flex-col items-center justify-between px-6 py-6 text-black">
      {/* Main Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <img src="/venn.svg" alt="Venn Diagram" className="w-24 h-24" />

        <div className="text-center">
          <h1 className="text-xl font-medium">{profiles.user.name} + {profiles.other.name}</h1>
       </div>
               <motion.div 
          className="w-32 my-3"
          variants={itemVariants}
        >
          <img src="/squiggle.png" alt="Decorative divider" className="w-full h-auto" />
        </motion.div> 

        <div className="mt-2 space-y-4 text-[15px] leading-relaxed text-center max-w-md">
          {comparison.sharedInterests.map((item: any, index: number) => (
            <p key={index}>
              {item.interest.toLowerCase().startsWith('both') ? 
                item.interest.slice(5) : item.interest}
            </p>
          ))}
        </div>

        <button
          onClick={goToNext}
          className="mt-6 border border-black rounded-full w-9 h-9 flex items-center justify-center text-xl"
        >
          →
        </button>
      </div>

      {/* Footer */}
      <p className="text-sm text-gray-700">made with 💖</p>
    </div>
  );
}

export default Results1;