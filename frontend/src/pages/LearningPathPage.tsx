import React, { useEffect, useState } from 'react';
import { Route, Sparkles, BookOpen, CheckCircle2, ArrowRight, Clock, Award, ShieldCheck } from 'lucide-react';
import { User, Recommendation } from '../types';
import { courseService } from '../services/api';

interface LearningPathPageProps {
  user: User;
  onNavigate: (view: string) => void;
}

export const LearningPathPage: React.FC<LearningPathPageProps> = ({ user, onNavigate }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        setLoading(true);
        const data = await courseService.getRecommendations(user.email);
        setRecommendations(data);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, [user.email]);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded uppercase tracking-wide">
              Personalized Capacity Building Roadmap
            </span>
            <span className="text-xs text-slate-500">• iGOT Karmayogi & NSSTA Integration</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Learner Upskilling Pathway</h1>
          <p className="text-xs text-slate-600">
            Tailored learning path for <strong className="text-slate-900">{user.full_name}</strong> based on identified competency gaps and career goal: <em className="text-slate-800">"{user.career_goal}"</em>.
          </p>
        </div>

        <button
          onClick={() => onNavigate('igot-courses')}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl transition text-xs shrink-0"
        >
          Explore All iGOT Courses →
        </button>
      </div>

      {/* Visual Roadmap Steps */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-8 before:w-0.5 before:bg-slate-200 before:z-0">
        {recommendations.map((rec, index) => {
          const course = rec.course;
          const isNSSTA = course.provider_type === 'nssta';

          return (
            <div key={course.id} className="relative z-10 flex items-start space-x-6">
              {/* Step Number Circle */}
              <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold text-sm shrink-0 shadow-md ${
                index === 0
                  ? 'bg-amber-500 text-slate-950 shadow-amber-500/20 ring-4 ring-amber-100'
                  : 'bg-slate-900 text-white'
              }`}>
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Step</span>
                <span className="text-lg font-extrabold">{index + 1}</span>
              </div>

              {/* Course Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex-1 space-y-4 hover:border-amber-400 transition">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                      isNSSTA
                        ? 'bg-purple-100 text-purple-900 border border-purple-300'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}>
                      {isNSSTA ? 'NSSTA Recommended Training Programme' : 'iGOT Karmayogi Course'}
                    </span>
                    <span className="text-xs text-slate-500">• {course.category}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {rec.match_score}% Match Score
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      rec.priority === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {rec.priority} Priority
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">{course.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">{course.description}</p>
                </div>

                {/* AI Explanation Box */}
                <div className="bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-xl space-y-1 text-xs">
                  <div className="font-bold text-amber-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Why this course is recommended for you?</span>
                  </div>
                  <p className="text-slate-700 italic text-[11px] leading-relaxed">{rec.ai_reason}</p>
                </div>

                {/* Course Metadata & Skills Developed */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-500 font-medium">Duration:</span>
                    <span className="font-bold text-slate-900 ml-1.5">{course.duration}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Provider:</span>
                    <span className="font-bold text-slate-900 ml-1.5">{course.provider}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Expected Improvement:</span>
                    <span className="font-bold text-emerald-700 ml-1.5">+18% to +25% Competency</span>
                  </div>
                </div>

                {/* Skills Chips & Action Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {course.skills_covered.map((skill, sIdx) => (
                      <span key={sIdx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onNavigate('igot-courses')}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl transition text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 shrink-0"
                  >
                    <span>Start Learning</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
