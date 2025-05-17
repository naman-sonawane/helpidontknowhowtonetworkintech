import { useNavigate } from 'react-router-dom';

function Analyze() {
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <div className="min-h-screen w-full bg-[#fdf5eb] font-serif flex flex-col items-center justify-between px-4 py-6 overflow-hidden text-black">
      {/* Profile section */}
      <div className="w-full max-w-md flex flex-col items-center gap-2 text-center">
        {/* Profile photo */}
        <img
          src="/your-image-path.jpg" // Replace with actual photo URL or import
          alt="Christopher Ma"
          className="w-16 h-16 rounded-xl object-cover"
        />
        {/* Name and title */}
        <div className="mt-1">
          <h2 className="text-lg font-semibold">Christopher Ma</h2>
          <p className="text-sm">Full-stack Developer</p>
        </div>

        {/* Socials */}
        <div className="flex gap-3 text-lg mt-1">
          <span>🧠</span>
          <span>📷</span>
          <span>💼</span>
        </div>

        {/* Divider */}
        <div className="w-32 my-2 text-xl">~ ~ ~ ~ ~ ~ ~</div>

        {/* Prompt */}
        <div className="italic text-sm text-gray-700 mb-1">
          introduce yourself, then ask
        </div>
        <div className="text-lg font-medium mb-4">
          “what kinda stuff are you into?”
        </div>

        {/* Other questions */}
        <div className="text-left w-full text-[15px]">
          <p className="font-semibold mb-1">Other Conversation Starters</p>
          <ul className="list-disc list-inside space-y-1">
            <li>"Hey, what kind of stuff do you like building these days?"</li>
            <li>"Have you come across anything cool in tech lately?"</li>
            <li>"What got you into coding in the first place?"</li>
          </ul>
        </div>

        {/* Interests */}
        <div className="text-left w-full mt-5 text-[15px]">
          <p className="font-semibold mb-1">Christopher’s Interests</p>
          <ul className="space-y-1">
            <li>💻 Coding</li>
            <li>🤖 AI/ML</li>
            <li>🏊‍♂️ Swimming</li>
            <li>💻 Hackathons</li>
            <li>📣 Other tech events</li>
          </ul>
        </div>

        {/* More tips */}
        <a
          href="#"
          className="text-[15px] text-black underline mt-5 hover:text-gray-700 transition"
        >
          see more networking tips
        </a>

        {/* Compare Interests Button */}
        <button
          className="mt-5 border border-black rounded-lg px-6 py-2 flex items-center justify-center gap-2 transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-md hover:bg-[#f9f3e9]"
        >
          ⭕ search for yourself
        </button>

        {/* Plus icon */}
        <button 
          className="mt-5 w-9 h-9 border border-black rounded-full text-xl flex items-center justify-center"
          onClick={handleSearchClick}>
          +
        </button>
      </div>

      {/* Footer */}
      <p className="text-sm text-gray-700 mt-8">made with 💖</p>
    </div>
  );
}

export default Analyze;
