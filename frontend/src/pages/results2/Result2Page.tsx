import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Results2() {
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
        staggerChildren: 0.1,
        duration: 0.5
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        damping: 20,
        stiffness: 300
      }
    }
  };

  const topicVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring", 
        damping: 25,
        stiffness: 300,
        delay: i * 0.08
      }
    })
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
          Loading conversation topics...
        </motion.p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        className="h-screen bg-[#fdf5eb] font-serif flex flex-col items-center justify-between px-6 py-6 text-black"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div 
          className="w-full flex justify-between items-center"
          variants={headerVariants}
        >
          <motion.button 
            onClick={goBack} 
            className="text-black flex items-center"
            whileHover={{ x: -3, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span className="mr-1">←</motion.span> Back
          </motion.button>
          <motion.h1 
            className="text-xl"
            animate={{ 
              scale: [1, 1.05, 1],
              transition: { duration: 1.2, delay: 0.5 }
            }}
          >
            Conversation Topics
          </motion.h1>
          <div className="w-8"></div>
        </motion.div>
        
        {/* Main Centered Content */}
        <motion.div 
          className="flex-1 flex flex-col items-center justify-center w-full max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div 
            className="text-center mb-6 flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.img 
              src="/venn.svg" 
              alt="Venn Diagram" 
              className="w-24 h-24"
              whileHover={{ 
                scale: 1.05,
                rotate: 5,
                transition: { duration: 0.2 }
              }}
            />
            <motion.h2 
              className="text-lg font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              {profiles.user.name} + {profiles.other.name}
            </motion.h2>
            <motion.p 
              className="text-sm text-gray-600 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              Try these conversation starters
            </motion.p>
          </motion.div>

          <motion.div className="w-full space-y-3">
            {comparison.conversationTopics.map((topic, index) => (
              <motion.div 
                key={index} 
                className="p-3 border border-black rounded-lg bg-white hover:bg-[#f9f3e9] transition-colors"
                custom={index}
                variants={topicVariants}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <p className="text-[15px]">{topic}</p>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.button
            onClick={goHome}
            className="mt-8 border border-black rounded-lg px-6 py-2 flex items-center justify-center gap-2 text-lg transition-transform duration-200 ease-in-out hover:bg-[#f9f3e9]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.6 + (comparison.conversationTopics.length * 0.05),
              type: "spring",
              stiffness: 300
            }}
            whileHover={{ 
              y: -3, 
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" 
            }}
            whileTap={{ y: 0, boxShadow: "0px 0px 0px rgba(0, 0, 0, 0.1)" }}
          >
            Finish
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.p 
          className="text-sm text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          made with 💖
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}

export default Results2;