from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class IGOTServiceInterface(ABC):
    """
    Abstract Integration Adapter Interface for iGOT Karmayogi Platform.
    In a production government environment, this implementation will be replaced
    by RealIGOTService interacting directly with authentic iGOT Karmayogi OAuth2 & REST APIs.
    """
    @abstractmethod
    def get_courses(self) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_course_by_id(self, course_id: int) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    def get_user_enrollments(self, user_id: int) -> List[Dict[str, Any]]:
        pass

class MockIGOTService(IGOTServiceInterface):
    """
    Prototype implementation providing 15+ curated courses aligned with India's Official Statistical System.
    """
    def __init__(self):
        self.courses = [
            {
                "id": 1,
                "title": "Python for Data Analysis in Official Statistics",
                "description": "Master Python, Pandas, and NumPy for processing national survey data, building statistical pipelines, and automating data cleaning for MoSPI reports.",
                "provider": "iGOT Karmayogi",
                "provider_type": "igot",
                "category": "Technical",
                "duration": "12 Hours",
                "difficulty": "Intermediate",
                "rating": 4.9,
                "completion_rate": 92.0,
                "mock_url": "https://igotkarmayogi.gov.in/course/python-official-stats",
                "skills_covered": ["Python", "Data Visualization", "Open Data", "AI/ML"]
            },
            {
                "id": 2,
                "title": "Cloud Computing & MeghRaj Infrastructure for Public Officials",
                "description": "Learn government cloud architecture, secure data hosting, automated ETL pipelines, and sovereign cloud security compliance.",
                "provider": "iGOT Karmayogi",
                "provider_type": "igot",
                "category": "Technical",
                "duration": "10 Hours",
                "difficulty": "Intermediate",
                "rating": 4.8,
                "completion_rate": 88.0,
                "mock_url": "https://igotkarmayogi.gov.in/course/cloud-computing-gov",
                "skills_covered": ["Cloud Computing", "Government Cloud", "APIs", "Cybersecurity"]
            },
            {
                "id": 3,
                "title": "Data Privacy & Protection (DPDP Act 2023 Compliance)",
                "description": "Comprehensive guide to data fiduciary responsibilities, anonymization techniques, microdata masking, and legal compliance in official statistics.",
                "provider": "iGOT Karmayogi",
                "provider_type": "igot",
                "category": "Digital Governance",
                "duration": "8 Hours",
                "difficulty": "Advanced",
                "rating": 4.9,
                "completion_rate": 95.0,
                "mock_url": "https://igotkarmayogi.gov.in/course/data-privacy-dpdp",
                "skills_covered": ["Data Privacy", "Cybersecurity", "Digital Public Infrastructure"]
            },
            {
                "id": 4,
                "title": "Advanced Survey Sampling & Estimation Methods",
                "description": "In-depth training on stratified multi-stage sampling, non-response weighting, variance estimation, and small area estimation for National Sample Surveys.",
                "provider": "NSSTA (National Statistical Systems Training Academy)",
                "provider_type": "nssta",
                "category": "Statistical",
                "duration": "5 Days (Residential / Online)",
                "difficulty": "Advanced",
                "rating": 4.95,
                "completion_rate": 96.0,
                "mock_url": "https://nssta.gov.in/tpac/sampling-methods",
                "skills_covered": ["Survey Design", "Sampling", "Data Quality Frameworks"]
            },
            {
                "id": 5,
                "title": "SQL for Government Microdata Databases",
                "description": "Write optimized relational queries, analytical window functions, and database views for large-scale census and economic survey datasets.",
                "provider": "iGOT Karmayogi",
                "provider_type": "igot",
                "category": "Technical",
                "duration": "14 Hours",
                "difficulty": "Intermediate",
                "rating": 4.7,
                "completion_rate": 89.0,
                "mock_url": "https://igotkarmayogi.gov.in/course/sql-microdata",
                "skills_covered": ["SQL", "APIs", "Open Data"]
            },
            {
                "id": 6,
                "title": "AI/ML Applications in Public Policy & Statistical Forecasting",
                "description": "Explore practical machine learning models for anomaly detection in survey records, economic forecasting, and automated image processing in agricultural statistics.",
                "provider": "iGOT Karmayogi",
                "provider_type": "igot",
                "category": "Technical",
                "duration": "16 Hours",
                "difficulty": "Advanced",
                "rating": 4.85,
                "completion_rate": 85.0,
                "mock_url": "https://igotkarmayogi.gov.in/course/aiml-public-policy",
                "skills_covered": ["AI/ML", "Python", "Data Visualization"]
            },
            {
                "id": 7,
                "title": "Fundamentals of GIS & Spatial Analytics in Censuses",
                "description": "Geospatial data integration, digitizing administrative boundaries, satellite imagery integration, and thematic mapping for census operations.",
                "provider": "NSSTA (National Statistical Systems Training Academy)",
                "provider_type": "nssta",
                "category": "Technical",
                "duration": "4 Days",
                "difficulty": "Intermediate",
                "rating": 4.8,
                "completion_rate": 91.0,
                "mock_url": "https://nssta.gov.in/tpac/gis-spatial-analytics",
                "skills_covered": ["GIS", "Data Visualization", "Agricultural Statistics"]
            },
            {
                "id": 8,
                "title": "National Accounts Statistics Framework & Compilation",
                "description": "Methodology of Gross Value Added (GVA), Gross Domestic Product (GDP) estimation, supply-use tables, and international System of National Accounts (SNA) standards.",
                "provider": "NSSTA (National Statistical Systems Training Academy)",
                "provider_type": "nssta",
                "category": "Statistical",
                "duration": "5 Days",
                "difficulty": "Advanced",
                "rating": 4.9,
                "completion_rate": 94.0,
                "mock_url": "https://nssta.gov.in/tpac/national-accounts-framework",
                "skills_covered": ["National Accounts", "Economic Statistics", "Metadata Standards"]
            },
            {
                "id": 9,
                "title": "Cybersecurity Awareness for Digital Governance",
                "description": "Best practices for protecting statistical networks, managing digital signatures, phishing defense, and securing REST APIs against data leaks.",
                "provider": "iGOT Karmayogi",
                "provider_type": "igot",
                "category": "Digital Governance",
                "duration": "6 Hours",
                "difficulty": "Beginner",
                "rating": 4.75,
                "completion_rate": 97.0,
                "mock_url": "https://igotkarmayogi.gov.in/course/cybersecurity-governance",
                "skills_covered": ["Cybersecurity", "Digital Signatures", "Government Cloud"]
            },
            {
                "id": 10,
                "title": "SDG Indicators & Monitoring Frameworks",
                "description": "Tracking National Indicator Framework (NIF) metrics for UN Sustainable Development Goals, metadata harmonization, and reporting portals.",
                "provider": "iGOT Karmayogi",
                "provider_type": "igot",
                "category": "Statistical",
                "duration": "8 Hours",
                "difficulty": "Intermediate",
                "rating": 4.8,
                "completion_rate": 90.0,
                "mock_url": "https://igotkarmayogi.gov.in/course/sdg-indicators-nif",
                "skills_covered": ["SDG Indicators", "Metadata Standards", "Data Quality Frameworks"]
            },
            {
                "id": 11,
                "title": "Data Visualization with R & ggplot2",
                "description": "Create publication-grade statistical charts, interactive dashboards, and automated report generation using R and R Markdown.",
                "provider": "iGOT Karmayogi",
                "provider_type": "igot",
                "category": "Technical",
                "duration": "10 Hours",
                "difficulty": "Intermediate",
                "rating": 4.82,
                "completion_rate": 87.0,
                "mock_url": "https://igotkarmayogi.gov.in/course/r-visualization",
                "skills_covered": ["R", "Data Visualization", "Open Data"]
            },
            {
                "id": 12,
                "title": "Price Statistics & Index Number Compilation (WPI & CPI)",
                "description": "Item basket selection, weighting structures, Laspeyres vs Paasche index formulas, and retail/wholesale price collection workflows.",
                "provider": "NSSTA (National Statistical Systems Training Academy)",
                "provider_type": "nssta",
                "category": "Statistical",
                "duration": "3 Days",
                "difficulty": "Intermediate",
                "rating": 4.88,
                "completion_rate": 93.0,
                "mock_url": "https://nssta.gov.in/tpac/price-statistics",
                "skills_covered": ["Price Statistics", "Survey Design", "Data Quality Frameworks"]
            },
            {
                "id": 13,
                "title": "Digital Public Infrastructure & Open Government Data APIs",
                "description": "API design standards for data.gov.in, data exchange protocols across ministries, and India Stack integration for seamless statistical reporting.",
                "provider": "iGOT Karmayogi",
                "provider_type": "igot",
                "category": "Digital Governance",
                "duration": "8 Hours",
                "difficulty": "Intermediate",
                "rating": 4.78,
                "completion_rate": 91.0,
                "mock_url": "https://igotkarmayogi.gov.in/course/dpi-open-data",
                "skills_covered": ["Digital Public Infrastructure", "APIs", "Open Data"]
            },
            {
                "id": 14,
                "title": "Leadership & Change Management in Statistical Organizations",
                "description": "Strategic decision making, team management, ethics in public data dissemination, and leading digital transformation initiatives.",
                "provider": "iGOT Karmayogi",
                "provider_type": "igot",
                "category": "Behavioural & Managerial",
                "duration": "12 Hours",
                "difficulty": "Advanced",
                "rating": 4.91,
                "completion_rate": 94.0,
                "mock_url": "https://igotkarmayogi.gov.in/course/leadership-stats",
                "skills_covered": ["Leadership", "Change Management", "Ethics", "Communication"]
            },
            {
                "id": 15,
                "title": "Project Management & Ethics for Official Data Collection",
                "description": "Field operation management, quality audit protocols, budget control, and ethical standards in census and large-scale sample surveys.",
                "provider": "iGOT Karmayogi",
                "provider_type": "igot",
                "category": "Behavioural & Managerial",
                "duration": "10 Hours",
                "difficulty": "Intermediate",
                "rating": 4.85,
                "completion_rate": 95.0,
                "mock_url": "https://igotkarmayogi.gov.in/course/project-mgmt-stats",
                "skills_covered": ["Project Management", "Ethics", "Decision Making"]
            }
        ]

    def get_courses(self) -> List[Dict[str, Any]]:
        return self.courses

    def get_course_by_id(self, course_id: int) -> Optional[Dict[str, Any]]:
        for c in self.courses:
            if c["id"] == course_id:
                return c
        return None

    def get_user_enrollments(self, user_id: int) -> List[Dict[str, Any]]:
        return []
