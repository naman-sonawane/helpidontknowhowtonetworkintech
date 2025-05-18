import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';

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
      const response = await fetch('https://helpidontknowhowtonetworkintech.onrender.com/api/compare/compare', {
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
    <motion.div 
      className="h-screen w-full bg-[#fdf5eb] font-serif flex flex-col items-center justify-center px-6 text-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Name Input */}
      <motion.div 
        className="flex flex-col w-full max-w-sm mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.label 
          htmlFor="name" 
          className="mb-1 text-base"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          your name
        </motion.label>
        <motion.input
          id="name"
          type="text"
          placeholder="Kanye East"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-transparent border-b border-black text-lg px-1 py-0.5 focus:outline-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        />
      </motion.div>

      {/* Compare Button */}
      <motion.button
        className="border border-black rounded-xl px-6 py-2 flex items-center justify-center gap-2 text-lg transition-transform duration-200 ease-in-out hover:bg-[#f9f3e9] relative"
        onClick={handleCompareClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        whileHover={{ y: -3, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
        whileTap={{ y: 0, boxShadow: "0 0px 0px rgba(0, 0, 0, 0.1)" }}
      >
        <img src="/compareicon.png" alt="Compare" className="w-auto h-5 mr-1" /> compare interests
        <span           className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-yellow-400 rounded-full"></span>
        <motion.span 
          className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-yellow-400 animate-ping rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            duration: 0.3, 
            delay: 0.8,
            type: "spring",
            stiffness: 500
          }}
        ></motion.span>
      </motion.button>
    </motion.div>
  );
}

export default Search;
