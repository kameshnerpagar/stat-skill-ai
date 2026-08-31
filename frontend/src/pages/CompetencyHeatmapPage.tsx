import React, { useEffect, useState } from 'react';
import { Grid, Sparkles, Filter, Info } from 'lucide-react';
import { AdminAnalytics } from '../types';
import { analyticsService } from '../services/api';

export const CompetencyHeatmapPage: React.FC = () => {
  const [data, setData] = useState<AdminAnalytics | null>(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await analyticsService.getAdminAnalytics();
        setData(res);
      } catch (err) {
        console.error('Error fetching heatmap data:', err);
      }
    };
    fetchAdmin();
  }, []);

  const heatmap = data?.heatmap_matrix || {};
  const competencies = ["Python", "SQL", "AI/ML", "GIS", "Cloud", "Data Privacy", "Survey Sampling"];
  const departments = Object.keys(heatmap);

  const getCellColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500 text-white font-bold';
    if (score >= 70) return 'bg-emerald-100 text-emerald-900 font-bold';
    if (score >= 60) return 'bg-amber-100 text-amber-900 font-bold';
    if (score >= 45) return 'bg-rose-100 text-rose-900 font-bold';
    return 'bg-rose-600 text-white font-bold';
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Administrative Competency Heatmap
            </span>
            <span className="text-xs text-slate-400 font-mono">• Cross-Departmental Matrix</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Department vs Competency Heatmap</h1>
          <p className="text-xs text-slate-300">
            Visualizing skill strength intensity across divisions to identify systemic workforce capability gaps.
          </p>
        </div>

        {/* Intensity Legend */}
        <div className="flex items-center space-x-2 text-xs bg-slate-800 p-2.5 rounded-xl border border-slate-700">
          <span className="text-slate-400">Score Range:</span>
          <span className="bg-rose-600 text-white px-2 py-0.5 rounded font-mono text-[10px]">&lt;45% Critical</span>
          <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono text-[10px]">60-69% Mod</span>
          <span className="bg-emerald-500 text-white px-2 py-0.5 rounded font-mono text-[10px]">80%+ High</span>
        </div>
      </div>

      {/* Heatmap Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-mono uppercase border-b border-slate-200">
                <th className="py-3 px-4 text-left font-bold">Department / Division</th>
                {competencies.map((comp, idx) => (
                  <th key={idx} className="py-3 px-3 font-bold">{comp}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departments.map((dept, dIdx) => (
                <tr key={dIdx} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 text-left font-bold text-slate-900">{dept}</td>
                  {competencies.map((comp, cIdx) => {
                    const score = heatmap[dept]?.[comp] || 50;
                    return (
                      <td key={cIdx} className="py-3.5 px-2">
                        <div className={`py-1.5 px-2 rounded-lg text-xs transition ${getCellColor(score)}`}>
                          {score}%
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-500" />
            <span>Heatmap Insights for Capacity Building Committee:</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            • <strong>Survey Operations Division</strong> shows strong proficiency in <em>Survey Sampling (92%)</em> and <em>GIS (78%)</em>, but critical vulnerability in <em>AI/ML (30%)</em> and <em>Cloud Computing (40%)</em>.
          </p>
          <p className="leading-relaxed text-[11px]">
            • <strong>National Accounts Division</strong> requires urgent upskilling in <em>Python (58%)</em> and <em>Cloud (48%)</em> to support automated GVA database compilation.
          </p>
        </div>
      </div>
    </div>
  );
};
