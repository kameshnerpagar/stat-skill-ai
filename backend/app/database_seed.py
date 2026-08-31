from sqlalchemy.orm import Session
from app.database import Base, engine, SessionLocal
from app.models import User, Department, Competency, UserCompetency, Course, Enrollment, SkillGap, QuizAttempt
from app.services.igot_service import MockIGOTService
from app.services.competency_service import CompetencyService

def seed_db():
    print("[Database Seed] Initializing SQLite tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(User).filter(User.email == "official@statskill.gov.in").first():
            print("[Database Seed] Database already seeded. Skipping.")
            return

        print("[Database Seed] Seeding departments...")
        depts = [
            Department(name="Data Analytics Division", description="Advanced data analytics, machine learning, and reporting pipelines for national surveys.", official_count=390),
            Department(name="National Accounts Division", description="Gross Value Added, GDP estimation, and macroeconomic indicators.", official_count=420),
            Department(name="Economic Statistics Division", description="Industrial statistics, Index of Industrial Production (IIP), and economic censuses.", official_count=510),
            Department(name="Social Statistics Division", description="SDG monitoring, social indicators, gender statistics, and environment stats.", official_count=480),
            Department(name="Survey Operations Division", description="Field data collection, sampling frame design, and NSS survey administration.", official_count=520),
            Department(name="IT & Digital Services", description="Cloud infrastructure, data portal APIs, security, and digital public infrastructure.", official_count=166)
        ]
        db.add_all(depts)
        db.commit()

        data_analytics_dept = db.query(Department).filter(Department.name == "Data Analytics Division").first()
        it_dept = db.query(Department).filter(Department.name == "IT & Digital Services").first()

        print("[Database Seed] Seeding demo users...")
        official_user = User(
            email="official@statskill.gov.in",
            full_name="Ananya Sharma",
            role="official",
            designation="Statistical Officer",
            department_id=data_analytics_dept.id,
            experience_years=4.0,
            education="M.Sc. Statistics",
            current_assignment="National Survey Data Processing & Automated Analytics Pipeline",
            career_goal="Move into Data Science and Advanced Statistical Analytics",
            overall_competency_score=66.0
        )

        admin_user = User(
            email="admin@statskill.gov.in",
            full_name="Dr. Rajesh Verma",
            role="admin",
            designation="Director General (Capacity Building)",
            department_id=it_dept.id,
            experience_years=18.0,
            education="Ph.D. Econometrics",
            current_assignment="National Workforce Skill Intelligence & iGOT Integration",
            career_goal="Transform MoSPI into an AI-enabled Statistical System",
            overall_competency_score=88.5
        )

        nat_accts = db.query(Department).filter(Department.name == "National Accounts Division").first()
        econ_dept = db.query(Department).filter(Department.name == "Economic Statistics Division").first()
        soc_dept = db.query(Department).filter(Department.name == "Social Statistics Division").first()
        surv_dept = db.query(Department).filter(Department.name == "Survey Operations Division").first()

        officer_2 = User(
            email="vikram.malhotra@statskill.gov.in",
            full_name="Vikram Malhotra",
            role="official",
            designation="Senior Statistical Officer",
            department_id=nat_accts.id if nat_accts else data_analytics_dept.id,
            experience_years=7.5,
            education="M.A. Economics",
            current_assignment="Gross Value Added (GVA) & GDP Compilation Pipeline",
            career_goal="Lead Economic Modeling and National Accounts",
            overall_competency_score=74.2
        )

        officer_3 = User(
            email="priya.patel@statskill.gov.in",
            full_name="Priya Patel",
            role="official",
            designation="Assistant Director",
            department_id=econ_dept.id if econ_dept else data_analytics_dept.id,
            experience_years=6.0,
            education="M.Stat. Indian Statistical Institute",
            current_assignment="Index of Industrial Production (IIP) Retail Basket Automation",
            career_goal="Build High-Frequency Price Index Dashboards",
            overall_competency_score=71.8
        )

        officer_4 = User(
            email="suresh.kumar@statskill.gov.in",
            full_name="Suresh Kumar",
            role="official",
            designation="Field Survey Officer",
            department_id=surv_dept.id if surv_dept else data_analytics_dept.id,
            experience_years=9.0,
            education="B.Sc. Mathematics & Statistics",
            current_assignment="NSS Household Survey Field Audit & CAPI Data Collection",
            career_goal="Master Digital Field Collection & Mobile GIS",
            overall_competency_score=63.4,
            intervention_flagged=1,
            intervention_notes="Requires immediate upskilling in Python & Cloud Data Security"
        )

        officer_5 = User(
            email="meera.reddy@statskill.gov.in",
            full_name="Meera Reddy",
            role="official",
            designation="Deputy Director (SDG Cell)",
            department_id=soc_dept.id if soc_dept else data_analytics_dept.id,
            experience_years=11.0,
            education="Ph.D. Applied Statistics",
            current_assignment="National Indicator Framework (NIF) UN SDG Monitoring",
            career_goal="Head Social & Gender Statistical Dissemination",
            overall_competency_score=78.5
        )

        db.add_all([official_user, admin_user, officer_2, officer_3, officer_4, officer_5])
        db.commit()

        print("[Database Seed] Seeding competencies across 4 domains...")
        competencies_data = [
            # Category A: STATISTICAL COMPETENCIES
            ("Survey Design", "Statistical", "Designing questionnaires, sampling frames, and survey specifications.", 0.8),
            ("Sampling Methods", "Statistical", "Stratified sampling, cluster sampling, and probability estimation.", 0.85),
            ("National Accounts", "Statistical", "System of National Accounts (SNA), GVA compilation, and GDP calculation.", 0.7),
            ("Price Statistics", "Statistical", "WPI, CPI basket weighting, and price index compilation.", 0.75),
            ("Labour Statistics", "Statistical", "Employment survey indicators, periodic labour force surveys (PLFS).", 0.7),
            ("Agricultural Statistics", "Statistical", "Crop yield estimation, land use stats, and remote sensing stats.", 0.65),
            ("Industrial Statistics", "Statistical", "Index of Industrial Production (IIP) and Annual Survey of Industries (ASI).", 0.75),
            ("SDG Indicators", "Statistical", "National Indicator Framework (NIF) tracking for UN SDGs.", 0.8),
            ("Metadata Standards", "Statistical", "SDMX standards, data dictionaries, and catalog metadata.", 0.85),
            ("Data Quality Frameworks", "Statistical", "Data validation, non-sampling error detection, and quality assurance.", 0.9),

            # Category B: TECHNICAL COMPETENCIES
            ("Python", "Technical", "Data analysis with Pandas, NumPy, and statistical script automation.", 0.95),
            ("R", "Technical", "R programming, econometrics modeling, and ggplot2 visual reporting.", 0.8),
            ("SQL", "Technical", "Relational database queries, data aggregation, and database views.", 0.85),
            ("Stata", "Technical", "Microdata econometrics and panel data statistical packages.", 0.6),
            ("SPSS", "Technical", "Social science statistical survey processing.", 0.5),
            ("SAS", "Technical", "Enterprise statistical analysis and macros.", 0.5),
            ("GIS", "Technical", "Geographic Information Systems, spatial boundaries, and thematic mapping.", 0.85),
            ("Data Visualization", "Technical", "Designing interactive dashboards, charts, and public reports.", 0.9),
            ("AI/ML", "Technical", "Machine learning classification, predictive modeling, and NLP text extraction.", 0.98),
            ("Cloud Computing", "Technical", "MeghRaj government cloud infrastructure, data lakes, and web servers.", 0.95),
            ("APIs", "Technical", "RESTful API integration, Open Data endpoints, and JSON microservices.", 0.9),
            ("Open Data", "Technical", "Dissemination of open government data portals and FAIR data principles.", 0.8),

            # Category C: DIGITAL GOVERNANCE
            ("Cybersecurity", "Technical", "Network security, access controls, and data breach prevention.", 0.85),
            ("Data Privacy", "Digital Governance", "DPDP Act 2023 compliance, anonymization, and microdata protection.", 0.95),
            ("Digital Signatures", "Digital Governance", "e-Sign implementation and PKI authentication in government workflows.", 0.7),
            ("Government Cloud", "Digital Governance", "MeghRaj cloud security policies and sovereign infrastructure.", 0.85),
            ("Digital Public Infrastructure", "Digital Governance", "India Stack integration, Aadhaar e-KYC, and data exchanges.", 0.9),

            # Category D: BEHAVIOURAL & MANAGERIAL
            ("Leadership", "Behavioural & Managerial", "Leading statistical teams, mentoring junior officers, and vision setting.", 0.75),
            ("Communication", "Behavioural & Managerial", "Presenting data insights to policy makers and clear report writing.", 0.85),
            ("Project Management", "Behavioural & Managerial", "Managing census timelines, survey budgets, and operational tasks.", 0.8),
            ("Ethics", "Behavioural & Managerial", "Ethical standards in data collection, integrity, and objectivity.", 0.9),
            ("Decision Making", "Behavioural & Managerial", "Evidence-based decision making and policy synthesis.", 0.85),
            ("Change Management", "Behavioural & Managerial", "Driving digital transformation and upskilling in statistics offices.", 0.8)
        ]

        comp_models = []
        for name, cat, desc, weight in competencies_data:
            comp = Competency(name=name, category=cat, description=desc, future_demand_weight=weight)
            db.add(comp)
            comp_models.append(comp)

        db.commit()

        print("[Database Seed] Setting initial user competency scores...")
        score_mapping = {
            "Survey Design": 85.0, "Sampling Methods": 82.0, "National Accounts": 80.0, "Price Statistics": 78.0,
            "Python": 52.0, "R": 60.0, "SQL": 65.0, "GIS": 55.0, "Data Visualization": 72.0, "AI/ML": 45.0,
            "Cloud Computing": 41.0, "Data Privacy": 48.0, "Leadership": 70.0, "Ethics": 78.0
        }

        all_comps = db.query(Competency).all()
        for u in [official_user, officer_2, officer_3, officer_4, officer_5]:
            for comp in all_comps:
                cur_score = score_mapping.get(comp.name, 60.0) + (u.id % 4) * 3
                req_score = 80.0
                level = "Advanced" if cur_score >= 80 else ("Beginner" if cur_score < 50 else "Intermediate")
                uc = UserCompetency(
                    user_id=u.id,
                    competency_id=comp.id,
                    current_score=min(95.0, cur_score),
                    required_score=req_score,
                    level=level
                )
                db.add(uc)

        db.commit()

        print("[Database Seed] Seeding iGOT and NSSTA courses into database...")
        igot_service = MockIGOTService()
        raw_courses = igot_service.get_courses()
        for c in raw_courses:
            course = Course(
                id=c["id"],
                title=c["title"],
                description=c["description"],
                provider=c["provider"],
                provider_type=c["provider_type"],
                category=c["category"],
                duration=c["duration"],
                difficulty=c["difficulty"],
                rating=c["rating"],
                completion_rate=c["completion_rate"],
                mock_url=c["mock_url"],
                skills_covered=c["skills_covered"]
            )
            db.add(course)

        db.commit()

        print("[Database Seed] Seeding initial enrollments & quiz attempts...")
        enrollment1 = Enrollment(user_id=official_user.id, course_id=1, status="In Progress", progress_pct=45.0)
        enrollment2 = Enrollment(user_id=official_user.id, course_id=4, status="Completed", progress_pct=100.0)
        db.add(enrollment1)
        db.add(enrollment2)

        # Sample Quiz Attempt with Integrity Score
        attempt1 = QuizAttempt(
            user_id=official_user.id,
            assessment_title="Sampling Methods Competency Quiz",
            score=9,
            max_score=10,
            percentage=90.0,
            topic_breakdown={"Survey Sampling Methods": 100.0, "Data Quality": 80.0},
            ai_feedback="Outstanding performance! High mastery in stratified sampling.",
            tab_switches=0,
            integrity_score=100.0,
            integrity_flags=[]
        )
        attempt2 = QuizAttempt(
            user_id=officer_4.id,
            assessment_title="Cloud & Data Security Assessment",
            score=5,
            max_score=10,
            percentage=50.0,
            topic_breakdown={"Cloud Computing": 40.0, "Data Privacy": 60.0},
            ai_feedback="Review MeghRaj security protocols and DPDP Act 2023.",
            tab_switches=2,
            integrity_score=50.0,
            integrity_flags=["2 Tab/Window Switch Violation(s) Detected"]
        )
        db.add(attempt1)
        db.add(attempt2)
        db.commit()

        # Seed initial admin audit log
        from app.models import AdminAuditLog
        audit = AdminAuditLog(
            admin_id=admin_user.id,
            admin_name=admin_user.full_name,
            action="FLAG_INTERVENTION",
            target_user_id=officer_4.id,
            target_user_name=officer_4.full_name,
            details="Notes: Requires immediate upskilling in Python & Cloud Data Security"
        )
        db.add(audit)
        db.commit()

        print("[Database Seed] Calculating initial skill gaps for officers...")
        for u in [official_user, officer_2, officer_3, officer_4, officer_5]:
            CompetencyService.calculate_skill_gaps(db, u)

        print("[Database Seed] Database seeding completed successfully!")

    except Exception as e:
        print(f"[Database Seed] Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()

