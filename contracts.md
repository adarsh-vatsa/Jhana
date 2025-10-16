# Backend & Frontend Integration Contracts

## Overview
This document outlines the API contracts and integration strategy for the MindFlow mental wellness platform.

## Current Mock Data (to be replaced)
Located in `/app/frontend/src/mock.js`:
- `mockAssessmentQuestions` - Assessment questionnaire
- `getAIRecommendation()` - Mock AI recommendation logic
- `mockJhanaSessions`, `mockLearningCards`, `mockPomodoroSessions`, `mockRoutines` - Mock user data

## Backend Architecture

### 1. Database Models (MongoDB)

#### User Model
```python
{
    "id": str (UUID),
    "created_at": datetime,
    "assessment_completed": bool,
    "assessment_answers": list,
    "recommended_modules": list[str]
}
```

#### JhanaSession Model
```python
{
    "id": str (UUID),
    "user_id": str,
    "duration": int (seconds),
    "type": str ("Breath Focus", "Body Scan", "Open Awareness"),
    "date": datetime,
    "completed": bool
}
```

#### LearningCard Model
```python
{
    "id": str (UUID),
    "user_id": str,
    "front": str,
    "back": str,
    "next_review": datetime,
    "interval": int (days),
    "ease_factor": float
}
```

#### PomodoroSession Model
```python
{
    "id": str (UUID),
    "user_id": str,
    "duration": int (seconds),
    "task": str,
    "date": datetime,
    "completed": bool
}
```

#### Routine Model
```python
{
    "id": str (UUID),
    "user_id": str,
    "name": str,
    "habits": list[{
        "id": str,
        "name": str,
        "anchor": bool,
        "stacked_after": str (habit_id),
        "time": str (optional)
    }],
    "completions": dict (date_key -> list[habit_ids])
}
```

## API Endpoints

### Assessment APIs

#### POST /api/assessment/submit
**Request:**
```json
{
  "answers": [
    {"question_id": 1, "option_id": "focus", "modules": ["learning", "routine"]},
    ...
  ]
}
```

**Response:**
```json
{
  "user_id": "uuid",
  "recommended_modules": ["learning", "routine", "jhana"],
  "ai_message": "Based on your responses, we recommend..."
}
```

**AI Integration:**
- Use Emergent LLM (GPT-4o-mini) to analyze assessment answers
- Generate personalized recommendations and motivational message
- Store in user record

### Jhana Meditation APIs

#### POST /api/jhana/sessions
Create new meditation session

#### GET /api/jhana/sessions?user_id={id}
Get user's meditation history

#### GET /api/jhana/stats?user_id={id}
Get meditation statistics

### Learning Module APIs

#### GET /api/learning/cards?user_id={id}
Get all flashcards for user

#### POST /api/learning/cards
Create new flashcard

#### PUT /api/learning/cards/{card_id}/review
Update card after review with spaced repetition data

#### GET /api/pomodoro/sessions?user_id={id}
Get pomodoro history

#### POST /api/pomodoro/sessions
Create pomodoro session

### Routine Builder APIs

#### GET /api/routines?user_id={id}
Get all routines for user

#### POST /api/routines
Create new routine

#### PUT /api/routines/{routine_id}
Update routine (add/remove habits)

#### POST /api/routines/{routine_id}/complete
Mark habit(s) as completed for a date

## Frontend Integration Strategy

### Phase 1: Setup
1. Install emergentintegrations library
2. Add EMERGENT_LLM_KEY to backend/.env
3. Create API service layer in frontend

### Phase 2: Replace Mock Data
1. Create `/app/frontend/src/services/api.js` - Axios wrapper
2. Update AppContext to fetch from API instead of localStorage
3. Replace `getAIRecommendation()` with API call to backend

### Phase 3: Component Updates
- **Assessment.js**: Call `/api/assessment/submit` instead of mock function
- **Dashboard.js**: Fetch stats from aggregation APIs
- **JhanaMeditation.js**: CRUD operations via API
- **LearningModule.js**: CRUD operations via API, maintain spaced repetition logic
- **RoutineBuilder.js**: CRUD operations via API

### Phase 4: Data Migration
- Keep localStorage as fallback/cache
- Sync localStorage with backend on component mount
- Handle offline scenarios gracefully

## AI Integration Details

### Assessment Analysis
**Endpoint:** POST /api/assessment/submit
**AI Task:** Analyze user responses and provide:
1. Ranked module recommendations
2. Personalized insights about their challenges
3. Motivational message about their journey

**Prompt Template:**
```
You are a wellness coach analyzing a user's assessment. 
User answers: {answers}
Provide JSON response with:
1. recommended_modules: Ranked list of ["jhana", "learning", "routine"]
2. message: Personal, encouraging message (2-3 sentences)
3. insights: Brief analysis of their needs
```

## Technical Notes
- All dates stored in ISO format
- User identification via session-based system (no auth yet)
- LocalStorage as backup for offline capability
- Spaced repetition algorithm remains client-side for responsiveness
