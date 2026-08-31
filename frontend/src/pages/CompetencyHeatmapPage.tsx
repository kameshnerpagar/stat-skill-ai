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

  const handleExportCSV = () => {
    if (!heatmap) return;
    const headers = ['Department', ...competencies];
    const rows = departments.map(dept => [
      `"${dept}"`,
      ...competencies.map(comp => heatmap[dept]?.[comp] || 50)
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MoSPI_Competency_Heatmap_Matrix_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-left max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-lg border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-900/60 text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-700 font-mono">
              Administrative Competency Heatmap
            </span>
            <span className="text-xs text-slate-400 font-mono">• Cross-Departmental Matrix</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Department vs Competency Heatmap Matrix</h1>
          <p className="text-xs text-slate-300">
            Visualizing skill strength intensity across divisions to identify systemic workforce capability gaps.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition shadow-sm"
          >
            <span>Export Heatmap (CSV)</span>
          </button>
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
