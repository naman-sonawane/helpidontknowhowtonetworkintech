import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Landing() {
  const navigate = useNavigate();

  const handleCameraClick = () => {
    navigate('/camera');
  };

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 1.2
      }
    },
    hover: {
      scale: 1.1,
      boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
      borderColor: "#666",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const footerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 1.4,
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="flex flex-col justify-between min-h-screen bg-[#fdf5eb] w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Vertical text for mobile */}
        <motion.div 
          className="block lg:hidden flex flex-col items-center space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {["help", "i", "dont", "know", "how", "to", "network", "in", ".tech"].map((word, index) => (
            <motion.p 
              key={index}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-center max-w-[90%]"
              variants={letterVariants}
            >
              {word}
            </motion.p>
          ))}
        </motion.div>

        {/* Horizontal text for large screens */}
        <motion.div 
          className="hidden lg:block text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          help i dont know how to network in .tech
        </motion.div>
        
        {/* Plus Button + Label */}
        <div className="mt-12 flex flex-col items-center space-y-4">
          <motion.button 
            className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20
              border-2 border-black rounded-full flex items-center justify-center
              transition-colors" 
            onClick={handleCameraClick}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
          >
            <span className="text-2xl leading-none">+</span>
          </motion.button>

          <motion.p 
            className="mt-4 text-sm sm:text-base text-gray-600 font-serif italic"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
          >
            press "+" to take a picture
          </motion.p>
        </div>
      </div>

      {/* Footer */}
      <div className="mb-4 relative group">
        <div className="text-sm sm:text-base md:text-lg text-center text-gray-600 cursor-pointer font-serif">
          made with 💖
        </div>
        {/* Team Member Panel */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
          <div className="bg-[#fdf5eb] rounded-lg shadow-lg p-4 border border-gray-200">
            <div className="grid grid-cols-4 gap-4">
              <a href="https://www.linkedin.com/in/christopher-ma-3b35aa300" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
                <img src="/images/team/chris.jpg" alt="Chris" className="w-20 h-20 rounded-full object-cover transition-transform duration-200 hover:scale-105" />
                <span className="mt-2 text-sm font-serif">Chris</span>
              </a>
              <a href="https://www.linkedin.com/in/evelynhwong" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
                <img src="/images/team/evelyn.jpg" alt="Evelyn" className="w-20 h-20 rounded-full object-cover transition-transform duration-200 hover:scale-105" />
                <span className="mt-2 text-sm font-serif">Evelyn</span>
              </a>
              <a href="https://www.linkedin.com/in/naman-sonawane" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
                <img src="/images/team/naman.jpg" alt="Naman" className="w-20 h-20 rounded-full object-cover transition-transform duration-200 hover:scale-105" />
                <span className="mt-2 text-sm font-serif">Naman</span>
              </a>
              <a href="https://www.linkedin.com/in/shaoming-wu" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
                <img src="/images/team/shao.jpg" alt="Shao" className="w-20 h-20 rounded-full object-cover transition-transform duration-200 hover:scale-105" />
                <span className="mt-2 text-sm font-serif">Shao</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Landing;