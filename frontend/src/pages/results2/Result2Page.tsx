import { useNavigate } from 'react-router-dom';

function Results2() {
  const navigate = useNavigate();

  const GoToPrev = () => {
    navigate('/results1');
  };

  return (
    <div className="h-screen bg-[#fdf5eb] font-serif flex flex-col justify-between px-6 py-6 text-black">
      {/* Centered Body */}
      <div className="flex-1 flex flex-col justify-center items-center gap-6">
        {/* Logo */}
        <img src="/venn.svg" alt="Venn" className="w-24 h-24" />

        {/* Name + squiggle */}
        <div className="text-center">
          <h1 className="text-xl font-medium">Christopher + Naman</h1>
          <p className="text-2xl mt-1">~ ~ ~ ~ ~ ~ ~</p>
        </div>

        {/* Questions */}
        <div className="text-center text-[15px] space-y-4 max-w-md">
          <p className="italic text-sm text-gray-600">you can ask him...</p>
          <p>“How did you decide on the tech stack for your projects like Kinesis?”</p>
          <p>“Any tools or frameworks you’d recommend?”</p>
          <p>
            "How did you land your full-time role at Scripty, and what excites you most about working there?"
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={GoToPrev}
            className="border border-black rounded-full w-9 h-9 flex items-center justify-center text-lg"
          >
            ←
          </button>
          <button className="border border-black rounded-lg px-6 py-2 flex items-center justify-center gap-2 transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-md hover:bg-[#f9f3e9]">
            👤 profile
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-sm text-gray-700 text-center">made with 💖</p>
    </div>
  );
}

export default Results2;
