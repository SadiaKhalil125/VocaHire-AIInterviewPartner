import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';
import { 
  Calendar,
  MessageCircle,
  User,
  Bot,
  Eye,
  EyeOff,
  RefreshCw,
  Filter,
  Search,
  ChevronDown,
  Clock,
  Award,
  TrendingUp,
  FileText,
  X,
  Star,
  Target,
  BookOpen
} from 'lucide-react';

const InterviewSubmissions = () => {
  // State management
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const user = useSelector(state => state.user);

  const API_BASE_URL = 'http://127.0.0.1:8000';

  // Fetch all interviews on component mount
  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/getallinterviews`);
      setInterviews(response.data);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      alert('Error fetching interview submissions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Extract score from summary
  const extractScore = (summary) => {
    if (!summary) return null;
    const scoreMatch = summary.match(/SCORE:\s*(\d+(?:\.\d+)?)[\/\s]*10/i);
    return scoreMatch ? parseFloat(scoreMatch[1]) : null;
  };

  // Extract topic from chat history or summary
  const extractTopic = (chatHistory, summary) => {
    if (!chatHistory && !summary) return 'General Interview';
    
    const textToAnalyze = (chatHistory + ' ' + summary).toLowerCase();
    
    if (textToAnalyze.includes('data structure') || textToAnalyze.includes('algorithm')) {
      return 'Data Structures & Algorithms';
    } else if (textToAnalyze.includes('web development') || textToAnalyze.includes('react') || textToAnalyze.includes('javascript')) {
      return 'Web Development';
    } else if (textToAnalyze.includes('mobile') || textToAnalyze.includes('android') || textToAnalyze.includes('ios')) {
      return 'Mobile Development';
    } else if (textToAnalyze.includes('machine learning') || textToAnalyze.includes('ai') || textToAnalyze.includes('ml')) {
      return 'Machine Learning';
    } else if (textToAnalyze.includes('behavioral') || textToAnalyze.includes('leadership')) {
      return 'Behavioral Questions';
    } else if (textToAnalyze.includes('system design')) {
      return 'System Design';
    }
    
    return 'Technical Interview';
  };

  // Extract question from chat history
  const extractQuestion = (chatHistory) => {
    if (!chatHistory) return 'No question available';
    
    // Look for content between quotes after 'content='
    const contentMatch = chatHistory.match(/content='([^']+)'/);
    if (contentMatch) {
      return contentMatch[1];
    }
    
    // Fallback: extract first sentence that ends with a question mark
    const questionMatch = chatHistory.match(/([^.!?]*\?)/);
    if (questionMatch) {
      return questionMatch[1].trim();
    }
    
    return 'Question content not available';
  };

  // Get performance level based on score
  const getPerformanceLevel = (score) => {
    if (!score) return { level: 'Not Scored', color: 'text-gray-400' };
    if (score >= 9) return { level: 'Excellent', color: 'text-green-400' };
    if (score >= 7) return { level: 'Good', color: 'text-blue-400' };
    if (score >= 5) return { level: 'Average', color: 'text-yellow-400' };
    return { level: 'Needs Improvement', color: 'text-red-400' };
  };

  // Get formatted date (using _id since it contains timestamp)
  const getFormattedDate = (id) => {
    try {
      // Extract timestamp from MongoDB ObjectId (first 8 characters represent timestamp in hex)
      const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Date not available';
    }
  };

  // Filter and sort interviews
  const filteredInterviews = interviews
    .filter(interview => {
      if (!searchTerm) return true;
      const searchText = searchTerm.toLowerCase();
      const topic = extractTopic(interview.chat_history, interview.summary);
      const question = extractQuestion(interview.chat_history);
      
      return (
        topic.toLowerCase().includes(searchText) ||
        interview.summary.toLowerCase().includes(searchText) ||
        question.toLowerCase().includes(searchText)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return b._id.localeCompare(a._id);
      } else if (sortBy === 'oldest') {
        return a._id.localeCompare(b._id);
      } else if (sortBy === 'score') {
        const scoreA = extractScore(a.summary) || 0;
        const scoreB = extractScore(b.summary) || 0;
        return scoreB - scoreA;
      }
      return 0;
    });

  // Open interview details modal
  const openInterviewModal = (interview) => {
    setSelectedInterview(interview);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedInterview(null);
  };

  // Calculate average score
  const getAverageScore = () => {
    const scoresWithValues = interviews
      .map(interview => extractScore(interview.summary))
      .filter(score => score !== null);
    
    if (scoresWithValues.length === 0) return 0;
    return (scoresWithValues.reduce((sum, score) => sum + score, 0) / scoresWithValues.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-28 font-sans">
      <div className="max-w-6xl mx-auto px-4">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            {user.name}'s Interview Submissions
          </h1>
          <p className="text-gray-400">
            Review your completed interviews and track your progress over time.
          </p>
        </header>

        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <FileText className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{interviews.length}</h3>
              <p className="text-gray-400">Total Submissions</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">{getAverageScore()}</h3>
              <p className="text-gray-400">Average Score</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">
                {interviews.filter(i => extractScore(i.summary) >= 7).length}
              </h3>
              <p className="text-gray-400">Good+ Scores</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-white">
                {interviews.filter(i => extractScore(i.summary) !== null).length}
              </h3>
              <p className="text-gray-400">Scored Interviews</p>
            </div>
          </div>

          {/* Search and Sort */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search interviews, topics, or questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="score">Highest Score</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            <button
              onClick={fetchInterviews}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2"
            >
              <RefreshCw size={20} />
              Refresh
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 text-purple-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-400">Loading your interview submissions...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredInterviews.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-300 mb-2">No Submissions Found</h3>
              <p className="text-gray-500">
                {interviews.length === 0 
                  ? "You haven't completed any interviews yet. Start your first interview to see submissions here!"
                  : "No interviews match your search criteria. Try adjusting your search terms."
                }
              </p>
            </div>
          )}

          {/* Interview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInterviews.map((interview) => {
              const score = extractScore(interview.summary);
              const topic = extractTopic(interview.chat_history, interview.summary);
              const question = extractQuestion(interview.chat_history);
              const performance = getPerformanceLevel(score);
              
              return (
                <div
                  key={interview._id}
                  className="bg-gray-900 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer border border-gray-700 hover:border-purple-500"
                  onClick={() => openInterviewModal(interview)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">
                        {topic}
                      </h3>
                      <div className="flex items-center text-gray-400 text-sm mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        {getFormattedDate(interview._id)}
                      </div>
                    </div>
                    <Eye className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>

                  <div className="space-y-2 mb-4">
                    {score && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Score:</span>
                        <span className="text-white font-semibold">{score}/10</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Performance:</span>
                      <span className={`font-semibold ${performance.color}`}>
                        {performance.level}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-3">
                    <strong>Question:</strong> {question.length > 80 ? question.substring(0, 80) + '...' : question}
                  </div>

                  <div className="text-xs text-gray-500 line-clamp-2">
                    {interview.summary.substring(0, 100)}
                    {interview.summary.length > 100 && '...'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interview Details Modal */}
        {showModal && selectedInterview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-white">
                  {extractTopic(selectedInterview.chat_history, selectedInterview.summary)} Interview
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Clock className="w-5 h-5 text-purple-400 mr-2" />
                      <span className="text-gray-300">Date</span>
                    </div>
                    <p className="text-white font-semibold">
                      {getFormattedDate(selectedInterview._id)}
                    </p>
                  </div>
                  
                  {extractScore(selectedInterview.summary) && (
                    <div className="bg-gray-900 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Star className="w-5 h-5 text-yellow-400 mr-2" />
                        <span className="text-gray-300">Score</span>
                      </div>
                      <p className="text-white font-semibold">
                        {extractScore(selectedInterview.summary)}/10
                      </p>
                    </div>
                  )}
                  
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Target className="w-5 h-5 text-green-400 mr-2" />
                      <span className="text-gray-300">Performance</span>
                    </div>
                    <p className={`font-semibold ${getPerformanceLevel(extractScore(selectedInterview.summary)).color}`}>
                      {getPerformanceLevel(extractScore(selectedInterview.summary)).level}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-4">Interview Question</h3>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <p className="text-gray-300">
                      {extractQuestion(selectedInterview.chat_history)}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-4">Performance Summary</h3>
                  <div className="bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <p className="text-gray-300 whitespace-pre-wrap">
                      {selectedInterview.summary}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Raw Chat History</h3>
                  <div className="bg-gray-900 rounded-lg p-4 max-h-48 overflow-y-auto">
                    <pre className="text-xs text-gray-400 whitespace-pre-wrap">
                      {selectedInterview.chat_history}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="text-center mt-10 text-gray-500 text-sm">
          <p>Keep practicing to improve your interview performance!</p>
        </footer>
      </div>
    </div>
  );
};

export default InterviewSubmissions;