import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between items-center">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Text column */}
        <div className="space-y-4 text-4xl sm:text-5xl md:text-6xl text-center">
          <span className="font-serif">help</span>
          <span className="font-serif">i</span>
          <span className="font-serif">dont</span>
          <span className="font-serif">know</span>
          <span className="font-serif">how</span>
          <span className="font-serif">to</span>
          <span className="font-serif">network</span>
          <span className="font-serif">in</span>
          <span className="font-serif">.tech</span>
        </div>

        {/* Circular button */}
        <div className="mt-12">
          <button className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
            border-2 border-black rounded-full flex items-center justify-center
            hover:border-gray-500 transition-colors">
            <span className="text-2xl sm:text-3xl md:text-4xl">+</span>
          </button>
        </div>
      </div>

      {/* Footer text */}
      <div className="text-sm sm:text-base md:text-lg text-gray-600">
        made with 💖
      </div>
    </div>
  )
}

export default App
