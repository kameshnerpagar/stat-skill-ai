import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text, nullable=True)
    official_count = Column(Integer, default=0)

    users = relationship("User", back_populates="department")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    role = Column(String, default="official")  # 'official' or 'admin'
    designation = Column(String, default="Statistical Officer")
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    experience_years = Column(Float, default=4.0)
    education = Column(String, default="M.Sc. Statistics")
    current_assignment = Column(String, default="National Survey Data Processing Pipeline")
    career_goal = Column(String, default="Move into Data Science and Advanced Statistical Analytics")
    overall_competency_score = Column(Float, default=66.0)
    intervention_flagged = Column(Integer, default=0) # 0 or 1
    intervention_notes = Column(Text, nullable=True)
    intervention_date = Column(DateTime, nullable=True)

    department = relationship("Department", back_populates="users")
    competencies = relationship("UserCompetency", back_populates="user", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="user", cascade="all, delete-orphan")
    quiz_attempts = relationship("QuizAttempt", back_populates="user", cascade="all, delete-orphan")
    materials = relationship("LearningMaterial", back_populates="user", cascade="all, delete-orphan")
    skill_gaps = relationship("SkillGap", back_populates="user", cascade="all, delete-orphan")

class Competency(Base):
    __tablename__ = "competencies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    category = Column(String, index=True) # 'Statistical', 'Technical', 'Digital Governance', 'Behavioural & Managerial'
    description = Column(Text, nullable=True)
    future_demand_weight = Column(Float, default=0.5)

    user_competencies = relationship("UserCompetency", back_populates="competency")

class UserCompetency(Base):
    __tablename__ = "user_competencies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    competency_id = Column(Integer, ForeignKey("competencies.id"))
    current_score = Column(Float, default=50.0)
    required_score = Column(Float, default=80.0)
    level = Column(String, default="Intermediate") # 'Beginner', 'Intermediate', 'Advanced', 'Expert'
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="competencies")
    competency = relationship("Competency", back_populates="user_competencies")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    provider = Column(String, default="iGOT Karmayogi")
    provider_type = Column(String, default="igot") # 'igot', 'nssta'
    category = Column(String, index=True)
    duration = Column(String, default="10 Hours")
    difficulty = Column(String, default="Intermediate")
    rating = Column(Float, default=4.8)
    completion_rate = Column(Float, default=88.5)
    mock_url = Column(String, default="https://igotkarmayogi.gov.in")
    skills_covered = Column(JSON, default=list) # List of competency names

    enrollments = relationship("Enrollment", back_populates="course")

class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    status = Column(String, default="In Progress") # 'Enrolled', 'In Progress', 'Completed'
    progress_pct = Column(Float, default=0.0)
    enrolled_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    domain = Column(String)
    total_questions = Column(Integer, default=10)

    questions = relationship("Question", back_populates="assessment", cascade="all, delete-orphan")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=True)
    text = Column(Text)
    options = Column(JSON) # List of 4 string options
    correct_answer = Column(String) # E.g. 'A', 'B', 'C', 'D' or actual option string
    explanation = Column(Text)
    topic = Column(String)
    difficulty = Column(String, default="Medium")

    assessment = relationship("Assessment", back_populates="questions")

class GeneratedQuestion(Base):
    __tablename__ = "generated_questions"

    id = Column(Integer, primary_key=True, index=True)
    material_id = Column(Integer, ForeignKey("learning_materials.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    question_text = Column(Text, index=True)
    options = Column(JSON)
    correct_answer = Column(String)
    explanation = Column(Text)
    topic = Column(String)
    difficulty = Column(String, default="Medium")
    question_type = Column(String, default="MCQ") # MCQ, True/False, Scenario, Fill-in-the-blank
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class UserQuestionExposure(Base):
    __tablename__ = "user_question_exposures"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    material_id = Column(Integer, ForeignKey("learning_materials.id"), nullable=True)
    question_text = Column(Text)
    seen_at = Column(DateTime, default=datetime.datetime.utcnow)

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    assessment_title = Column(String, default="Generated Competency Assessment")
    score = Column(Integer)
    max_score = Column(Integer)
    percentage = Column(Float)
    topic_breakdown = Column(JSON, default=dict)
    ai_feedback = Column(Text)
    tab_switches = Column(Integer, default=0)
    integrity_score = Column(Float, default=100.0)
    integrity_flags = Column(JSON, default=list) # List of string warning flags
    per_question_times = Column(JSON, default=dict) # Dict of question index to seconds
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="quiz_attempts")

class LearningMaterial(Base):
    __tablename__ = "learning_materials"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    filename = Column(String)
    file_type = Column(String)
    extracted_text = Column(Text)
    topic_summary = Column(Text)
    question_count = Column(Integer, default=5)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="materials")

class SkillGap(Base):
    __tablename__ = "skill_gaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    skill_name = Column(String)
    category = Column(String)
    current_score = Column(Float)
    required_score = Column(Float)
    gap_score = Column(Float)
    priority = Column(String) # 'Low', 'Medium', 'High', 'Critical'
    priority_score = Column(Float)
    priority_reason = Column(Text)

    user = relationship("User", back_populates="skill_gaps")

class AdminAuditLog(Base):
    __tablename__ = "admin_audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    admin_name = Column(String)
    action = Column(String) # E.g., "FLAG_INTERVENTION", "COURSE_ASSIGNMENT"
    target_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    target_user_name = Column(String)
    details = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

