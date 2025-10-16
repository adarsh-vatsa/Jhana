from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime
import uuid

# User Models
class AssessmentAnswer(BaseModel):
    question_id: int
    option_id: str
    modules: List[str]

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    assessment_completed: bool = False
    assessment_answers: List[AssessmentAnswer] = []
    recommended_modules: List[str] = []

# Jhana Meditation Models
class JhanaSessionCreate(BaseModel):
    user_id: str
    duration: int
    type: str

class JhanaSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    duration: int
    type: str
    date: datetime = Field(default_factory=datetime.utcnow)
    completed: bool = True

# Learning Module Models
class LearningCardCreate(BaseModel):
    user_id: str
    front: str
    back: str

class LearningCard(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    front: str
    back: str
    next_review: datetime = Field(default_factory=datetime.utcnow)
    interval: int = 0
    ease_factor: float = 2.5

class CardReviewUpdate(BaseModel):
    interval: int
    ease_factor: float
    next_review: datetime

class PomodoroSessionCreate(BaseModel):
    user_id: str
    duration: int
    task: str

class PomodoroSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    duration: int
    task: str
    date: datetime = Field(default_factory=datetime.utcnow)
    completed: bool = True

# Routine Builder Models
class Habit(BaseModel):
    id: str
    name: str
    anchor: bool = False
    stacked_after: Optional[str] = None
    time: Optional[str] = None

class RoutineCreate(BaseModel):
    user_id: str
    name: str

class Routine(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    habits: List[Habit] = []
    completions: Dict[str, List[str]] = {}

class RoutineUpdate(BaseModel):
    name: Optional[str] = None
    habits: Optional[List[Habit]] = None

class HabitCompletion(BaseModel):
    date: str
    habit_ids: List[str]
