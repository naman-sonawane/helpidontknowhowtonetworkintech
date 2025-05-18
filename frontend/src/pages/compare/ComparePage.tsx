import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function Compare() {
  const navigate = useNavigate();
  
  // Animation variants
  const loadingDotVariants = {
    initial: { opacity: 0, y: 0 },
    animate: { opacity: 1, y: [0, -10, 0] },
  };

  return (
    <motion.div 
      className="h-screen w-full bg-[#fdf5eb] flex flex-col justify-between items-center px-6 py-8 font-serif text-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top loading label */}
      <motion.div 
        className="text-sm text-gray-400 w-full text-left"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        loading
      </motion.div>
  
      {/* Centered comparing text with animation */}
      <motion.div 
        className="flex-1 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center text-lg">
          <motion.span>comparing</motion.span>
          <motion.span
            variants={loadingDotVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          >.</motion.span>
          <motion.span
            variants={loadingDotVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          >.</motion.span>
          <motion.span
            variants={loadingDotVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
          >.</motion.span>
        </div>
      </motion.div>
  
      {/* Footer */}
      <motion.p 
        className="text-sm text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        made with 💖
      </motion.p>
    </motion.div>
  );
}
  
export default Compare;