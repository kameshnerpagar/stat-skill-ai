from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models import User, Course
from app.services.competency_service import CompetencyService
from app.services.igot_service import MockIGOTService

class RecommendationService:
    @staticmethod
    def get_personalized_recommendations(db: Session, user: User) -> List[Dict[str, Any]]:
        """
        Generates personalized course recommendations combining iGOT Karmayogi courses and NSSTA programmes.
        Ranks by match percentage and provides AI rationale for each course.
        """
        # Get active skill gaps
        gaps = CompetencyService.calculate_skill_gaps(db, user)
        gap_map = {g.skill_name.lower(): g for g in gaps}

        igot_service = MockIGOTService()
        courses = igot_service.get_courses()

        recommendations = []
        career_goal_lower = (user.career_goal or "").lower()
        dept_lower = (user.department.name if user.department else "").lower()

        for course in courses:
            skills = course.get("skills_covered", [])
            match_points = 0.0
            reasons = []

            for skill in skills:
                skill_lower = skill.lower()
                if skill_lower in gap_map:
                    gap_item = gap_map[skill_lower]
                    if gap_item.priority == "CRITICAL":
                        match_points += 35.0
                    elif gap_item.priority == "HIGH":
                        match_points += 25.0
                    elif gap_item.priority == "MEDIUM":
                        match_points += 15.0
                    else:
                        match_points += 10.0
                    reasons.append(f"Closes identified {gap_item.priority} gap in {skill} (Gap: {gap_item.gap_score:.0f}%)")

            # Career Goal alignment
            if any(k in course["title"].lower() for k in ["python", "ai", "cloud", "data science"]) and "data science" in career_goal_lower:
                match_points += 20.0
                reasons.append(f"Directly supports your career goal: '{user.career_goal}'")

            # Department alignment
            if "analytics" in dept_lower and course["category"] == "Technical":
                match_points += 15.0
            elif "survey" in dept_lower and course["category"] == "Statistical":
                match_points += 15.0

            # Base fit points
            match_score = min(98.0, max(55.0, match_points + 40.0))

            if match_score >= 85:
                priority = "HIGH"
            elif match_score >= 70:
                priority = "MEDIUM"
            else:
                priority = "LOW"

            ai_reason = " | ".join(reasons) if reasons else f"Recommended as part of core {course['category']} upskilling for {user.designation}."

            recommendations.append({
                "course": course,
                "match_score": round(match_score, 1),
                "ai_reason": ai_reason,
                "priority": priority
            })

        # Sort by match_score descending
        recommendations.sort(key=lambda x: x["match_score"], reverse=True)
        return recommendations
