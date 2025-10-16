from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List
from datetime import datetime

from models import (
    User, AssessmentAnswer, JhanaSession, JhanaSessionCreate,
    LearningCard, LearningCardCreate, CardReviewUpdate,
    PomodoroSession, PomodoroSessionCreate,
    Routine, RoutineCreate, RoutineUpdate, HabitCompletion
)
from ai_service import AIService


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Initialize AI Service
ai_service = AIService()

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "MindFlow API is running"}

# ===== Assessment APIs =====

@api_router.post("/assessment/submit")
async def submit_assessment(answers: List[AssessmentAnswer]):
    """Submit assessment and get AI-powered recommendations"""
    try:
        # Get AI analysis
        analysis = await ai_service.analyze_assessment(answers)
        
        # Create or update user
        user = User(
            assessment_completed=True,
            assessment_answers=answers,
            recommended_modules=analysis['recommended_modules']
        )
        
        await db.users.insert_one(user.dict())
        
        return {
            "user_id": user.id,
            "recommended_modules": analysis['recommended_modules'],
            "ai_message": analysis['ai_message'],
            "module_scores": analysis['module_scores']
        }
    except Exception as e:
        logging.error(f"Assessment submission error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ===== Jhana Meditation APIs =====

@api_router.post("/jhana/sessions", response_model=JhanaSession)
async def create_jhana_session(session: JhanaSessionCreate):
    """Create a new meditation session"""
    session_obj = JhanaSession(**session.dict())
    await db.jhana_sessions.insert_one(session_obj.dict())
    return session_obj

@api_router.get("/jhana/sessions", response_model=List[JhanaSession])
async def get_jhana_sessions(user_id: str):
    """Get all meditation sessions for a user"""
    sessions = await db.jhana_sessions.find({"user_id": user_id}).sort("date", -1).to_list(1000)
    return [JhanaSession(**s) for s in sessions]

@api_router.get("/jhana/stats")
async def get_jhana_stats(user_id: str):
    """Get meditation statistics for a user"""
    sessions = await db.jhana_sessions.find({"user_id": user_id}).to_list(1000)
    total_sessions = len(sessions)
    total_minutes = sum(s['duration'] for s in sessions) / 60
    
    return {
        "total_sessions": total_sessions,
        "total_minutes": int(total_minutes)
    }

# ===== Learning Module APIs =====

@api_router.get("/learning/cards", response_model=List[LearningCard])
async def get_learning_cards(user_id: str):
    """Get all flashcards for a user"""
    cards = await db.learning_cards.find({"user_id": user_id}).to_list(1000)
    return [LearningCard(**c) for c in cards]

@api_router.post("/learning/cards", response_model=LearningCard)
async def create_learning_card(card: LearningCardCreate):
    """Create a new flashcard"""
    card_obj = LearningCard(**card.dict())
    await db.learning_cards.insert_one(card_obj.dict())
    return card_obj

@api_router.put("/learning/cards/{card_id}/review")
async def review_learning_card(card_id: str, update: CardReviewUpdate):
    """Update card after review"""
    result = await db.learning_cards.update_one(
        {"id": card_id},
        {"$set": update.dict()}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Card not found")
    return {"success": True}

@api_router.get("/pomodoro/sessions", response_model=List[PomodoroSession])
async def get_pomodoro_sessions(user_id: str):
    """Get pomodoro session history"""
    sessions = await db.pomodoro_sessions.find({"user_id": user_id}).sort("date", -1).to_list(1000)
    return [PomodoroSession(**s) for s in sessions]

@api_router.post("/pomodoro/sessions", response_model=PomodoroSession)
async def create_pomodoro_session(session: PomodoroSessionCreate):
    """Create a new pomodoro session"""
    session_obj = PomodoroSession(**session.dict())
    await db.pomodoro_sessions.insert_one(session_obj.dict())
    return session_obj

# ===== Routine Builder APIs =====

@api_router.get("/routines", response_model=List[Routine])
async def get_routines(user_id: str):
    """Get all routines for a user"""
    routines = await db.routines.find({"user_id": user_id}).to_list(1000)
    return [Routine(**r) for r in routines]

@api_router.post("/routines", response_model=Routine)
async def create_routine(routine: RoutineCreate):
    """Create a new routine"""
    routine_obj = Routine(**routine.dict())
    await db.routines.insert_one(routine_obj.dict())
    return routine_obj

@api_router.put("/routines/{routine_id}")
async def update_routine(routine_id: str, update: RoutineUpdate):
    """Update a routine (add/remove habits)"""
    update_data = {k: v for k, v in update.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    result = await db.routines.update_one(
        {"id": routine_id},
        {"$set": update_data}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Routine not found")
    return {"success": True}

@api_router.post("/routines/{routine_id}/complete")
async def complete_habit(routine_id: str, completion: HabitCompletion):
    """Mark habits as completed for a date"""
    routine = await db.routines.find_one({"id": routine_id})
    if not routine:
        raise HTTPException(status_code=404, detail="Routine not found")
    
    completions = routine.get('completions', {})
    completions[completion.date] = completion.habit_ids
    
    await db.routines.update_one(
        {"id": routine_id},
        {"$set": {"completions": completions}}
    )
    return {"success": True}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()