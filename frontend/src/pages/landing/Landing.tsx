import React from 'react'
import { useNavigate } from 'react-router-dom'

function Landing() {
  const navigate = useNavigate();

  const handleCameraClick = () => {
    navigate('/camera');
  };

  return (
    <div className="flex flex-col justify-between min-h-screen bg-[#fdf5eb] w-full">
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Vertical text for mobile */}
        <div className="block lg:hidden flex flex-col items-center space-y-4">
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-center max-w-[90%]">
            help
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-center max-w-[90%]">
            i
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-center max-w-[90%]">
            dont
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-center max-w-[90%]">
            know
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-center max-w-[90%]">
            how
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-center max-w-[90%]">
            to
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-center max-w-[90%]">
            network
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-center max-w-[90%]">
            in
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-center max-w-[90%]">
            .tech
          </p>
        </div>

        {/* Horizontal text for large screens */}
        <div className="hidden lg:block text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif">
          help i dont know how to network in .tech
        </div>
        {/* Plus Button + Label */}
        <div className="mt-12 flex flex-col items-center space-y-4">
        <button 
          className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20
            border-2 border-black rounded-full flex items-center justify-center
            hover:border-gray-500 transition-colors" 
          onClick={handleCameraClick}
        >
          <span className="text-2xl leading-none">+</span>
        </button>

          <p className="mt-4 text-sm sm:text-base text-gray-600 font-serif italic">
            press "+" to take a picture
          </p>
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
    </div>
  )
}

export default Landing