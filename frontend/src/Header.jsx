import { ArrowRight, LogIn, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {Code} from 'lucide-react'
function Header()
{
  const navigate = useNavigate();
    return(
    <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center">
      <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                         <Link to="/">VocaHire</Link>
                    </h3>
                  </div>
       
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/login')}
            className="font-bold flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg 
             hover:bg-purple-700 hover:scale-105 hover:shadow-md 
             transition-all duration-300 transform">
            <LogIn size={18} />
            <span>Login</span>
            </button>

          <button onClick={()=>navigate('/dashboard')} className="font-bold flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg 
             hover:bg-purple-700 hover:scale-105 hover:shadow-md 
             transition-all duration-300 transform">
            <User size={18} />
            <span>Dashboard</span>
          </button>
           <button onClick={()=>navigate('/interviewpractice')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-7 rounded-full font-bold text-md hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center gap-3 mx-auto">
            <span>Start Interview</span>
            <ArrowRight size={22} />
            </button>
        </div>
        
      </header>);
}
export default Header;