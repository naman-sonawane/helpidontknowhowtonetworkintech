import { useNavigate } from 'react-router-dom';

function Results2() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/results1');
  };

  return (
    <div className="h-screen bg-[#fdf5eb] font-serif flex flex-col items-center justify-between px-6 py-6 text-black">
      {/* Logo */}
      <img src="/venn.svg" alt="Venn" className="w-12 h-12" />

      {/* Names + squiggle */}
      <div className="text-center">
        <h1 className="text-xl font-medium">Christopher + Naman</h1>
        <p className="text-2xl mt-1">~ ~ ~ ~ ~ ~ ~</p>
      </div>

      {/* Prompt + questions */}
      <div className="mt-4 space-y-4 text-center text-[15px] leading-relaxed">
        <p className="italic text-sm text-gray-600">you can ask him...</p>
        <p>“How did you decide on the tech stack for your projects like Kinesis?”</p>
        <p>“Any tools or frameworks you’d recommend?”</p>
        <p>"How did you land your full-time role at Scripty, and what excites you most about working there?"</p>
      </div>

      {/* Back + Profile button */}
      <div className="flex gap-2 mt-6 items-center">
        <button
          onClick={goBack}
          className="border border-black rounded-full w-9 h-9 flex items-center justify-center text-lg"
        >
          ←
        </button>
        <button className="border border-black rounded-lg px-6 py-2 flex items-center justify-center gap-2 transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow-md hover:bg-[#f9f3e9]">
          👤 profile
        </button>
      </div>

      {/* Footer */}
      <p className="text-sm text-gray-700 mt-4">made with 💖</p>
    </div>
  );
}

export default Results2;
