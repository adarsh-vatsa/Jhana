import os
import json
from emergentintegrations.llm.chat import LlmChat, UserMessage
from models import AssessmentAnswer
from typing import List

class AIService:
    def __init__(self):
        self.api_key = os.environ.get('EMERGENT_LLM_KEY')
        
    async def analyze_assessment(self, answers: List[AssessmentAnswer]) -> dict:
        """Analyze user assessment answers and provide personalized recommendations"""
        
        # Prepare assessment summary for AI
        summary = "\n".join([
            f"Q{ans.question_id}: Selected option '{ans.option_id}'"
            for ans in answers
        ])
        
        # Calculate module scores
        module_scores = {"jhana": 0, "learning": 0, "routine": 0}
        for answer in answers:
            for module in answer.modules:
                module_scores[module] = module_scores.get(module, 0) + 1
        
        # Rank modules
        sorted_modules = sorted(
            module_scores.items(), 
            key=lambda x: x[1], 
            reverse=True
        )
        recommended_modules = [module for module, score in sorted_modules]
        
        # Create AI prompt
        prompt = f"""You are a compassionate wellness coach analyzing a user's self-assessment.

User's assessment responses:
{summary}

Module recommendation scores:
- Jhana Meditation: {module_scores['jhana']} points
- Learning Module: {module_scores['learning']} points  
- Routine Builder: {module_scores['routine']} points

Recommended order: {', '.join(recommended_modules)}

Provide a warm, encouraging message (2-3 sentences) that:
1. Acknowledges their challenges
2. Explains why these modules will help them
3. Motivates them to start their journey

Keep it personal, supportive, and action-oriented. Respond with ONLY the message text, no labels or formatting."""
        
        try:
            # Initialize LLM chat
            chat = LlmChat(
                api_key=self.api_key,
                session_id=f"assessment_{hash(summary)}",
                system_message="You are a supportive wellness coach focused on mental health and productivity."
            ).with_model("openai", "gpt-4o-mini")
            
            # Get AI response
            user_message = UserMessage(text=prompt)
            ai_message = await chat.send_message(user_message)
            
            return {
                "recommended_modules": recommended_modules,
                "ai_message": ai_message.strip(),
                "module_scores": module_scores
            }
            
        except Exception as e:
            print(f"AI Service Error: {str(e)}")
            # Fallback to rule-based message
            return {
                "recommended_modules": recommended_modules,
                "ai_message": f"Based on your responses, we recommend starting with {recommended_modules[0]}, followed by {recommended_modules[1]} and {recommended_modules[2]}. You're taking an important step toward personal growth!",
                "module_scores": module_scores
            }
