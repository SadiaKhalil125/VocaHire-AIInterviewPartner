# VocaHire - AI-Powered Interview Practice Platform

**Video Demo**: https://www.loom.com/share/7284d107127e42b5960323fa788d5ffe?sid=87b46f3d-ce5d-48e6-a004-bf505a9ccb64

<img width="1366" height="768" alt="Screenshot (1195)" src="https://github.com/user-attachments/assets/f6af4127-e526-403b-9834-dfc137125fef" />
<img width="1366" height="768" alt="Screenshot (1196)" src="https://github.com/user-attachments/assets/5bab5572-f980-456c-9018-b6df70f39229" />
<img width="1366" height="768" alt="Screenshot (1198)" src="https://github.com/user-attachments/assets/08dcc27b-e2d8-4682-942c-682320a93973" />
<img width="1366" height="768" alt="Screenshot (1200)" src="https://github.com/user-attachments/assets/7b799ea6-41bb-47b9-affc-610a4d7468ff" />
<img width="1366" height="768" alt="Screenshot (1202)" src="https://github.com/user-attachments/assets/b3d47865-d261-43cf-8e38-2d2924b8f67b" />
<img width="1366" height="768" alt="Screenshot (1203)" src="https://github.com/user-attachments/assets/e522ccfd-457b-4ffb-b6ad-c09bca6cd923" />

## 🎯 Project Overview

VocaHire is a comprehensive AI-powered interview practice platform that helps users prepare for job interviews through interactive AI-driven conversations. The platform features real-time interview simulations, pose detection for body language analysis, and detailed feedback and scoring.

## 🚀 Features

- **AI Interview Simulation**: Interactive interview sessions with GPT-3.5-turbo
- **Voice Recognition**: Real-time speech-to-text using Web Speech API
- **User Authentication**: Signup and login functionality
- **Interview History**: Track and review past interview sessions
- **Detailed Feedback**: Comprehensive performance analysis and recommendations
- **Responsive UI**: Modern, mobile-friendly interface built with React and Tailwind CSS

## 🛠️ Technology Stack

### Frontend
- **React 19.1.0** - Modern React with latest features
- **Vite 7.0.4** - Fast build tool and development server
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **Redux Toolkit 2.8.2** - State management
- **React Router DOM 7.7.1** - Client-side routing
- **Axios 1.11.0** - HTTP client for API calls
- **Web Speech API** - Voice recognition and text-to-speech
  - SpeechRecognition: Real-time speech-to-text conversion
  - SpeechSynthesis: Text-to-speech for interview questions
- **Lucide React 0.536.0** - Beautiful icons

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **Python 3.8+** - Programming language
- **MongoDB** - NoSQL database for data persistence
- **LangChain** - Framework for developing applications with LLMs
- **OpenAI GPT-3.5-turbo** - AI language model for interview questions
- **Pydantic** - Data validation using Python type annotations
- **Uvicorn** - ASGI server for running FastAPI applications
- **python-dotenv** - Environment variable management

### Development Tools
- **ESLint 9.30.1** - JavaScript linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
VocaHire/
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── models/
│   │   ├── __init__.py
│   │   └── User.py          # User data model
│   ├── requirements.txt     # Python dependencies
│   └── .gitignore          # Git ignore rules
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── store.js     # Redux store configuration
│   │   ├── features/
│   │   │   └── user/
│   │   │       └── userslice.js  # Redux user slice
│   │   ├── models/
│   │   │   └── User.js      # Frontend user model
│   │   ├── App.jsx          # Main application component
│   │   ├── HomePage.jsx     # Home page component
│   │   ├── Login.jsx        # Login component
│   │   ├── Signup.jsx       # Signup component
│   │   ├── InterviewPractice.jsx    # Interview practice component
│   │   ├── InterviewSubmissions.jsx # Interview history component
│   │   ├── Header.jsx       # Header component
│   │   ├── Footer.jsx       # Footer component
│   │   └── main.jsx         # Application entry point
│   ├── package.json         # Node.js dependencies
│   ├── vite.config.js       # Vite configuration
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── .gitignore          # Git ignore rules
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and **npm** (for frontend)
- **Python 3.8+** and **pip** (for backend)
- **MongoDB** (local installation or MongoDB Atlas)
- **OpenAI API Key** (for AI interview functionality)

### Environment Variables

Create a `.env` file in the backend directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/

# Optional: Server Configuration
PORT=8000
HOST=0.0.0.0
```

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Start the backend server:**
   ```bash
   python main.py
   ```

The backend will be available at `http://127.0.0.1:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

- `POST /signup` - User registration
- `POST /login` - User authentication

### Interview Endpoints

- `POST /start-interview` - Start a new interview session
- `POST /continue-interview` - Continue interview with answer
- `POST /end-interview` - End interview and get feedback
- `GET /session/{session_id}` - Get session information
- `GET /sessions` - List all active sessions
- `DELETE /session/{session_id}` - Delete a session
- `GET /getallinterviews` - Get all interview history


## 🎨 Key Features Explained

### AI Interview System
- Uses OpenAI's GPT-3.5-turbo for generating contextual interview questions
- Maintains conversation history for coherent interview flow
- Provides detailed feedback and scoring at the end of sessions

### Voice Recognition & Speech Synthesis
- Real-time speech-to-text conversion using Web Speech API
- Text-to-speech for interview questions
- Hands-free interview experience with voice commands

### State Management
- Redux Toolkit for centralized state management
- Persistent user sessions
- Real-time interview state tracking

## 🔧 Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

**Backend:**
- `python main.py` - Start development server

### Code Style

- **Frontend**: ESLint configuration with React hooks and refresh plugins
- **Backend**: PEP 8 Python style guide
- **Database**: MongoDB with Pydantic models for validation

## 🚀 Deployment

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)

### Backend Deployment
1. Install dependencies: `pip install -r requirements.txt`
2. Set environment variables
3. Deploy to your preferred hosting service (Railway, Heroku, AWS, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the API documentation at `http://127.0.0.1:8000/docs` when running locally


---

**Built with ❤️ using modern web technologies** 
