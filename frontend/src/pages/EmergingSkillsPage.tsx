import React, { useEffect, useState } from 'react';
import { Zap, TrendingUp, Sparkles, ShieldAlert, BookOpen, ArrowRight } from 'lucide-react';
import { AdminAnalytics } from '../types';
import { analyticsService } from '../services/api';

export const EmergingSkillsPage: React.FC = () => {
  const [data, setData] = useState<AdminAnalytics | null>(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await analyticsService.getAdminAnalytics();
        setData(res);
      } catch (err) {
        console.error('Error fetching emerging skills data:', err);
      }
    };
    fetchAdmin();
  }, []);

  const skills = data?.emerging_skills || [];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Future Skill Demand Forecasting
            </span>
            <span className="text-xs text-slate-400 font-mono">• 2-3 Year Horizon</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Emerging Skill Requirements (MoSPI Vision 2028)</h1>
          <p className="text-xs text-slate-300">
            Projected workforce competency requirements driven by AI adoption, big data, cloud computing, and modern survey automation.
          </p>
        </div>
      </div>

      {/* Highlights Box */}
      <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl space-y-2">
        <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <span>Predictive Strategic Insight</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          "AI/ML and Cloud Infrastructure show the highest projected competency demand over the next 2-3 years. Current workforce coverage in AI/ML is only <strong className="text-slate-900">31%</strong> against a projected requirement of <strong className="text-slate-900">78%</strong>. Pre-emptive deployment of iGOT Karmayogi courses is recommended to avoid critical capability bottlenecks."
        </p>
      </div>

      {/* Emerging Skills Grid */}
      <div className="space-y-4">
        {skills.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>{item.skill}</span>
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-0.5 rounded text-xs font-extrabold uppercase ${
                  item.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-amber-100 text-amber-800'
                }`}>
                  {item.priority} Future Demand
                </span>
                <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                  {item.gap}% Gap
                </span>
              </div>
            </div>

            {/* Comparison Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 font-medium">
                  <span>Current Workforce Coverage:</span>
                  <span className="font-bold text-slate-900">{item.current_coverage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-slate-500 h-full" style={{ width: `${item.current_coverage}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 font-medium">
                  <span>Projected Future Demand (2028):</span>
                  <span className="font-bold text-emerald-700">{item.future_demand}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${item.future_demand}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
