import React, { useState, useEffect } from 'react';
import { User, UserRole, Course, Question } from './types';
import { authService } from './services/api';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { LearnerDashboard } from './pages/LearnerDashboard';
import { CompetencyProfilePage } from './pages/CompetencyProfilePage';
import { CompetencyAssessmentPage } from './pages/CompetencyAssessmentPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { LearningPathPage } from './pages/LearningPathPage';
import { CourseRepositoryPage } from './pages/CourseRepositoryPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { McqGeneratorPage } from './pages/McqGeneratorPage';
import { QuizTakingPage } from './pages/QuizTakingPage';
import { StatBotPage } from './pages/StatBotPage';
import { ProgressPage } from './pages/ProgressPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminOfficersPage } from './pages/AdminOfficersPage';
import { AdminOfficerDetailPage } from './pages/AdminOfficerDetailPage';
import { CompetencyHeatmapPage } from './pages/CompetencyHeatmapPage';
import { EmergingSkillsPage } from './pages/EmergingSkillsPage';
import { AdminAuditLogPage } from './pages/AdminAuditLogPage';
import { ProfilePage } from './pages/ProfilePage';
import { Language } from './utils/i18n';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedOfficerId, setSelectedOfficerId] = useState<number | null>(null);
  const [quizParams, setQuizParams] = useState<{ title: string; questions: Question[] } | null>(null);
  const [lang, setLang] = useState<Language>('en');
  const [loading, setLoading] = useState(true);

  // Initialize with official user
  useEffect(() => {
    const initUser = async () => {
      try {
        setLoading(true);
        const user = await authService.getCurrentUser('official@statskill.gov.in');
        setCurrentUser(user);
      } catch (err) {
        console.error('Error initializing user:', err);
      } finally {
        setLoading(false);
      }
    };
    initUser();
  }, []);

  const handleLogin = async (email: string, role: UserRole) => {
    try {
      const user = await authService.login(email);
      user.role = role;
      setCurrentUser(user);
      if (role === 'admin') {
        setCurrentView('admin-dashboard');
      } else {
        setCurrentView('dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleSwitchUserRole = async (targetRole: UserRole) => {
    const email = targetRole === 'admin' ? 'admin@statskill.gov.in' : 'official@statskill.gov.in';
    try {
      const user = await authService.login(email);
      user.role = targetRole;
      setCurrentUser(user);
      if (targetRole === 'admin') {
        setCurrentView('admin-dashboard');
      } else {
        setCurrentView('dashboard');
      }
    } catch (err) {
      console.error('Switch role error:', err);
    }
  };

  const handleStartQuiz = (title: string, questions: Question[]) => {
    setQuizParams({ title, questions });
    setCurrentView('quiz-taking');
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setCurrentView('course-detail');
  };

  const handleSelectOfficer = (officerId: number) => {
    setSelectedOfficerId(officerId);
    setCurrentView('admin-officer-detail');
  };

  if (!currentUser || currentView === 'login') {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-left">
      <Navbar
        user={currentUser}
        onSwitchUser={handleSwitchUserRole}
        onNavigate={setCurrentView}
        lang={lang}
        onToggleLang={() => setLang(l => l === 'en' ? 'hi' : 'en')}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          role={currentUser.role}
        />

        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full custom-scrollbar">
          {currentView === 'dashboard' && (
            <LearnerDashboard user={currentUser} onNavigate={setCurrentView} />
          )}

          {currentView === 'competencies' && (
            <CompetencyProfilePage user={currentUser} onNavigate={setCurrentView} />
          )}

          {currentView === 'competency-assessment' && (
            <CompetencyAssessmentPage user={currentUser} onNavigate={setCurrentView} />
          )}

          {currentView === 'skill-gap' && (
            <SkillGapPage user={currentUser} onNavigate={setCurrentView} />
          )}

          {currentView === 'learning-path' && (
            <LearningPathPage user={currentUser} onNavigate={setCurrentView} />
          )}

          {currentView === 'igot-courses' && (
            <CourseRepositoryPage
              user={currentUser}
              onNavigate={setCurrentView}
              onSelectCourse={handleSelectCourse}
            />
          )}

          {currentView === 'course-detail' && selectedCourse && (
            <CourseDetailPage
              course={selectedCourse}
              user={currentUser}
              onBack={() => setCurrentView('igot-courses')}
            />
          )}

          {currentView === 'mcq-generator' && (
            <McqGeneratorPage user={currentUser} onStartQuiz={handleStartQuiz} />
          )}

          {currentView === 'quiz-taking' && quizParams && (
            <QuizTakingPage
              user={currentUser}
              title={quizParams.title}
              questions={quizParams.questions}
              onComplete={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'statbot' && <StatBotPage user={currentUser} />}

          {currentView === 'progress' && <ProgressPage user={currentUser} />}

          {currentView === 'profile' && (
            <ProfilePage user={currentUser} onUpdateUser={setCurrentUser} />
          )}

          {currentView === 'admin-dashboard' && (
            <AdminDashboard onNavigate={setCurrentView} />
          )}

          {currentView === 'admin-officers' && (
            <AdminOfficersPage onSelectOfficer={handleSelectOfficer} />
          )}

          {currentView === 'admin-officer-detail' && selectedOfficerId && (
            <AdminOfficerDetailPage
              officerId={selectedOfficerId}
              onBack={() => setCurrentView('admin-officers')}
            />
          )}

          {currentView === 'admin-heatmap' && <CompetencyHeatmapPage />}

          {currentView === 'admin-emerging' && <EmergingSkillsPage />}

          {currentView === 'admin-audit-log' && <AdminAuditLogPage />}
        </main>
      </div>
    </div>
  );
}

export default App;

