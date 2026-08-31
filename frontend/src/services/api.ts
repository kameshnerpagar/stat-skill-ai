import axios from 'axios';
import {
  User,
  UserCompetencyResponse,
  SkillGap,
  Recommendation,
  Course,
  MCQGenResponse,
  QuizResult,
  AdminAnalytics,
  ProgressData,
  Question
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: async (email: string): Promise<User> => {
    const res = await api.post('/auth/login', { email });
    return res.data;
  },
  getCurrentUser: async (email = 'official@statskill.gov.in'): Promise<User> => {
    const res = await api.get(`/users/me?email=${encodeURIComponent(email)}`);
    return res.data;
  },
  updateProfile: async (data: Partial<User>, email = 'official@statskill.gov.in'): Promise<User> => {
    const res = await api.put(`/users/me?email=${encodeURIComponent(email)}`, data);
    return res.data;
  }
};

export const competencyService = {
  getUserCompetencies: async (userId: number): Promise<UserCompetencyResponse> => {
    const res = await api.get(`/users/${userId}/competencies`);
    return res.data;
  },
  getSkillGaps: async (email = 'official@statskill.gov.in'): Promise<SkillGap[]> => {
    const res = await api.get(`/skill-gaps?email=${encodeURIComponent(email)}`);
    return res.data;
  }
};

export const courseService = {
  getRecommendations: async (email = 'official@statskill.gov.in'): Promise<Recommendation[]> => {
    const res = await api.get(`/recommendations?email=${encodeURIComponent(email)}`);
    return res.data;
  },
  getCourses: async (params?: { category?: string; difficulty?: string; provider?: string; search?: string }): Promise<Course[]> => {
    const res = await api.get('/courses', { params });
    return res.data;
  },
  getCourseDetail: async (courseId: number): Promise<any> => {
    const res = await api.get(`/courses/${courseId}`);
    return res.data;
  },
  enrollCourse: async (courseId: number, email = 'official@statskill.gov.in'): Promise<any> => {
    const res = await api.post(`/courses/${courseId}/enroll?email=${encodeURIComponent(email)}`);
    return res.data;
  }
};

export const assessmentService = {
  uploadMaterial: async (file: File, email = 'official@statskill.gov.in'): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email);
    const res = await axios.post(`${API_BASE_URL}/materials/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  generateMCQs: async (textContent: string, numQuestions = 10, difficulty = 'Medium', materialId?: number): Promise<MCQGenResponse> => {
    const res = await api.post('/assessments/generate', {
      text_content: textContent,
      num_questions: numQuestions,
      difficulty: difficulty,
      material_id: materialId
    });
    return res.data;
  },
  submitQuiz: async (
    assessmentTitle: string,
    questions: Question[],
    userAnswers: Record<string, string>,
    email = 'official@statskill.gov.in',
    tabSwitches = 0,
    perQuestionTimes?: Record<string, number>
  ): Promise<QuizResult> => {
    const res = await api.post(`/quiz/submit?email=${encodeURIComponent(email)}`, {
      assessment_title: assessmentTitle,
      questions,
      user_answers: userAnswers,
      tab_switches: tabSwitches,
      per_question_times: perQuestionTimes
    });
    return res.data;
  }
};

export const aiService = {
  chat: async (message: string, email = 'official@statskill.gov.in'): Promise<{ reply: string; suggested_prompts?: string[] }> => {
    const res = await api.post(`/ai/chat?email=${encodeURIComponent(email)}`, { message });
    return res.data;
  }
};

export const analyticsService = {
  getAdminAnalytics: async (): Promise<AdminAnalytics> => {
    const res = await api.get('/admin/analytics');
    return res.data;
  },
  getProgress: async (email = 'official@statskill.gov.in'): Promise<ProgressData> => {
    const res = await api.get(`/progress?email=${encodeURIComponent(email)}`);
    return res.data;
  }
};

export const adminService = {
  getAllOfficers: async (): Promise<any[]> => {
    const res = await api.get('/admin/officers');
    return res.data;
  },
  getOfficerDetail: async (userId: number): Promise<any> => {
    const res = await api.get(`/admin/officers/${userId}`);
    return res.data;
  },
  updateOfficerIntervention: async (userId: number, interventionFlagged: boolean, notes?: string): Promise<any> => {
    const res = await api.post(`/admin/officers/${userId}/intervention`, {
      intervention_flagged: interventionFlagged,
      intervention_notes: notes
    });
    return res.data;
  },
  getAuditLogs: async (): Promise<any[]> => {
    const res = await api.get('/admin/audit-log');
    return res.data;
  }
};

