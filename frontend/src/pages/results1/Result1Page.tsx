import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function Results1() {
  const navigate = useNavigate();
  const location = useLocation();
  const [comparison, setComparison] = useState(null);
  const [profiles, setProfiles] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300,
        damping: 24
      }
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.8 }
    }
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
      <motion.div 
        className="h-screen bg-[#fdf5eb] font-serif flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="w-10 h-10 border-4 border-t-transparent border-black rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        ></motion.div>
        <motion.p 
          className="mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Loading comparison...
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="h-screen bg-[#fdf5eb] font-serif flex flex-col items-center justify-between px-6 py-6 text-black"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Main Centered Content */}
      <motion.div 
        className="flex-1 flex flex-col items-center justify-center gap-4"
        variants={containerVariants}
      >
        <motion.img 
          src="/venn.svg" 
          alt="Venn Diagram" 
          className="w-24 h-24"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05,
            rotate: 5,
            transition: { duration: 0.2 }
          }}
        />

        <motion.div 
          className="text-center"
          variants={itemVariants}
        >
          <h1 className="text-xl font-medium">{profiles.user.name} + {profiles.other.name}</h1>
        </motion.div>
        
        <motion.div 
          className="w-32 my-3"
          variants={itemVariants}
        >
          <img src="/squiggle.png" alt="Decorative divider" className="w-full h-auto" />
        </motion.div>

        <motion.div 
          className="mt-2 space-y-4 text-[15px] leading-relaxed text-center max-w-md"
          variants={fadeInVariants}
        >
          {comparison.sharedInterests.map((item, index) => (
            <motion.p 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.5 + (index * 0.1),
                duration: 0.5
              }}
            >
              {item.description.toLowerCase().startsWith('both') ? 
                item.description.slice(5) : item.description}
            </motion.p>
          ))}
        </motion.div>

        <motion.button
          onClick={goToNext}
          className="mt-6 border border-black rounded-full w-9 h-9 flex items-center justify-center text-xl"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.1, 
            backgroundColor: "#f9f3e9",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" 
          }}
          whileTap={{ scale: 0.95 }}
        >
          →
        </motion.button>
      </motion.div>

      {/* Footer */}
      <motion.p 
        className="text-sm text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        made with 💖
      </motion.p>
    </motion.div>
  );
}

export default Results1;