import { ArrowRight} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function HomePage(){
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 pt-16">
    
      
      <main className="text-center">
        <h2 className="text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Ace Your Next Interview
        </h2>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Our AI-powered platform provides realistic interview simulations to help you build confidence and master your responses.
        </p>
        <button
          onClick={()=>navigate('/dashboard')}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-10 rounded-full font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
        >
          <span>Go to Dashboard</span>
          <ArrowRight size={22} />
        </button>
      </main>

    
    </div>
  );
};

export default HomePage;