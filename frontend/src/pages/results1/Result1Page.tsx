import { useNavigate } from 'react-router-dom';

function Results1() {
  const navigate = useNavigate();

  const goToNext = () => {
    navigate('/results2');
  };

  return (
    <div className="h-screen bg-[#fdf5eb] font-serif flex flex-col items-center justify-between px-6 py-6 text-black">
      {/* Main Centered Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <img src="/venn.svg" alt="Venn Diagram" className="w-24 h-24" />

        <div className="text-center">
          <h1 className="text-xl font-medium">Christopher + Naman</h1>
          <p className="text-2xl mt-1">~ ~ ~ ~ ~ ~ ~</p>
        </div>

        <div className="mt-2 space-y-4 text-[15px] leading-relaxed text-center max-w-md">
          <p>You both are involved in multiple <strong>hackathons</strong> and tech competitions.</p>
          <p>You both focus on Full Stack Development, <strong>Python</strong>, and <strong>AI</strong>.</p>
          <p>You both have leadership roles in organizing and <strong>managing events</strong>.</p>
          <p>You both have worked on <strong>web and UI/UX</strong> design.</p>
          <p>You both are passionate about teaching and <strong>community engagement</strong> in tech.</p>
        </div>

        <button
          onClick={goToNext}
          className="mt-6 border border-black rounded-full w-9 h-9 flex items-center justify-center text-xl"
        >
          →
        </button>
      </div>

      {/* Footer */}
      <p className="text-sm text-gray-700">made with 💖</p>
    </div>

  );
}

export default Results1;
