from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models import User, UserCompetency, Competency, SkillGap

class CompetencyService:
    @staticmethod
    def calculate_skill_gaps(db: Session, user: User) -> List[SkillGap]:
        """
        Calculates and updates skill gaps using the explainable multi-factor priority algorithm.
        Factors:
        - Numerical gap score (required - current)
        - Role & Department relevance weights
        - Future skill demand weight
        - Alignment with user's Career Goal
        """
        # Delete existing skill gaps for user to refresh
        db.query(SkillGap).filter(SkillGap.user_id == user.id).delete()

        user_comps = db.query(UserCompetency).filter(UserCompetency.user_id == user.id).all()
        created_gaps = []

        career_goal_text = (user.career_goal or "").lower()
        dept_name = (user.department.name if user.department else "").lower()

        for uc in user_comps:
            comp = uc.competency
            current = uc.current_score
            required = uc.required_score
            gap_score = max(0.0, required - current)

            if gap_score <= 0:
                continue

            comp_name_lower = comp.name.lower()
            comp_cat_lower = comp.category.lower()

            # Role & Department relevance weight (1.0 - 2.0)
            role_dept_weight = 1.0
            if "data" in dept_name and ("python" in comp_name_lower or "sql" in comp_name_lower or "ai" in comp_name_lower or "cloud" in comp_name_lower):
                role_dept_weight = 1.6
            elif "survey" in dept_name and ("sampling" in comp_name_lower or "survey" in comp_name_lower or "gis" in comp_name_lower):
                role_dept_weight = 1.6
            elif "accounts" in dept_name and ("national" in comp_name_lower or "price" in comp_name_lower or "r" in comp_name_lower):
                role_dept_weight = 1.5

            # Future demand weight (from Competency model: 0.1 to 1.0)
            future_demand = comp.future_demand_weight or 0.5

            # Career goal alignment boost
            career_boost = 0.0
            if any(term in comp_name_lower for term in ["python", "data science", "ai", "machine learning", "cloud", "analytics"]) and ("data science" in career_goal_text or "analytics" in career_goal_text):
                career_boost = 25.0
            elif any(term in comp_name_lower for term in ["leadership", "project", "management"]) and ("management" in career_goal_text or "head" in career_goal_text):
                career_boost = 20.0

            # Combined Priority Score formula
            raw_priority = (gap_score * 0.5) + (role_dept_weight * 15.0) + (future_demand * 20.0) + career_boost
            priority_score = min(100.0, max(0.0, raw_priority))

            # Classification
            if priority_score >= 70 or gap_score >= 30:
                priority_label = "CRITICAL"
            elif priority_score >= 50 or gap_score >= 20:
                priority_label = "HIGH"
            elif priority_score >= 30 or gap_score >= 10:
                priority_label = "MEDIUM"
            else:
                priority_label = "LOW"

            # Explainable Priority Reason
            reason = f"Your current score in {comp.name} is {current:.0f}% against the required benchmark of {required:.0f}% (Gap: {gap_score:.0f}%). "
            if priority_label in ["CRITICAL", "HIGH"]:
                reason += f"Because your assignment in {user.department.name if user.department else 'MoSPI'} relies heavily on this domain and your career goal mentions '{user.career_goal}', this skill is assigned {priority_label} priority."
            else:
                reason += f"Assigned {priority_label} priority to support standard operational competency."

            gap_entry = SkillGap(
                user_id=user.id,
                skill_name=comp.name,
                category=comp.category,
                current_score=current,
                required_score=required,
                gap_score=gap_score,
                priority=priority_label,
                priority_score=priority_score,
                priority_reason=reason
            )
            db.add(gap_entry)
            created_gaps.append(gap_entry)

        db.commit()
        # Return sorted by priority_score descending
        created_gaps.sort(key=lambda x: x.priority_score, reverse=True)
        return created_gaps
