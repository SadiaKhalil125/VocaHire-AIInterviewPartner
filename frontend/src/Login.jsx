import './App.css'
import User from './models/User'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addUser } from './features/user/userslice'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, LogIn } from 'lucide-react'

function Login() {
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()
    const userFromStore = useSelector(state => state.user)
    const navigate = useNavigate()

   
    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = new User(null, "sadia", email, password)
        try {
            let response = await axios.post("http://127.0.0.1:8000/login", {
                name: user.name,
                email: user.email,
                password: user.password
            })
            console.log(response.data)
            if (response.data.loggedin) {
                dispatch(addUser(user))
                
                navigate('/dashboard');
            } else {
               
                alert(response.data.message || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Login request failed:", error);
            alert("An error occurred during login. Please try again.");
        }
    }


    useEffect(() => {
        console.log("User from store (effect):", userFromStore)
    }, [userFromStore])

   
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4 pt-32 pb-32 font-sans">
            <div className="text-center mb-10">
                <h1 className="text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Welcome Back
                </h1>
                <p className="text-gray-400">Login to access your AI Interview Dashboard.</p>
            </div>

            <form 
                onSubmit={handleSubmit} 
                className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md"
            >
                <div className="space-y-6">
                    {/* Email Input Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                            />
                        </div>
                    </div>

                    {/* Password Input Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                            />
                        </div>
                        <a href="#" className="text-xs text-purple-400 hover:underline mt-2 block text-right">
                            Forgot Password?
                        </a>
                    </div>
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    className="w-full mt-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                    <LogIn size={20} />
                    <span>Login</span>
                </button>

                <p className="text-center text-sm text-gray-400 mt-8">
                    Don't have an account?{' '}
                    <a href="/signup" className="font-semibold text-purple-400 hover:underline">
                        Sign Up
                    </a>
                </p>
            </form>
        </div>
    )
}

export default Login;