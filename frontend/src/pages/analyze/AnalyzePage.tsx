import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Analyze() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State to store data from navigation
  const [profile, setProfile] = useState<any>(null);
  const [whereMet, setWhereMet] = useState('');
  const [confidence, setConfidence] = useState<number | null>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);
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
      const { profile, whereMet, confidence, photoData } = location.state as any;
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
        <div className="animate-spin w-10 h-10 border-4 border-t-transparent border-black rounded-full"></div>
        <p className="mt-4">Loading profile information...</p>
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
  const interestIcons: {[key: string]: string} = {
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

  return (
    <div className="min-h-screen w-full bg-[#fdf5eb] font-serif flex flex-col items-center justify-between px-4 py-6 overflow-hidden text-black">
      {/* Header with Back Button */}
      <div className="w-full flex justify-between items-center mb-4">
        <button onClick={handleRetakePhoto} className="text-black">
          ← Back
        </button>
        <h1 className="text-xl">LinkedIn Profile</h1>
        <div className="w-8"></div>
      </div>
      
      {/* Profile section */}
      <div className="w-full max-w-md flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-4 w-full justify-center">
          {/* Captured Photo Display */}
          {photoData && (
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-black">
              <img 
                src={photoData} 
                alt="Captured" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        
        {/* Name and title */}
        <div className="mt-1">
          <h2 className="text-lg font-semibold">{profileData.name}</h2>
          <p className="text-sm">{profileData.rawData?.headline || "Professional"}</p>
          {profileData.rawData?.location && (
            <p className="text-xs text-gray-600">{profileData.rawData.location}</p>
          )}
        </div>

        {/* Match Confidence */}
        {confidence !== null && (
          <span className={`mt-1 inline-block px-3 py-1 rounded-full text-xs ${
            confidence > 80 
              ? 'bg-green-100 text-green-800' 
              : confidence > 60
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-orange-100 text-orange-800'
          }`}>
            Match confidence: {confidence}%
          </span>
        )}

        {/* Socials */}
        <div className="flex gap-3 text-lg mt-1">
          <a href={profileData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">💼</a>
          {profileData.githubUrl && <a href={profileData.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">🧠</a>}
          {profileData.portfolioUrl && <a href={profileData.portfolioUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">📷</a>}
        </div>

        {/* Where You Met */}
        {whereMet && (
          <div className="w-full mt-3 p-2 bg-white border border-black rounded-lg text-sm">
            <span className="font-medium">Where you met:</span> {whereMet}
          </div>
        )}

        {/* Divider */}
        <div className="w-32 my-3 text-xl">~ ~ ~ ~ ~ ~ ~</div>

        {/* Prompt */}
        <div className="italic text-sm text-gray-700 mb-1">
          introduce yourself, then use one of these ice breakers
        </div>

        {/* Featured Conversation Starter */}
        {conversationStarters.length > 0 && (
          <div className="text-lg font-medium mb-4 p-3 bg-white border border-black rounded-lg">
            "{conversationStarters[0]}"
          </div>
        )}

        {/* More Conversation starters */}
        {conversationStarters.length > 1 && (
          <div className="text-left w-full text-[15px]">
            <p className="font-semibold mb-1">More Conversation Starters</p>
            <ul className="space-y-2">
              {conversationStarters.slice(1).map((starter: string, index: number) => (
                <li key={index} className="p-2 bg-[#f9f3e9] rounded-lg">
                  "{starter}"
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Work Experience */}
        {profileData.rawData?.work_experience && profileData.rawData.work_experience.length > 0 && (
          <div className="text-left w-full mt-5 text-[15px]">
            <p className="font-semibold mb-1">Current Role</p>
            <p>{profileData.rawData.work_experience[0].title}</p>
            <p className="text-gray-700">{profileData.rawData.work_experience[0].company}</p>
            <p className="text-gray-500 text-xs">{profileData.rawData.work_experience[0].duration}</p>
          </div>
        )}

        {/* Interests */}
        <div className="text-left w-full mt-5 text-[15px]">
          <p className="font-semibold mb-1">{profileData.name.split(' ')[0]}'s Interests</p>
          <ul className="space-y-1">
            {(profileData.interests || []).map((interest: string, index: number) => (
              <li key={index}>
                {interestIcons[interest] || '•'} {interest}
              </li>
            ))}
          </ul>
        </div>

        {/* LinkedIn button */}
        <a
          href={profileData.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 border border-black rounded-lg px-6 py-2 w-full bg-blue-600 text-white text-center hover:bg-blue-700 transition-colors"
        >
          View on LinkedIn
        </a>

        {/* Compare Interests Button */}
        <button
          className="mt-4 border border-black rounded-lg px-6 py-2 flex items-center justify-center gap-2 transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-md hover:bg-[#f9f3e9]"
          onClick={handleSearchClick}
        >
          ⭕ compare interests
        </button>

        {/* New Search Button */}
        <button 
          onClick={handleRetakePhoto}
          className="mt-4 w-9 h-9 border border-black rounded-full text-xl flex items-center justify-center hover:bg-[#f9f3e9] transition-colors"
        >
          +
        </button>
      </div>

      {/* Footer */}
      <p className="text-sm text-gray-700 mt-8">made with 💖</p>
    </div>
  );
}

export default Analyze;