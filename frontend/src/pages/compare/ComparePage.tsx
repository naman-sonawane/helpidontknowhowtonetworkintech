import { useNavigate } from 'react-router-dom';

function Compare() {
    return (
      <div className="h-screen w-full bg-[#fdf5eb] flex flex-col justify-between items-center px-6 py-8 font-serif text-black">
        {/* Top loading label (optional) */}
        <div className="text-sm text-gray-400 w-full text-left">loading</div>
  
        {/* Centered comparing text */}
        <div className="flex-1 flex items-center justify-center text-lg">
          comparing...
        </div>
  
        {/* Footer */}
        <p className="text-sm text-gray-700">made with 💖</p>
      </div>
    );
  }
  
export default Compare;