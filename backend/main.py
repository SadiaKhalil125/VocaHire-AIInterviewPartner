import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from fastapi import FastAPI
from models.User import User
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
from pydantic import BaseModel
from langchain.llms import OpenAI
from langchain_openai import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.schema import HumanMessage, AIMessage
from langchain.prompts import PromptTemplate, ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import conversation
from datetime import datetime
from dotenv import load_dotenv
import logging
from pymongo import MongoClient


# ---- MongoDB Setup ----
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")

client = MongoClient(MONGO_URI)
db = client["VOCAHIRE"]
users = db["users"]
interviews = db["interviews"]

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AI Interview Practice API",
    description="Backend service for AI-powered interview practice sessions",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class StartInterviewRequest(BaseModel):
    topic: str
    session_id: str

class ContinueInterviewRequest(BaseModel):
    session_id: str
    answer: str
    topic: str

class EndInterviewRequest(BaseModel):
    session_id: str
    topic: str

class InterviewSession:
    def __init__(self, session_id: str, topic: str):
        self.session_id = session_id
        self.topic = topic
        self.created_at = datetime.now()
        self.conversation_history = []
        self.question_count = 0
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            ai_prefix="Interviewer",
            human_prefix="Candidate"
        )

# Global session storage (use Redis or database in production)
active_sessions: Dict[str, InterviewSession] = {}

# Initialize LangChain components
def get_llm():
    """Initialize and return the language model."""
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        raise ValueError("OPENAI_API_KEY environment variable is required")
    
    return ChatOpenAI(
        model_name="gpt-3.5-turbo",
        temperature=0.7,
        openai_api_key=openai_api_key
    )

# Interview question generation prompts
INTERVIEW_START_TEMPLATE = """You are an experienced interviewer conducting a {topic} interview. 
Your role is to ask thoughtful, relevant questions that assess the candidate's skills and experience.

Topic: {topic}

This is the beginning of the interview. Start with an appropriate opening question that:
1. Is relevant to the {topic} topic
2. Allows the candidate to demonstrate their knowledge/experience
3. Is professional and engaging
4. Is not too complex for an opening question

Generate only the question, no additional text or formatting."""

INTERVIEW_CONTINUE_TEMPLATE = """You are an experienced interviewer conducting a {topic} interview.

Previous conversation:
{chat_history}

The candidate just answered: "{answer}"

Based on their answer and the interview context, generate the next appropriate question that:
1. Builds upon their previous answer
2. Digs deeper into their {topic} knowledge/experience
3. Maintains professional interview flow
4. Assesses different aspects of their capabilities
5. Is challenging but fair

Generate only the next question, no additional text or formatting."""

INTERVIEW_SUMMARY_TEMPLATE = """You are an experienced interviewer who just completed a {topic} interview.

Complete interview conversation:
{chat_history}

Topic: {topic}

Provide a comprehensive summary and feedback including:

INTERVIEW SUMMARY:
- Overall performance assessment
- Key strengths demonstrated
- Areas for improvement
- Communication effectiveness

DETAILED FEEDBACK:
- Technical/domain knowledge evaluation
- Problem-solving approach
- Clarity of responses
- Professional demeanor

RECOMMENDATIONS:
- Specific areas to focus on for improvement
- Study suggestions or resources
- Practice recommendations
- Next steps for career development

SCORE: X/10 (with brief justification)

Format your response in a clear, professional manner that would be helpful for the candidate's growth."""

def get_interview_chain(template: str, topic: str, memory: ConversationBufferMemory = None):
    """Create a conversation chain for interview interactions."""
    llm = get_llm()
    
    if memory:
        prompt = ChatPromptTemplate.from_messages([
            ("system", template),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}")
        ])
        
        chain = conversation(
            llm=llm,
            memory=memory,
            prompt=prompt,
            verbose=True
        )
    else:
        prompt = PromptTemplate(
            input_variables=["topic"],
            template=template
        )
        chain = prompt | llm 
    
    return chain


@app.post("/start-interview")
async def start_interview(request: StartInterviewRequest) -> str:
    """Start a new interview session and return the first question."""
    try:
        logger.info(f"Starting interview for session {request.session_id} with topic {request.topic}")
        
        # Create new session
        session = InterviewSession(request.session_id, request.topic)
        active_sessions[request.session_id] = session
        
        # Generate first question
        chain = get_interview_chain(INTERVIEW_START_TEMPLATE, request.topic)
        first_question = chain.invoke({'topic':request.topic})
        
        # Store the first question in session
        session.conversation_history.append({
            "type": "question",
            "content": first_question,
            "timestamp": datetime.now()
        })
        session.question_count += 1
        
        # Add to memory
        session.memory.chat_memory.add_ai_message(first_question)
        
        logger.info(f"Generated first question for session {request.session_id}")
        return first_question.content
        
    except Exception as e:
        logger.error(f"Error starting interview: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error starting interview: {str(e)}")

@app.post("/continue-interview")
async def continue_interview(request: ContinueInterviewRequest) -> str:
    """Continue the interview with the candidate's answer and return next question."""
    try:
        logger.info(f"Continuing interview for session {request.session_id}")
        
        # Get session
        if request.session_id not in active_sessions:
            raise HTTPException(status_code=404, detail="Interview session not found")
        
        session = active_sessions[request.session_id]
        
        # Store candidate's answer
        session.conversation_history.append({
            "type": "answer",
            "content": request.answer,
            "timestamp": datetime.now().isoformat()
        })
        
        # Add answer to memory
        session.memory.chat_memory.add_user_message(request.answer)
        
        # Generate next question
        chat_history = session.memory.chat_memory.messages
        
        # Format chat history for the prompt
        formatted_history = ""
        for msg in chat_history:
            if isinstance(msg, HumanMessage):
                formatted_history += f"Candidate: {msg.content}\n"
            elif isinstance(msg, AIMessage):
                formatted_history += f"Interviewer: {msg.content}\n"
        
        # Create chain for continuing interview
        llm = get_llm()
        prompt = PromptTemplate(
            input_variables=["topic", "chat_history", "answer"],
            template=INTERVIEW_CONTINUE_TEMPLATE
        )
        chain = prompt | llm
        
        next_question = chain.invoke({
            'topic':request.topic,
            'chat_history':formatted_history,
            'answer':request.answer
        }
        )
        
        # Store the next question
        session.conversation_history.append({
            "type": "question",
            "content": next_question,
            "timestamp": datetime.now().isoformat()
        })
        session.question_count += 1
        
        # Add to memory
        session.memory.chat_memory.add_ai_message(next_question)
        
        logger.info(f"Generated next question for session {request.session_id}")
        return next_question.content
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error continuing interview: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error continuing interview: {str(e)}")

@app.post("/end-interview")
async def end_interview(request: EndInterviewRequest) -> str:
    """End the interview session and return summary with suggestions."""
    try:
        logger.info(f"Ending interview for session {request.session_id}")
        
        # Get session
        if request.session_id not in active_sessions:
            logger.info(f"Here is problem! {active_sessions}")
            raise HTTPException(status_code=404, detail="Interview session not found")
        
        session = active_sessions[request.session_id]
        
        # Format complete conversation history
        chat_history = ""
        for entry in session.conversation_history:
            if entry["type"] == "question":
                chat_history += f"Interviewer: {entry['content']}\n"
            else:
                chat_history += f"Candidate: {entry['content']}\n"
        
        
       
        llm = get_llm()
        prompt = PromptTemplate(
            input_variables=["topic", "chat_history"],
            template=INTERVIEW_SUMMARY_TEMPLATE
        )
        chain = prompt | llm
        
        summary = chain.invoke(
            {
            'topic':request.topic,
            'chat_history':chat_history
            }
        )
        
        # Store summary in session
        session.conversation_history.append({
            "type": "summary",
            "content": summary,
            "timestamp": datetime.now().isoformat()
        })
        interviews.insert_one({
            'chat_history':chat_history,
            'summary':summary.content
        })
        logger.info(f"Generated summary for session {request.session_id}")
        
        
        
        return summary.content
        
    except Exception as e:
        logger.error(f"Error ending interview: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error ending interview: {str(e)}")

@app.get("/session/{session_id}")
async def get_session_info(session_id: str):
    """Get information about a specific interview session."""
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Interview session not found")
    
    session = active_sessions[session_id]
    return {
        "session_id": session.session_id,
        "topic": session.topic,
        "created_at": session.created_at.isoformat(),
        "question_count": session.question_count,
        "conversation_length": len(session.conversation_history)
    }

@app.get("/sessions")
async def get_active_sessions():
    """Get list of all active interview sessions."""
    return {
        "active_sessions": len(active_sessions),
        "sessions": [
            {
                "session_id": session_id,
                "topic": session.topic,
                "created_at": session.created_at.isoformat(),
                "question_count": session.question_count
            }
            for session_id, session in active_sessions.items()
        ]
    }

@app.delete("/session/{session_id}")
async def delete_session(session_id: str):
    """Delete a specific interview session."""
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Interview session not found")
    
    del active_sessions[session_id]
    return {"message": f"Session {session_id} deleted successfully"}


def serialize_document(doc):
    doc["_id"] = str(doc["_id"])
    return doc

@app.get("/getallinterviews")
async def get_interviews():
    try:
        cursor = interviews.find()
        inter_list = [serialize_document(doc) for doc in cursor]
        return inter_list
    except Exception as e:
        raise HTTPException(status_code=404, detail="Unable to show all interviews")
    
# Error handlers
@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {str(exc)}")
    return HTTPException(status_code=500, detail="Internal server error")

@app.post("/signup")
def signup(user:User):
    try:
       user_data = user.dict(by_alias=True)
       inserted = users.insert_one(user_data)
       user_data["_id"] = str(inserted.inserted_id)
       return {'user_data':user_data}
    except Exception as e:
        raise HTTPException(status_code=404,detail="Unable to signup")

@app.post("/login")
def login(user:User):
    try:
        user = users.find_one({
            'email':user.email, 
            'password':user.password})
        if user:
            return {"loggedin":True}
        else:
            return {"loggedin":False}
    except Exception as e:
        raise HTTPException(status_code=404,detail="Not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")