from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr
from datetime import datetime

# Auth / User Schemas
class LoginRequest(BaseModel):
    email: str

class UserBase(BaseModel):
    email: str
    full_name: str
    role: str
    designation: str
    department_id: Optional[int] = None
    experience_years: float
    education: str
    current_assignment: str
    career_goal: str
    overall_competency_score: float

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    designation: Optional[str] = None
    experience_years: Optional[float] = None
    education: Optional[str] = None
    current_assignment: Optional[str] = None
    career_goal: Optional[str] = None

class DepartmentSchema(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    official_count: int

    class Config:
        from_attributes = True

class UserResponse(UserBase):
    id: int
    department: Optional[DepartmentSchema] = None

    class Config:
        from_attributes = True

# Competency Schemas
class CompetencySchema(BaseModel):
    id: int
    name: str
    category: str
    description: Optional[str] = None
    future_demand_weight: float

    class Config:
        from_attributes = True

class UserCompetencySchema(BaseModel):
    id: int
    competency: CompetencySchema
    current_score: float
    required_score: float
    level: str
    last_updated: datetime

    class Config:
        from_attributes = True

class CategoryCompetencySummary(BaseModel):
    category: str
    score: float
    competencies_count: int

# Skill Gap Schemas
class SkillGapSchema(BaseModel):
    id: int
    skill_name: str
    category: str
    current_score: float
    required_score: float
    gap_score: float
    priority: str # Low, Medium, High, Critical
    priority_score: float
    priority_reason: str

    class Config:
        from_attributes = True

# Course & Recommendation Schemas
class CourseSchema(BaseModel):
    id: int
    title: str
    description: str
    provider: str
    provider_type: str # igot, nssta
    category: str
    duration: str
    difficulty: str
    rating: float
    completion_rate: float
    mock_url: str
    skills_covered: List[str]

    class Config:
        from_attributes = True

class RecommendationSchema(BaseModel):
    course: CourseSchema
    match_score: float
    ai_reason: str
    priority: str

class CourseEnrollRequest(BaseModel):
    course_id: int

# Assessment & Quiz Schemas
class QuestionSchema(BaseModel):
    id: Optional[int] = None
    text: str
    options: List[str]
    correct_answer: str
    explanation: str
    topic: str
    difficulty: str

class MCQGenerationRequest(BaseModel):
    text_content: Optional[str] = None
    num_questions: int = 10
    difficulty: str = "Medium" # Easy, Medium, Hard, Mixed
    question_type: str = "MCQ" # MCQ, Quiz

class MCQGenerationResponse(BaseModel):
    questions: List[QuestionSchema]
    topic_summary: str
    detected_topics: List[str]

class QuizSubmitRequest(BaseModel):
    assessment_title: str
    user_answers: Dict[str, str] # {question_index_or_id: option_chosen}
    questions: List[QuestionSchema]

class QuizResultResponse(BaseModel):
    score: int
    max_score: int
    percentage: float
    topic_breakdown: Dict[str, float]
    ai_feedback: str
    updated_overall_competency: float

# Chatbot Schema
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
    suggested_prompts: Optional[List[str]] = None

# Admin Analytics Schemas
class AdminStatsResponse(BaseModel):
    total_officials: int
    average_competency: float
    critical_skill_gaps_count: int
    courses_completed: int
    total_training_hours: int
    department_competencies: List[Dict[str, Any]]
    top_skill_gaps: List[Dict[str, Any]]
    competency_distribution: List[Dict[str, Any]]
    emerging_skills: List[Dict[str, Any]]
    heatmap_matrix: Dict[str, Dict[str, float]]
