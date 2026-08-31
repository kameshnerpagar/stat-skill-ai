export type UserRole = 'official' | 'admin';

export interface Department {
  id: number;
  name: string;
  description?: string;
  official_count: number;
}

export interface UserProfileUpdate {
  full_name?: string;
  designation?: string;
  experience_years?: number;
  education?: string;
  current_assignment?: string;
  career_goal?: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  designation: string;
  department_id?: number;
  department?: Department;
  experience_years: number;
  education: string;
  current_assignment: string;
  career_goal: string;
  overall_competency_score: number;
}

export interface Competency {
  id: number;
  name: string;
  category: 'Statistical' | 'Technical' | 'Digital Governance' | 'Behavioural & Managerial';
  description?: string;
  future_demand_weight: number;
}

export interface UserCompetency {
  id: number;
  competency: Competency;
  current_score: number;
  required_score: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  last_updated: string;
}

export interface DomainSummary {
  category: string;
  score: number;
  competencies_count: number;
}

export interface UserCompetencyResponse {
  overall_score: number;
  domain_summaries: DomainSummary[];
  competencies: Array<{
    id: number;
    competency_id: number;
    name: string;
    category: string;
    description?: string;
    current_score: number;
    required_score: number;
    gap: number;
    level: string;
    last_updated: string;
  }>;
  ai_insight: string;
}

export interface SkillGap {
  id: number;
  skill_name: string;
  category: string;
  current_score: number;
  required_score: number;
  gap_score: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  priority_score: number;
  priority_reason: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  provider: string;
  provider_type: 'igot' | 'nssta';
  category: string;
  duration: string;
  difficulty: string;
  rating: number;
  completion_rate: number;
  mock_url: string;
  skills_covered: string[];
}

export interface Recommendation {
  course: Course;
  match_score: number;
  ai_reason: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface Question {
  id?: number;
  text: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  topic: string;
  difficulty: string;
}

export interface MCQGenResponse {
  questions: Question[];
  topic_summary: string;
  detected_topics: string[];
}

export interface QuizResult {
  score: number;
  max_score: number;
  percentage: number;
  topic_breakdown: Record<string, number>;
  ai_feedback: string;
  updated_overall_competency: number;
}

export interface AdminAnalytics {
  total_officials: number;
  average_competency: number;
  critical_skill_gaps_count: number;
  courses_completed: number;
  total_training_hours: number;
  department_competencies: Array<{ department: string; competency: number; headcount: number }>;
  top_skill_gaps: Array<{ skill: string; gap_percentage: number; affected_officials: number; priority: string }>;
  competency_distribution: Array<{ range: string; count: number; label: string }>;
  emerging_skills: Array<{ skill: string; current_coverage: number; future_demand: number; gap: number; priority: string }>;
  heatmap_matrix: Record<string, Record<string, number>>;
}

export interface ProgressData {
  learning_hours: number;
  courses_completed: number;
  courses_in_progress: number;
  assessments_taken: number;
  competency_improvement_pct: number;
  competency_trend: Array<{ date: string; score: number; event: string }>;
  before_after: Array<{ domain: string; before: number; after: number }>;
  timeline: Array<{ type: string; title: string; date: string; detail: string }>;
}
