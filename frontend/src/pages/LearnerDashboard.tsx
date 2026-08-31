import React, { useEffect, useState } from 'react';
import {
  Award,
  TrendingDown,
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  BrainCircuit,
  Zap,
  Target
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { User, UserCompetencyResponse, SkillGap, Recommendation } from '../types';
import { competencyService, courseService } from '../services/api';

interface LearnerDashboardProps {
  user: User;
  onNavigate: (view: string) => void;
}

export const LearnerDashboard: React.FC<LearnerDashboardProps> = ({ user, onNavigate }) => {
  const [compData, setCompData] = useState<UserCompetencyResponse | null>(null);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [compRes, gapsRes, recsRes] = await Promise.all([
          competencyService.getUserCompetencies(user.id),
          competencyService.getSkillGaps(user.email),
          courseService.getRecommendations(user.email)
        ]);
        setCompData(compRes);
        setSkillGaps(gapsRes);
        setRecommendations(recsRes);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id, user.email]);

  const radarData = [
    { domain: 'Statistical', score: 82, fullMark: 100 },
    { domain: 'Technical', score: 61, fullMark: 100 },
    { domain: 'Digital Governance', score: 48, fullMark: 100 },
    { domain: 'Behavioural & Managerial', score: 72, fullMark: 100 },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner / Learner Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                Official Learner Dashboard
              </span>
              <span className="text-slate-400 text-xs font-mono">• ID: EMP-4092</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {user.full_name}
            </h1>
            <p className="text-sm text-slate-300">
              {user.designation} • <strong className="text-white">{user.department?.name || 'Data Analytics Division'}</strong> ({user.experience_years} years exp)
            </p>
            <p className="text-xs text-slate-400">
              Current Assignment: <span className="text-slate-200">{user.current_assignment}</span>
            </p>
          </div>

          {/* Overall Score Badge */}
          <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-xl flex items-center space-x-4 min-w-[240px]">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
              {compData?.overall_score || user.overall_competency_score}%
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Overall Competency Score</div>
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                <span>Intermediate Level</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">30 Skills Evaluated</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insight Highlight Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-xl p-4 flex items-start space-x-3.5 shadow-sm">
        <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400 shrink-0">
          <BrainCircuit className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
            AI Competency Intelligence Insight
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed">
            {compData?.ai_insight || "Based on your role, experience and assessment performance, strengthening Python, SQL and Cloud Computing will have the highest impact on your current responsibilities."}
          </p>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium mb-1">Assessed Skills</div>
          <div className="text-2xl font-extrabold text-slate-900">30</div>
          <div className="text-[11px] text-slate-500 mt-1">Across 4 domains</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium mb-1">Critical Gaps</div>
          <div className="text-2xl font-extrabold text-rose-600">3</div>
          <div className="text-[11px] text-rose-600/80 font-medium mt-1">Cloud, Python, Privacy</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium mb-1">Courses Completed</div>
          <div className="text-2xl font-extrabold text-emerald-600">2</div>
          <div className="text-[11px] text-slate-500 mt-1">iGOT & NSSTA</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium mb-1">Learning Hours</div>
          <div className="text-2xl font-extrabold text-blue-600 flex items-center gap-1">
            <span>38</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-[11px] text-slate-500 mt-1">+6 hrs this month</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium mb-1">Learning Streak</div>
          <div className="text-2xl font-extrabold text-amber-600 flex items-center gap-1">
            <span>5</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Active days</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-xs font-medium mb-1">Career Goal Fit</div>
          <div className="text-2xl font-extrabold text-purple-600">84%</div>
          <div className="text-[11px] text-slate-500 mt-1">Data Science Path</div>
        </div>
      </div>

      {/* Domain Breakdown & Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Radar Chart Card */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Competency Framework Radar</h2>
              <p className="text-xs text-slate-500">Evaluation across India's Statistical Competency Framework</p>
            </div>
            <button 
              onClick={() => onNavigate('competencies')}
              className="text-xs text-amber-600 font-bold hover:underline"
            >
              View Full Matrix →
            </button>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="domain" tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Ananya Sharma" dataKey="score" stroke="#d97706" fill="#f59e0b" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Domain Summary Pills */}
          <div className="grid grid-cols-2 gap-2.5 pt-4 text-xs">
            <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg flex items-center justify-between">
              <span className="font-medium text-emerald-900">Statistical Methods</span>
              <span className="font-extrabold text-emerald-700">82% (Strongest)</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg flex items-center justify-between">
              <span className="font-medium text-amber-900">Technical Skills</span>
              <span className="font-extrabold text-amber-700">61% (Priority)</span>
            </div>
            <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-lg flex items-center justify-between">
              <span className="font-medium text-rose-900">Digital Governance</span>
              <span className="font-extrabold text-rose-700">48% (Critical Gap)</span>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-lg flex items-center justify-between">
              <span className="font-medium text-blue-900">Behavioural & Mgmt</span>
              <span className="font-extrabold text-blue-700">72% (Proficient)</span>
            </div>
          </div>
        </div>

        {/* Top Priority Skill Gaps */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Top Priority Skill Gaps</h2>
                <p className="text-xs text-slate-500">Calculated via multi-factor priority algorithm</p>
              </div>
              <button 
                onClick={() => onNavigate('skill-gap')}
                className="text-xs text-amber-600 font-bold hover:underline"
              >
                Full Analysis →
              </button>
            </div>

            <div className="space-y-3">
              {skillGaps.slice(0, 4).map((gap) => (
                <div key={gap.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-900">{gap.skill_name}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        gap.priority.toUpperCase() === 'CRITICAL' ? 'bg-rose-100 text-rose-700 border border-rose-300' :
                        gap.priority.toUpperCase() === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {gap.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{gap.priority_reason}</p>
                  </div>

                  <div className="text-right shrink-0 ml-4">
                    <div className="text-xs font-bold text-slate-700">Gap: {gap.gap_score}%</div>
                    <div className="text-[11px] text-slate-500">Current {gap.current_score}% / Target {gap.required_score}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Need diagnostic reassessment?</span>
            <button
              onClick={() => onNavigate('competency-assessment')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-1.5 rounded-lg transition"
            >
              Take Competency Assessment →
            </button>
          </div>
        </div>
      </div>

      {/* iGOT & NSSTA Top Personalized Recommendations */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" />
              <span>Recommended iGOT Karmayogi Courses & NSSTA Programmes</span>
            </h2>
            <p className="text-xs text-slate-500">Personalized matching based on your role, gaps, and career goals</p>
          </div>
          <button 
            onClick={() => onNavigate('learning-path')}
            className="text-xs text-amber-600 font-bold hover:underline"
          >
            View Learning Pathway →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.slice(0, 3).map((rec, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between hover:border-amber-400 transition group">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                    rec.course.provider_type === 'nssta' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {rec.course.provider}
                  </span>
                  <span className="font-bold text-amber-600">{rec.match_score}% Match</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition mb-2">
                  {rec.course.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                  {rec.course.description}
                </p>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1 mb-3">
                  <div className="font-semibold text-amber-700 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Why recommended?</span>
                  </div>
                  <p className="text-[11px] text-slate-600 italic line-clamp-2">{rec.ai_reason}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
                <span className="text-slate-500">{rec.course.duration}</span>
                <button
                  onClick={() => onNavigate('igot-courses')}
                  className="text-amber-600 font-bold hover:underline"
                >
                  Enroll Now →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
