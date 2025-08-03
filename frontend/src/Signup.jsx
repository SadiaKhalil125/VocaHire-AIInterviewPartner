import './App.css'
import { use, useState } from 'react'
import axios from 'axios'
import User from './models/User'
import { useNavigate } from 'react-router-dom'
import { User as UserIcon, Mail, Lock, UserPlus } from 'lucide-react' 

function Signup() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmedpassword, setConfirmedpassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 

        if (password !== confirmedpassword) {
            setError("Passwords do not match. Please try again.");
            return;
        }

        
        if (!name || !email || !password) {
            setError("All fields are required.");
            return;
        }

        let user = new User(null, name, email, password);
        try {
            let response = await axios.post("http://127.0.0.1:8000/signup", {
                name: user.name,
                email: user.email,
                password: user.password
            });
            
            if (response && response.data) {
                console.log(response.data);
                
                alert("Signup successful! Kindly log in.");
                navigate('/login');
            }
        } catch (err) {
            console.error("Signup failed:", err);
            setError(err.response?.data?.message || "An error occurred during signup.");
        }
    };

    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4 pt-32 pb-32 font-sans">
            <div className="text-center mb-10">
                <h1 className="text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Create Your Account
                </h1>
                <p className="text-gray-400">Join now to start practicing for your interviews.</p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md"
            >
                <div className="space-y-6">
                    {/* Name Input Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Full Name</label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                required
                            />
                        </div>
                    </div>

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
                    </div>
                    
                    {/* Confirm Password Input Field */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                                onChange={(e) => setConfirmedpassword(e.target.value)}
                                value={confirmedpassword}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Error Message Display */}
                {error && (
                    <div className="mt-6 p-3 bg-red-900/50 border border-red-700 rounded-lg text-center text-red-300 text-sm">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full mt-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                    <UserPlus size={20} />
                    <span>Create Account</span>
                </button>

                <p className="text-center text-sm text-gray-400 mt-8">
                    Already have an account?{' '}
                    <a href="/login" className="font-semibold text-purple-400 hover:underline">
                        Log In
                    </a>
                </p>
            </form>
        </div>
    );
}

export default Signup;