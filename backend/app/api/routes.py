import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Department, Competency, UserCompetency, Course, Enrollment, SkillGap, QuizAttempt, LearningMaterial
from app import schemas
from app.services.ai_service import AIService
from app.services.competency_service import CompetencyService
from app.services.recommendation_service import RecommendationService
from app.services.igot_service import MockIGOTService
from app.services.document_service import DocumentService
from app.services.analytics_service import AnalyticsService

router = APIRouter()
ai_service = AIService()

# -------------------------------------------------------------
# AUTH & USER PROFILE
# -------------------------------------------------------------
@router.post("/auth/login", response_model=schemas.UserResponse)
def login(req: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.strip().lower()).first()
    if not user:
        # Default to official user if invalid email provided during demo
        user = db.query(User).filter(User.email == "official@statskill.gov.in").first()
    return user

@router.get("/users/me", response_model=schemas.UserResponse)
def get_current_user(email: str = "official@statskill.gov.in", db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/users/me", response_model=schemas.UserResponse)
def update_profile(
    update_data: schemas.UserProfileUpdate,
    email: str = "official@statskill.gov.in",
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if update_data.full_name is not None:
        user.full_name = update_data.full_name
    if update_data.designation is not None:
        user.designation = update_data.designation
    if update_data.experience_years is not None:
        user.experience_years = update_data.experience_years
    if update_data.education is not None:
        user.education = update_data.education
    if update_data.current_assignment is not None:
        user.current_assignment = update_data.current_assignment
    if update_data.career_goal is not None:
        user.career_goal = update_data.career_goal

    db.commit()
    db.refresh(user)

    # Trigger re-calculation of skill gaps and recommendations with updated career goal!
    CompetencyService.calculate_skill_gaps(db, user)
    return user

# -------------------------------------------------------------
# COMPETENCIES & SKILL GAPS
# -------------------------------------------------------------
@router.get("/competencies", response_model=List[schemas.CompetencySchema])
def get_all_competencies(db: Session = Depends(get_db)):
    return db.query(Competency).all()

@router.get("/users/{user_id}/competencies")
def get_user_competencies(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_comps = db.query(UserCompetency).filter(UserCompetency.user_id == user.id).all()
    
    # Calculate domain averages
    domain_totals = {"Statistical": [], "Technical": [], "Digital Governance": [], "Behavioural & Managerial": []}
    detailed_list = []

    for uc in user_comps:
        comp = uc.competency
        cat = comp.category
        if cat in domain_totals:
            domain_totals[cat].append(uc.current_score)

        detailed_list.append({
            "id": uc.id,
            "competency_id": comp.id,
            "name": comp.name,
            "category": cat,
            "description": comp.description,
            "current_score": uc.current_score,
            "required_score": uc.required_score,
            "gap": max(0.0, uc.required_score - uc.current_score),
            "level": uc.level,
            "last_updated": uc.last_updated
        })

    summaries = []
    for cat, scores in domain_totals.items():
        avg = sum(scores) / len(scores) if scores else 0.0
        summaries.append({
            "category": cat,
            "score": round(avg, 1),
            "competencies_count": len(scores)
        })

    return {
        "overall_score": user.overall_competency_score,
        "domain_summaries": summaries,
        "competencies": detailed_list,
        "ai_insight": f"Based on your role in {user.department.name if user.department else 'MoSPI'}, experience ({user.experience_years} yrs), and performance, strengthening Python, SQL, and Cloud Computing will yield the highest impact for your current responsibilities."
    }

@router.get("/skill-gaps", response_model=List[schemas.SkillGapSchema])
def get_skill_gaps(email: str = "official@statskill.gov.in", db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    gaps = CompetencyService.calculate_skill_gaps(db, user)
    return gaps

# -------------------------------------------------------------
# COURSES & RECOMMENDATIONS
# -------------------------------------------------------------
@router.get("/recommendations")
def get_recommendations(email: str = "official@statskill.gov.in", db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    recs = RecommendationService.get_personalized_recommendations(db, user)
    return recs

@router.get("/courses")
def get_courses(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    provider: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Course)
    if category and category != "All":
        query = query.filter(Course.category == category)
    if difficulty and difficulty != "All":
        query = query.filter(Course.difficulty == difficulty)
    if provider and provider != "All":
        query = query.filter(Course.provider_type == provider.lower())
    
    courses = query.all()
    if search:
        s = search.lower()
        courses = [c for c in courses if s in c.title.lower() or s in c.description.lower()]

    result = []
    for c in courses:
        result.append({
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "provider": c.provider,
            "provider_type": c.provider_type,
            "category": c.category,
            "duration": c.duration,
            "difficulty": c.difficulty,
            "rating": c.rating,
            "completion_rate": c.completion_rate,
            "mock_url": c.mock_url,
            "skills_covered": c.skills_covered
        })
    return result

@router.get("/courses/{course_id}")
def get_course_detail(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    return {
        "id": course.id,
        "title": course.title,
        "description": course.description,
        "provider": course.provider,
        "provider_type": course.provider_type,
        "category": course.category,
        "duration": course.duration,
        "difficulty": course.difficulty,
        "rating": course.rating,
        "completion_rate": course.completion_rate,
        "mock_url": course.mock_url,
        "skills_covered": course.skills_covered,
        "modules": [
            {"title": "Module 1: Foundations & Standards", "duration": "2.5 Hours", "topics": ["Overview", "Government Guidelines", "Environment Setup"]},
            {"title": "Module 2: Core Processing & Implementation", "duration": "4.5 Hours", "topics": ["Data Cleaning", "Validation Automation", "Pipeline Scripting"]},
            {"title": "Module 3: Advanced Reporting & Security", "duration": "3.0 Hours", "topics": ["API Publishing", "Anonymization", "Production Deployment"]}
        ],
        "expected_score_improvement": "+18% to +25% Competency Boost"
    }

@router.post("/courses/{course_id}/enroll")
def enroll_course(course_id: int, email: str = "official@statskill.gov.in", db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    existing = db.query(Enrollment).filter(Enrollment.user_id == user.id, Enrollment.course_id == course.id).first()
    if existing:
        return {"status": "already_enrolled", "message": f"Already enrolled in {course.title}", "progress": existing.progress_pct}

    new_enrollment = Enrollment(
        user_id=user.id,
        course_id=course.id,
        status="In Progress",
        progress_pct=10.0
    )
    db.add(new_enrollment)
    db.commit()
    return {"status": "success", "message": f"Successfully enrolled in {course.title} via iGOT Karmayogi Adapter", "progress": 10.0}

# -------------------------------------------------------------
# ASSESSMENT & AI MCQ GENERATOR
# -------------------------------------------------------------
@router.post("/materials/upload")
async def upload_material(
    file: UploadFile = File(...),
    email: str = Form("official@statskill.gov.in"),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    content_bytes = await file.read()
    extracted_text, file_type = DocumentService.extract_text(content_bytes, file.filename)

    material = LearningMaterial(
        user_id=user.id,
        filename=file.filename,
        file_type=file_type,
        extracted_text=extracted_text,
        topic_summary=f"Extracted {len(extracted_text)} characters from {file.filename} ({file_type})."
    )
    db.add(material)
    db.commit()
    db.refresh(material)

    return {
        "id": material.id,
        "filename": material.filename,
        "file_type": material.file_type,
        "char_count": len(extracted_text),
        "text_preview": extracted_text[:500] + ("..." if len(extracted_text) > 500 else ""),
        "message": "File uploaded and text extracted successfully."
    }

@router.post("/assessments/generate", response_model=schemas.MCQGenerationResponse)
def generate_mcqs_endpoint(
    req: schemas.MCQGenerationRequest,
    email: str = Query("official@statskill.gov.in"),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == email).first()
    user_id = user.id if user else None

    # Fetch prior questions for user & material to avoid repeating
    prior_questions = []
    if user_id:
        from app.models import UserQuestionExposure, GeneratedQuestion
        exposures = db.query(UserQuestionExposure).filter(UserQuestionExposure.user_id == user_id).all()
        prior_questions = [e.question_text for e in exposures]

    text_content = req.text_content or "Stratified sampling divides a statistical population into homogeneous strata to minimize sampling error across survey operations."
    
    result = ai_service.generate_mcqs(
        text_content=text_content,
        num_questions=req.num_questions,
        difficulty=req.difficulty,
        prior_questions=prior_questions,
        db=db,
        user_id=user_id,
        material_id=req.material_id
    )
    return result

@router.post("/quiz/submit", response_model=schemas.QuizResultResponse)
def submit_quiz(
    req: schemas.QuizSubmitRequest,
    email: str = Query("official@statskill.gov.in"),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    questions = req.questions
    answers = req.user_answers
    max_score = len(questions)
    score = 0

    topic_correct = {}
    topic_total = {}

    for i, q in enumerate(questions):
        user_ans = answers.get(str(i), "").strip()
        topic = q.topic or "General Statistics"
        topic_total[topic] = topic_total.get(topic, 0) + 1

        correct_ans = q.correct_answer.strip()
        # Match option letter (A, B, C, D) or full text
        if user_ans and (user_ans == correct_ans or user_ans[0] == correct_ans[0]):
            score += 1
            topic_correct[topic] = topic_correct.get(topic, 0) + 1

    topic_breakdown = {}
    for topic, total in topic_total.items():
        corr = topic_correct.get(topic, 0)
        topic_breakdown[topic] = round((corr / total) * 100.0, 1)

    percentage = round((score / max_score) * 100.0, 1) if max_score > 0 else 0.0
    ai_feedback = ai_service.generate_quiz_feedback(score, max_score, topic_breakdown)

    # ANTI-CHEATING INTEGRITY SCORE CALCULATIONS
    tab_switches = req.tab_switches or 0
    integrity_score = max(0.0, round(100.0 - (tab_switches * 25.0), 1))
    integrity_flags = []
    if tab_switches > 0:
        integrity_flags.append(f"{tab_switches} Tab/Window Switch Violation(s) Detected")
    if tab_switches >= 3:
        integrity_flags.append("Auto-Submitted Due to Maximum Tab Violation Limit")

    if req.per_question_times:
        fast_answers = [q_idx for q_idx, secs in req.per_question_times.items() if secs < 3]
        if fast_answers:
            integrity_flags.append(f"Anomalous Speed Detected on Question(s): {', '.join(fast_answers)}")
            integrity_score = max(0.0, integrity_score - 10.0)

    # DYNAMIC COMPETENCY SCORE BOOST UPON QUIZ SUBMISSION!
    user_comps = db.query(UserCompetency).filter(UserCompetency.user_id == user.id).all()
    boost = 3.5 if percentage >= 70 else 1.5

    for uc in user_comps:
        comp_name = uc.competency.name.lower()
        if any(t.lower() in comp_name for t in topic_breakdown.keys()) or percentage >= 80:
            uc.current_score = min(98.0, uc.current_score + boost)
            if uc.current_score >= 80:
                uc.level = "Advanced"

    # Update overall competency score
    all_scores = [uc.current_score for uc in user_comps]
    new_overall = sum(all_scores) / len(all_scores) if all_scores else user.overall_competency_score
    user.overall_competency_score = round(new_overall, 1)

    attempt = QuizAttempt(
        user_id=user.id,
        assessment_title=req.assessment_title,
        score=score,
        max_score=max_score,
        percentage=percentage,
        topic_breakdown=topic_breakdown,
        ai_feedback=ai_feedback,
        tab_switches=tab_switches,
        integrity_score=integrity_score,
        integrity_flags=integrity_flags,
        per_question_times=req.per_question_times or {}
    )
    db.add(attempt)
    db.commit()

    # Refresh skill gaps
    CompetencyService.calculate_skill_gaps(db, user)

    return {
        "score": score,
        "max_score": max_score,
        "percentage": percentage,
        "topic_breakdown": topic_breakdown,
        "ai_feedback": ai_feedback,
        "updated_overall_competency": user.overall_competency_score,
        "integrity_score": integrity_score,
        "integrity_flags": integrity_flags
    }

# -------------------------------------------------------------
# STATBOT AI ASSISTANT & LEARNER PROGRESS
# -------------------------------------------------------------
@router.post("/ai/chat", response_model=schemas.ChatResponse)
def chat_with_statbot(req: schemas.ChatRequest, email: str = Query("official@statskill.gov.in"), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    context = {}
    if user:
        context = {
            "designation": user.designation,
            "competency_score": user.overall_competency_score,
            "career_goal": user.career_goal
        }

    reply = ai_service.answer_statbot_question(req.message, context)
    return {
        "reply": reply,
        "suggested_prompts": [
            "Explain stratified vs cluster sampling",
            "Why is data privacy crucial under DPDP 2023?",
            "How do I use Python Pandas for survey data cleaning?",
            "Which course should I take to improve Cloud Computing score?"
        ]
    }

@router.get("/progress")
def get_learner_progress(email: str = Query("official@statskill.gov.in"), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    attempts = db.query(QuizAttempt).filter(QuizAttempt.user_id == user.id).all()
    enrollments = db.query(Enrollment).filter(Enrollment.user_id == user.id).all()

    # Competency over time line chart data
    competency_trend = [
        {"date": "Month 1", "score": 58.0, "event": "Baseline Assessment"},
        {"date": "Month 2", "score": 61.5, "event": "Completed Survey Sampling Module"},
        {"date": "Month 3", "score": 64.0, "event": "Completed Data Viz in R"},
        {"date": "Current", "score": user.overall_competency_score, "event": "Latest AI Assessment"}
    ]

    before_after = [
        {"domain": "Statistical Methods", "before": 72.0, "after": 82.0},
        {"domain": "Technical Skills", "before": 48.0, "after": 61.0},
        {"domain": "Digital Governance", "before": 38.0, "after": 48.0},
        {"domain": "Behavioural & Managerial", "before": 65.0, "after": 72.0}
    ]

    timeline = [
        {"type": "assessment", "title": "Baseline Competency Assessment", "date": "1 month ago", "detail": "Initial score: 66%"},
        {"type": "course", "title": "Completed 'Advanced Survey Sampling & Estimation'", "date": "3 weeks ago", "detail": "NSSTA Training Programme"},
        {"type": "quiz", "title": "Passed 'Sampling Methods MCQ Quiz'", "date": "2 weeks ago", "detail": "Score: 90% (9/10)"},
        {"type": "competency", "title": "Competency Profile Re-evaluated", "date": "1 week ago", "detail": "Statistical Methods score boosted to 82%"},
        {"type": "recommendation", "title": "New Recommendation Unlocked", "date": "Today", "detail": "Python for Data Analysis (iGOT Karmayogi)"}
    ]

    return {
        "learning_hours": 38,
        "courses_completed": len([e for e in enrollments if e.status == "Completed"]) + 1,
        "courses_in_progress": len([e for e in enrollments if e.status == "In Progress"]),
        "assessments_taken": len(attempts) + 2,
        "competency_improvement_pct": round(user.overall_competency_score - 58.0, 1),
        "competency_trend": competency_trend,
        "before_after": before_after,
        "timeline": timeline
    }

# -------------------------------------------------------------
# ADMIN DASHBOARD, OFFICERS MONITORING & AUDIT LOGS
# -------------------------------------------------------------
@router.get("/admin/analytics", response_model=schemas.AdminStatsResponse)
def get_admin_analytics(db: Session = Depends(get_db)):
    metrics = AnalyticsService.get_admin_dashboard_metrics(db)
    return metrics

@router.get("/admin/officers")
def get_all_officers(db: Session = Depends(get_db)):
    """Returns directory of all officials for Authority performance monitoring."""
    officers = db.query(User).filter(User.role == "official").all()
    
    result = []
    for u in officers:
        gaps = db.query(SkillGap).filter(SkillGap.user_id == u.id, SkillGap.priority.in_(["High", "Critical"])).all()
        last_attempt = db.query(QuizAttempt).filter(QuizAttempt.user_id == u.id).order_by(QuizAttempt.created_at.desc()).first()
        
        integrity_status = "Good"
        if last_attempt and last_attempt.integrity_score < 75.0:
            integrity_status = "Warning"

        result.append({
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "designation": u.designation,
            "department": u.department.name if u.department else "General Pool",
            "experience_years": u.experience_years,
            "overall_competency_score": u.overall_competency_score,
            "critical_gaps_count": len(gaps),
            "last_active": last_attempt.created_at.strftime("%Y-%m-%d") if last_attempt else "Recent",
            "integrity_status": integrity_status,
            "intervention_flagged": bool(u.intervention_flagged),
            "intervention_notes": u.intervention_notes,
            "intervention_date": u.intervention_date.strftime("%Y-%m-%d") if u.intervention_date else None
        })
    return result

@router.get("/admin/officers/{user_id}")
def get_officer_detail(user_id: int, db: Session = Depends(get_db)):
    """Returns detailed profile analytics for a single officer."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Officer not found")

    user_comps = db.query(UserCompetency).filter(UserCompetency.user_id == user.id).all()
    domain_totals = {"Statistical": [], "Technical": [], "Digital Governance": [], "Behavioural & Managerial": []}
    for uc in user_comps:
        cat = uc.competency.category
        if cat in domain_totals:
            domain_totals[cat].append(uc.current_score)

    domain_radar = []
    for cat, scores in domain_totals.items():
        avg = sum(scores) / len(scores) if scores else 50.0
        domain_radar.append({"subject": cat, "score": round(avg, 1), "fullMark": 100})

    attempts = db.query(QuizAttempt).filter(QuizAttempt.user_id == user.id).order_by(QuizAttempt.created_at.asc()).all()
    quiz_history = []
    for a in attempts:
        quiz_history.append({
            "id": a.id,
            "title": a.assessment_title,
            "percentage": a.percentage,
            "integrity_score": a.integrity_score,
            "tab_switches": a.tab_switches,
            "integrity_flags": a.integrity_flags or [],
            "date": a.created_at.strftime("%b %d, %Y")
        })

    enrollments = db.query(Enrollment).filter(Enrollment.user_id == user.id).all()
    course_list = []
    for e in enrollments:
        course_list.append({
            "id": e.course.id,
            "title": e.course.title,
            "provider": e.course.provider,
            "status": e.status,
            "progress_pct": e.progress_pct
        })

    gaps = db.query(SkillGap).filter(SkillGap.user_id == user.id).order_by(SkillGap.priority_score.desc()).all()
    gap_list = []
    for g in gaps:
        gap_list.append({
            "skill_name": g.skill_name,
            "category": g.category,
            "gap_score": g.gap_score,
            "priority": g.priority,
            "priority_reason": g.priority_reason
        })

    # Comparative averages
    dept_avg = 69.5
    org_avg = 68.4

    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "designation": user.designation,
        "department": user.department.name if user.department else "Unassigned",
        "experience_years": user.experience_years,
        "education": user.education,
        "career_goal": user.career_goal,
        "overall_competency_score": user.overall_competency_score,
        "dept_average": dept_avg,
        "org_average": org_avg,
        "delta_vs_dept": round(user.overall_competency_score - dept_avg, 1),
        "intervention_flagged": bool(user.intervention_flagged),
        "intervention_notes": user.intervention_notes,
        "intervention_date": user.intervention_date.strftime("%Y-%m-%d") if user.intervention_date else None,
        "domain_radar": domain_radar,
        "quiz_history": quiz_history,
        "course_enrollments": course_list,
        "skill_gaps": gap_list,
        "learning_hours": 38,
        "streak_days": 12
    }

@router.post("/admin/officers/{user_id}/intervention")
def update_officer_intervention(
    user_id: int,
    req: schemas.OfficerInterventionRequest,
    db: Session = Depends(get_db)
):
    """Flags or clears intervention status for an officer and logs to AdminAuditLog."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Officer not found")

    user.intervention_flagged = 1 if req.intervention_flagged else 0
    user.intervention_notes = req.intervention_notes or ("Intervention flagged for skill gap review" if req.intervention_flagged else "Intervention resolved")
    user.intervention_date = datetime.datetime.utcnow()

    # Create Audit Log
    admin_user = db.query(User).filter(User.role == "admin").first()
    audit_entry = AdminAuditLog(
        admin_id=admin_user.id if admin_user else None,
        admin_name=admin_user.full_name if admin_user else "Dr. Rajesh Verma",
        action="FLAG_INTERVENTION" if req.intervention_flagged else "RESOLVE_INTERVENTION",
        target_user_id=user.id,
        target_user_name=user.full_name,
        details=f"Notes: {user.intervention_notes}"
    )
    db.add(audit_entry)
    db.commit()
    db.refresh(user)

    return {
        "status": "success",
        "message": f"Updated intervention status for {user.full_name}",
        "intervention_flagged": bool(user.intervention_flagged),
        "intervention_notes": user.intervention_notes
    }

@router.get("/admin/audit-log")
def get_admin_audit_logs(db: Session = Depends(get_db)):
    """Returns append-only audit log of admin interventions and actions."""
    from app.models import AdminAuditLog
    logs = db.query(AdminAuditLog).order_by(AdminAuditLog.created_at.desc()).all()
    result = []
    for l in logs:
        result.append({
            "id": l.id,
            "admin_name": l.admin_name,
            "action": l.action,
            "target_user_name": l.target_user_name,
            "details": l.details,
            "created_at": l.created_at.strftime("%b %d, %Y %H:%M")
        })
    return result

