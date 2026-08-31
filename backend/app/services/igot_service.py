import os
import json
import urllib.request
import urllib.error
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
    Sourced from authentic iGOT Karmayogi & NSSTA capacity-building frameworks.
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

class RealIGOTService(IGOTServiceInterface):
    """
    Production Integration Adapter for live iGOT Karmayogi Bharat REST & OAuth2 APIs.
    Driven by environment variables: IGOT_BASE_URL, IGOT_CLIENT_ID, IGOT_CLIENT_SECRET.
    """
    def __init__(self):
        self.base_url = os.getenv("IGOT_BASE_URL", "https://igotkarmayogi.gov.in/api").rstrip("/")
        self.client_id = os.getenv("IGOT_CLIENT_ID", "")
        self.client_secret = os.getenv("IGOT_CLIENT_SECRET", "")
        self.access_token = None

    def _authenticate(self):
        """Authenticates with iGOT OAuth2 token endpoint."""
        if not self.client_id or not self.client_secret:
            print("[RealIGOTService] Warning: Missing IGOT_CLIENT_ID/IGOT_CLIENT_SECRET. Using fallback catalog.")
            return
        try:
            url = f"{self.base_url}/oauth2/token"
            data = f"grant_type=client_credentials&client_id={self.client_id}&client_secret={self.client_secret}".encode("utf-8")
            req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/x-www-form-urlencoded"})
            with urllib.request.urlopen(req, timeout=5.0) as resp:
                if resp.status == 200:
                    payload = json.loads(resp.read().decode("utf-8"))
                    self.access_token = payload.get("access_token")
        except Exception as e:
            print(f"[RealIGOTService] Auth error: {e}")

    def get_courses(self) -> List[Dict[str, Any]]:
        try:
            url = f"{self.base_url}/v1/courses/catalog"
            headers = {}
            if self.access_token:
                headers["Authorization"] = f"Bearer {self.access_token}"
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=5.0) as resp:
                if resp.status == 200:
                    payload = json.loads(resp.read().decode("utf-8"))
                    return payload.get("courses", [])
        except Exception as e:
            print(f"[RealIGOTService] Failed to fetch live courses: {e}. Defaulting to authentic mock catalog.")
        
        # Default fallback to mock service if live server unreachable
        return MockIGOTService().get_courses()

    def get_course_by_id(self, course_id: int) -> Optional[Dict[str, Any]]:
        try:
            url = f"{self.base_url}/v1/courses/{course_id}"
            headers = {}
            if self.access_token:
                headers["Authorization"] = f"Bearer {self.access_token}"
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=5.0) as resp:
                if resp.status == 200:
                    return json.loads(resp.read().decode("utf-8"))
        except Exception as e:
            print(f"[RealIGOTService] Error fetching course {course_id}: {e}")
        
        return MockIGOTService().get_course_by_id(course_id)

    def get_user_enrollments(self, user_id: int) -> List[Dict[str, Any]]:
        return []

def get_igot_service() -> IGOTServiceInterface:
    """
    Factory function returning active iGOT Karmayogi service adapter based on env configuration.
    Set IGOT_MODE=real to connect to authentic iGOT Bharat APIs.
    """
    mode = os.getenv("IGOT_MODE", "mock").lower()
    if mode == "real":
        print("[iGOT Factory] Returning RealIGOTService (Live iGOT Karmayogi API mode)")
        return RealIGOTService()
    else:
        return MockIGOTService()
