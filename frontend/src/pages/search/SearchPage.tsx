import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Search() {
  const navigate = useNavigate();
  const [name, setName] = useState('');

  const handleCompareClick = () => {
    navigate('/results1');
  }

  return (
    <div className="h-screen w-full bg-[#fdf5eb] font-serif flex flex-col items-center justify-center px-6 text-black">
      {/* Name Input */}
      <div className="flex flex-col w-full max-w-sm mb-10">
        <label htmlFor="name" className="mb-1 text-base">
          your name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Naman Sonawane"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-transparent border-b border-black text-lg px-1 py-0.5 focus:outline-none"
        />
      </div>

      {/* Compare Button */}
      <button
        className="border border-black rounded-xl px-6 py-2 flex items-center justify-center gap-2 text-lg transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-md hover:bg-[#f9f3e9] relative"
        onClick={handleCompareClick}
      >
        <img src="/compareicon.png" alt="Compare" className="w-auto h-5 mr-1" /> compare interests
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-yellow-400 rounded-full border border-white"></span>
      </button>
    </div>
  );
}

export default Search;