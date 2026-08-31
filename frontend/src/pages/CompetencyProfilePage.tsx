import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, TrendingUp, HelpCircle, Layers, ArrowRight } from 'lucide-react';
import { User, UserCompetencyResponse } from '../types';
import { competencyService } from '../services/api';

interface CompetencyProfilePageProps {
  user: User;
  onNavigate: (view: string) => void;
}

export const CompetencyProfilePage: React.FC<CompetencyProfilePageProps> = ({ user, onNavigate }) => {
  const [compData, setCompData] = useState<UserCompetencyResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>('All');

  useEffect(() => {
    const fetchCompetencies = async () => {
      try {
        const data = await competencyService.getUserCompetencies(user.id);
        setCompData(data);
      } catch (err) {
        console.error('Error fetching competencies:', err);
      }
    };
    fetchCompetencies();
  }, [user.id]);

  const categories = ['All', 'Statistical', 'Technical', 'Digital Governance', 'Behavioural & Managerial'];

  const filteredCompetencies = compData?.competencies.filter(c => {
    if (activeTab === 'All') return true;
    return c.category === activeTab;
  }) || [];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded uppercase tracking-wide">
              Official Competency Framework
            </span>
            <span className="text-xs text-slate-500">• MoSPI Skill Mapping</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Competency Profile & Skill Benchmark</h1>
          <p className="text-xs text-slate-600">
            Comprehensive evaluation of competencies required for <strong className="text-slate-900">{user.designation}</strong> in <strong className="text-slate-900">{user.department?.name || 'MoSPI'}</strong>.
          </p>
        </div>

        <button
          onClick={() => onNavigate('competency-assessment')}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl transition flex items-center gap-2 text-sm shadow-md shadow-amber-500/20 shrink-0"
        >
          <Award className="w-4 h-4" />
          <span>Take Self-Assessment Quiz</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 overflow-x-auto pb-2 custom-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition ${
              activeTab === cat
                ? 'bg-slate-900 text-white shadow'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Competencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCompetencies.map((comp) => {
          const current = comp.current_score;
          const required = comp.required_score;
          const gap = comp.gap;

          return (
            <div key={comp.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 hover:border-slate-300 transition">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-base">{comp.name}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      comp.level === 'Advanced' ? 'bg-emerald-100 text-emerald-800' :
                      comp.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {comp.level}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{comp.category}</div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-slate-900">{current}%</div>
                  <div className="text-[11px] text-slate-500">Benchmark: {required}%</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      gap === 0 ? 'bg-emerald-500' : gap > 20 ? 'bg-rose-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, current)}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Gap Score: <strong className={gap > 20 ? 'text-rose-600 font-bold' : 'text-slate-700'}>{gap}%</strong></span>
                  <span className="text-slate-400">Target Level: 80%</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                <span className="text-slate-500 italic text-[11px]">{comp.description || 'Core MoSPI competency'}</span>
                <button
                  onClick={() => onNavigate('skill-gap')}
                  className="text-amber-600 font-bold hover:underline"
                >
                  View Gap Priority →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
