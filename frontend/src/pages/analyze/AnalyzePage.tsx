import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Analyze() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State to store data from navigation
  const [profile, setProfile] = useState(null);
  const [whereMet, setWhereMet] = useState('');
  const [confidence, setConfidence] = useState(null);
  const [photoData, setPhotoData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Handle search navigation
  const handleSearchClick = () => {
    console.log("Navigating to /search...");
    navigate('/search');
  };

  // Handle retake photo
  const handleRetakePhoto = () => {
    navigate('/camera');
  };

  // Load profile data from navigation state
  useEffect(() => {
    if (location.state) {
      const { profile, whereMet, confidence, photoData } = location.state;
      setProfile(profile);
      setWhereMet(whereMet || '');
      setConfidence(confidence);
      setPhotoData(photoData || null);
      setLoading(false);
    } else {
      // If no profile data was passed, try to get from URL params or redirect
      setLoading(false);
      // Uncomment to redirect if no profile data
      // navigate('/camera');
    }
  }, [location, navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#fdf5eb] font-serif flex flex-col items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-t-transparent border-black rounded-full"
        ></motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-4"
        >
          Loading profile information...
        </motion.p>
      </div>
    );
  }

  // Fallback data if no profile is available (for development)
  const profileData = profile || {
    name: "Christopher Ma",
    rawData: {
      full_name: "Christopher Ma",
      headline: "Full-stack Developer",
      location: "Waterloo, Ontario, Canada"
    },
    conversationStarters: [
      "Hey, what kind of stuff do you like building these days?",
      "Have you come across anything cool in tech lately?",
      "What got you into coding in the first place?"
    ],
    interests: ["Coding", "AI/ML", "Swimming", "Hackathons", "Other tech events"]
  };

  // Get profile image or placeholder
  const profileImage = profile?.imageUrl || "https://via.placeholder.com/150";

  // Ensure conversation starters exist
  const conversationStarters = profileData.conversationStarters || [
    "What brought you to this event?",
    "What are you working on these days?",
    "What's your background in?",
    "Have you been to events like this before?",
    "What are you hoping to get out of today?"
  ];

  // Icons mapping for interests
  const interestIcons = {
    "Coding": "💻",
    "AI/ML": "🤖",
    "Swimming": "🏊‍♂️",
    "Hackathons": "💻",
    "Other tech events": "📣",
    "Reading": "📚",
    "Travel": "✈️",
    "Music": "🎵",
    "Sports": "🏆",
    "Art": "🎨",
    "Photography": "📷",
    "Gaming": "🎮",
    "Cooking": "🍳",
    "Hiking": "🥾",
    "Design": "🎨"
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="min-h-screen w-full bg-[#fdf5eb] font-serif flex flex-col items-center justify-between px-4 py-6 overflow-hidden text-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with Back Button */}
      <motion.div 
        className="w-full flex justify-between items-center mb-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.button 
          onClick={handleRetakePhoto} 
          className="text-black"
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back
        </motion.button>
        <div className="w-8"></div>
      </motion.div>
      
      {/* Profile section */}
      <motion.div 
        className="w-full max-w-md flex flex-col items-center gap-2 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="flex items-center gap-4 w-full justify-center"
          variants={itemVariants}
        >
          {/* Captured Photo Display */}
          {photoData && (
            <motion.div 
              className="w-16 h-16 rounded-xl overflow-hidden border border-black"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <img 
                src={photoData} 
                alt="Captured" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
        </motion.div>
        
        {/* Name and title */}
        <motion.div 
          className="mt-1"
          variants={itemVariants}
        >
          <h2 className="text-lg font-semibold">{profileData.name}</h2>
          <p className="text-sm">{profileData.rawData?.headline || "Professional"}</p>
          {profileData.rawData?.location && (
            <p className="text-xs text-gray-600">{profileData.rawData.location}</p>
          )}
        </motion.div>

        {/* Match Confidence */}
        {confidence !== null && (
          <motion.span 
            className={`mt-1 inline-block px-3 py-1 rounded-full text-xs ${
              confidence > 80 
                ? 'bg-green-100 text-green-800' 
                : confidence > 60
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
            }`}
            variants={itemVariants}
          >
            Match confidence: {confidence}%
          </motion.span>
        )}

        {/* Socials */}
        <motion.div 
          className="flex gap-3 text-lg mt-1"
          variants={itemVariants}
        >
          <motion.a 
            href={profileData.linkedinUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:opacity-80 transition-opacity"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <img src="public/linkedinlogo.png" alt="LinkedIn" className="w-5 h-5" />
          </motion.a>
          {profileData.githubUrl && (
            <motion.a 
              href={profileData.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:opacity-80 transition-opacity"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              🧠
            </motion.a>
          )}
          {profileData.portfolioUrl && (
            <motion.a 
              href={profileData.portfolioUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:opacity-80 transition-opacity"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              📷
            </motion.a>
          )}
        </motion.div>

        {/* Where You Met */}
        {whereMet && (
          <motion.div 
            className="w-full mt-3 p-2 bg-white border border-black rounded-lg text-sm"
            variants={itemVariants}
          >
            <span className="font-medium">Where you met:</span> {whereMet}
          </motion.div>
        )}

        {/* Divider */}
        <motion.div 
          className="w-32 my-3"
          variants={itemVariants}
        >
          <img src="/squiggle.png" alt="Decorative divider" className="w-full h-auto" />
        </motion.div>

        {/* Prompt */}
        <motion.div 
          className="italic text-sm text-gray-700 mb-1"
          variants={itemVariants}
        >
          introduce yourself, then use one of these ice breakers
        </motion.div>

        {/* Featured Conversation Starter */}
        {conversationStarters.length > 0 && (
          <motion.div 
            className="text-lg font-medium mb-4 p-3 bg-white border border-black rounded-lg"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            "{conversationStarters[0]}"
          </motion.div>
        )}

        {/* More Conversation starters */}
        {conversationStarters.length > 1 && (
          <motion.div 
            className="text-left w-full text-[15px]"
            variants={itemVariants}
          >
            <p className="font-semibold mb-1">More Conversation Starters</p>
            <AnimatePresence>
              <motion.ul className="space-y-2">
                {conversationStarters.slice(1).map((starter, index) => (
                  <motion.li 
                    key={index} 
                    className="p-2 bg-[#f9f3e9] rounded-lg"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (index * 0.1) }}
                    whileHover={{ x: 3 }}
                  >
                    "{starter}"
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </motion.div>
        )}

        {/* Work Experience */}
        {profileData.rawData?.work_experience && profileData.rawData.work_experience.length > 0 && (
          <motion.div 
            className="text-left w-full mt-5 text-[15px]"
            variants={itemVariants}
          >
            <p className="font-semibold mb-1">Current Role</p>
            <p>{profileData.rawData.work_experience[0].title}</p>
            <p className="text-gray-700">{profileData.rawData.work_experience[0].company}</p>
            <p className="text-gray-500 text-xs">{profileData.rawData.work_experience[0].duration}</p>
          </motion.div>
        )}

        {/* Interests */}
        <motion.div 
          className="text-left w-full mt-5 text-[15px]"
          variants={itemVariants}
        >
          <p className="font-semibold mb-1">{profileData.name.split(' ')[0]}'s Interests</p>
          <ul className="space-y-1">
            {(profileData.interests || []).map((interest, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (index * 0.1) }}
                whileHover={{ x: 3 }}
              >
                {interestIcons[interest] || '•'} {interest}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Compare Interests Button */}
        <motion.button
          className="mt-4 border border-black rounded-lg px-6 py-2 flex items-center justify-center gap-2 transition-transform duration-200 ease-in-out hover:bg-[#f9f3e9]"
          onClick={handleSearchClick}
          variants={itemVariants}
          whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
          whileTap={{ y: 0, boxShadow: "0 0px 0px rgba(0, 0, 0, 0.1)" }}
        >
          <img src="/compareicon.png" alt="Compare" className="w-auto h-5 mr-1" /> compare interests
        </motion.button>

        {/* New Search Button */}
        <motion.button 
          onClick={handleRetakePhoto}
          className="mt-4 w-9 h-9 border border-black rounded-full text-xl flex items-center justify-center hover:bg-[#f9f3e9] transition-colors"
          variants={itemVariants}
          whileHover={{ rotate: 90, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          +
        </motion.button>
      </motion.div>

      {/* Footer */}
      <motion.p 
        className="text-sm text-gray-700 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        made with 💖
      </motion.p>
    </motion.div>
  );
}

export default Analyze;