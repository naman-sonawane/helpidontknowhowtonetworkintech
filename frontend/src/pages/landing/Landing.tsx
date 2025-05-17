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
        <div className="hidden lg:block text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif">
          help i dont know how to network in .tech
        </div>

        {/* Plus Button */}
        <div className="mt-12">
          <button 
            className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20
              border-2 border-black rounded-full flex items-center justify-center
              hover:border-gray-500 transition-colors" 
            onClick={handleCameraClick}
          >
            <span className="text-xl sm:text-2xl md:text-3xl">+</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mb-4 text-sm sm:text-base md:text-lg text-center text-gray-600">
        made with 💖
      </div>
    </div>
  )
}

export default Landing