import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';
import { 
  Mic, 
  MicOff, 
  Send, 
  Play, 
  Pause, 
  Square, 
  MessageCircle,
  User,
  Bot,
  Volume2,
  StopCircle,
  ChevronDown,
  RefreshCw,
  X
} from 'lucide-react';

const InterviewPractice = () => {
  // State management
  const [selectedTopic, setSelectedTopic] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [summary, setSummary] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));
  const user = useSelector(state=>state.user)
    
    
  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  // Interview topics
  const interviewTopics = [
    'Web Development',
    'Mobile Development',
    'Machine Learning',
    'Technical Skills',
    'Behavioral Questions',
    'Leadership Experience',
    'Problem Solving',
    'Communication Skills',
    'Project Management',
    'Data Structures & Algorithms',
    'System Design',
    'Cultural Fit'
  ];

  const API_BASE_URL = 'http://127.0.0.1:8000'; 

  useEffect(()=>{
    },[user])

  // Start interview with selected topic
  const startInterview = async () => {
    if (!selectedTopic) return;

    setIsLoading(true);
    try {
      
      const response = await axios.post(`${API_BASE_URL}/start-interview`, {
        topic: selectedTopic,
        session_id: sessionId
      });
      
      setCurrentQuestion(response.data);
      setConversation([{ type: 'question', content: response.data }]);
      setIsInterviewActive(true);
      speakText(response.data);
    } catch (error) {
      console.error('Error starting interview:', error);
      alert('Error starting interview. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Text-to-speech function
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  // Stop text-to-speech
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  // Speech recognition state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setIsRecording(true);
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setUserAnswer(prev => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access and try again.');
        } else {
          alert(`Speech recognition error: ${event.error}`);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setIsRecording(false);
      };
    }
  }, []);

  // Start/Stop speech recognition
  const toggleSpeechRecognition = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        alert('Error starting speech recognition. Please try again.');
      }
    }
  };

  // Submit answer and get next question
  const submitAnswer = async () => {
    if (!userAnswer.trim()) return;

    setIsLoading(true);
    try {
     
      const response = await axios.post(`${API_BASE_URL}/continue-interview`, {
        session_id: sessionId,
        answer: userAnswer,
        topic: selectedTopic
      });

      const newConversation = [
        ...conversation,
        { type: 'answer', content: userAnswer },
        { type: 'question', content: response.data }
      ];

      setConversation(newConversation);
      setCurrentQuestion(response.data);
      setUserAnswer('');
      speakText(response.data);
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('Error submitting answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // End interview and get summary
  const endInterview = async () => {
    setIsLoading(true);
    stopSpeaking();
    try {
      const response = await axios.post(`${API_BASE_URL}/end-interview`, {
        session_id: sessionId,
        topic: selectedTopic
      });

      setSummary(response.data);
      setShowSummary(true);
      setIsInterviewActive(false);
    } catch (error) {
      console.error('Error ending interview:', error);
      alert('Error ending interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset interview
  const resetInterview = () => {
    setSelectedTopic('');
    setCurrentQuestion('');
    setConversation([]);
    setUserAnswer('');
    setIsInterviewActive(false);
    setShowSummary(false);
    setSummary('');
    setIsRecording(false);
    setIsListening(false);
    stopSpeaking();
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-28 font-sans flex items-center ">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            {user.name} 's Personalized AI Interview Coach
          </h1>
          <p className="text-gray-400">
            Level up your skills with our advanced AI-powered interview simulations.
          </p>
        </header>

        <main className="bg-gray-800 rounded-2xl shadow-2xl p-8 transition-all duration-500">
          {!isInterviewActive && !showSummary && (
            <div className="space-y-8">
              <div>
                <label className="block text-lg font-semibold text-gray-300 mb-3">
                  Select an Interview Topic
                </label>
                <div className="relative">
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Choose a topic...</option>
                    {interviewTopics.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <button
                onClick={startInterview}
                disabled={!selectedTopic || isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                {isLoading ? 'Preparing Your Interview...' : 'Start Interview'}
              </button>
            </div>
          )}

          {isInterviewActive && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-200">Interview in Progress</h2>
                <button
                  onClick={isPlayingAudio ? stopSpeaking : () => speakText(currentQuestion)}
                  className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  {isPlayingAudio ? <Pause size={20} /> : <Volume2 size={20} />}
                  <span>{isPlayingAudio ? 'Stop' : 'Replay'}</span>
                </button>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 max-h-96 overflow-y-auto space-y-6">
                {conversation.map((item, index) => (
                  <div key={index} className={`flex items-start gap-4 ${item.type === 'question' ? 'justify-start' : 'justify-end'}`}>
                    {item.type === 'question' && (
                      <div className="p-3 rounded-full bg-purple-500 flex-shrink-0">
                        <Bot size={20} />
                      </div>
                    )}
                    <div className={`p-4 rounded-xl max-w-xl ${item.type === 'question' ? 'bg-gray-700' : 'bg-pink-600'}`}>
                      {item.content}
                    </div>
                    {item.type === 'answer' && (
                      <div className="p-3 rounded-full bg-pink-500 flex-shrink-0">
                        <User size={20} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-300">
                  Your Answer
                </label>
                
                <div className="relative">
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder={isListening ? "Listening... start speaking." : "Type your answer or use the microphone"}
                    className="w-full p-4 pr-16 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={5}
                  />
                  <button
                    onClick={toggleSpeechRecognition}
                    className={`absolute right-4 top-4 p-2 rounded-full transition-colors ${
                      isListening ? 'bg-red-600 animate-pulse' : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                  </button>
                </div>

                {!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
                  <div className="p-3 bg-yellow-900 border border-yellow-700 rounded-lg text-yellow-300 text-sm">
                    <strong>Browser Notice:</strong> For the best experience with voice input, please use a modern browser like Chrome or Edge.
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={submitAnswer}
                    disabled={!userAnswer.trim() || isLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all"
                  >
                    <Send size={20} />
                    <span>{isLoading ? 'Submitting...' : 'Submit Answer'}</span>
                  </button>

                  <button
                    onClick={endInterview}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:bg-gray-600"
                  >
                    <StopCircle size={20} />
                    <span>End Interview</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {showSummary && (
            <div className="space-y-8 text-center">
              <h2 className="text-3xl font-bold text-gray-200">
                Interview Performance Summary
              </h2>

              <div className="bg-gray-900 rounded-lg p-6 text-left">
                <div className="prose prose-invert max-w-none prose-p:text-gray-300">
                  <p className="whitespace-pre-wrap">
                    {summary}
                  </p>
                </div>
              </div>

              <button
                onClick={resetInterview}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
              >
                <RefreshCw className="inline-block mr-2" />
                Start a New Interview
              </button>
            </div>
          )}
        </main>

        <footer className="text-center mt-10 text-gray-500 text-sm">
          <p>Practice consistently to excel in your next interview.</p>
        </footer>
      </div>
    </div>
  );
};

export default InterviewPractice;