import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Github,
  Heart,
  Code,
  Users,
  Trophy,
  BookOpen,
  MessageCircle
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white ">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                VocaHire
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering professionals to excel in their interviews through AI-powered practice sessions and personalized feedback.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>Trusted by 10,000+ professionals</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 ml-18">
              <li>
                <a href="/practice" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Start Practice</span>
                </a>
              </li>
              <li>
                <a href="/history" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>View History</span>
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a href="/profile" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center space-x-2">
                  <Trophy className="w-4 h-4" />
                  <span>Profile</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Interview Topics */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Popular Topics</h4>
            <ul className="space-y-2">
              <li>
                <a href="/practice?topic=web-development" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Web Development
                </a>
              </li>
              <li>
                <a href="/practice?topic=data-structures" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Data Structures & Algorithms
                </a>
              </li>
              <li>
                <a href="/practice?topic=system-design" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  System Design
                </a>
              </li>
              <li>
                <a href="/practice?topic=behavioral" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Behavioral Questions
                </a>
              </li>
              <li>
                <a href="/practice?topic=machine-learning" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                  Machine Learning
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Connect With Us</h4>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-purple-400" />
                <span>support@vocahire.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-purple-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <p className="text-gray-400 text-sm">Follow us:</p>
              <div className="flex space-x-3">
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-500 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors">
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-xl font-bold text-white mb-2">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-6">
              Get the latest interview tips, new features, and practice recommendations delivered to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>© {currentYear} VocaHire. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <span className="inline-flex items-center space-x-1">
                Made with <Heart className="w-4 h-4 text-red-500 mx-1" />for your success
            </span>

            </div>

            {/* Legal Links */}
            <div className="flex space-x-6 text-gray-400 text-sm">
              <a href="/privacy" className="hover:text-purple-400 transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-purple-400 transition-colors">
                Terms of Service
              </a>
              <a href="/cookies" className="hover:text-purple-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>

        {/* Success Stats */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <h5 className="text-2xl font-bold text-purple-400">10,000+</h5>
              <p className="text-gray-400 text-sm">Active Users</p>
            </div>
            <div>
              <h5 className="text-2xl font-bold text-pink-400">50,000+</h5>
              <p className="text-gray-400 text-sm">Interviews Completed</p>
            </div>
            <div>
              <h5 className="text-2xl font-bold text-blue-400">85%</h5>
              <p className="text-gray-400 text-sm">Success Rate</p>
            </div>
            <div>
              <h5 className="text-2xl font-bold text-green-400">4.8/5</h5>
              <p className="text-gray-400 text-sm">User Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Border */}
      <div className="h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600"></div>
    </footer>
  );
};

export default Footer;