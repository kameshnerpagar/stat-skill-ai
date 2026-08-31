export type Language = 'en' | 'hi';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    gov_heading: "GOVERNMENT OF INDIA",
    mospi_title: "Ministry of Statistics and Programme Implementation (MoSPI)",
    platform_name: "STAT-SKILL AI",
    sub_title: "Competency Intelligence & Personalized Learning Platform",
    official_view: "Official View",
    admin_view: "Authority View",
    dashboard: "Dashboard",
    competencies: "My Competencies",
    skill_gap: "Skill Gap Analysis",
    learning_path: "Learning Path",
    igot_courses: "iGOT Courses",
    mcq_generator: "AI MCQ Generator",
    statbot: "AI Assistant (StatBot)",
    progress: "Progress & Analytics",
    officers_directory: "Officers Directory",
    audit_log: "Admin Audit Log",
    login_title: "Welcome to STAT-SKILL AI",
    sign_in: "Sign In to MoSPI Portal",
    start_quiz: "Start Competency Quiz",
    logout: "Sign Out"
  },
  hi: {
    gov_heading: "भारत सरकार",
    mospi_title: "सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)",
    platform_name: "स्टैट-स्किल एआई",
    sub_title: "दक्षता बुद्धिमत्ता और व्यक्तिगत शिक्षण मंच",
    official_view: "अधिकारी दृश्य",
    admin_view: "प्राधिकरण दृश्य",
    dashboard: "डैशबोर्ड",
    competencies: "मेरी दक्षताएँ",
    skill_gap: "कौशल अंतर विश्लेषण",
    learning_path: "शिक्षण मार्ग",
    igot_courses: "iGOT पाठ्यक्रम",
    mcq_generator: "एआई प्रश्न जनरेटर",
    statbot: "एआई सहायक (स्टैटबॉट)",
    progress: "प्रगति और विश्लेषण",
    officers_directory: "अधिकारी निर्देशिका",
    audit_log: "प्रशासन ऑडिट लॉग",
    login_title: "स्टैट-स्किल एआई में आपका स्वागत है",
    sign_in: "MoSPI पोर्टल में साइन इन करें",
    start_quiz: "दक्षता प्रश्नोत्तरी शुरू करें",
    logout: "साइन आउट"
  }
};
